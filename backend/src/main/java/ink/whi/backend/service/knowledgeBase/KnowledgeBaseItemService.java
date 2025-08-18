package ink.whi.backend.service.knowledgeBase;

import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import dev.langchain4j.data.document.Document;
import ink.whi.backend.common.dto.knowledgeBase.ProcessSetting;
import ink.whi.backend.dao.converter.KnowledgeBaseItemConverter;
import ink.whi.backend.common.dto.knowledgeBase.KbItemDto;
import ink.whi.backend.common.enums.EmbeddingStatusEnum;
import ink.whi.backend.common.exception.BusinessException;
import ink.whi.backend.common.status.StatusEnum;
import ink.whi.backend.dao.entity.BaseFile;
import ink.whi.backend.dao.entity.KnowledgeBase;
import ink.whi.backend.dao.entity.KnowledgeBaseItem;
import ink.whi.backend.dao.mapper.KnowledgeBaseItemMapper;
import ink.whi.backend.service.file.LocalFileOperator;
import ink.whi.backend.service.rag.EmbeddingRagService;
import ink.whi.backend.service.file.FileService;
import jakarta.annotation.Resource;
import lombok.extern.slf4j.Slf4j;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.CompletableFuture;
import java.util.stream.Collectors;

/**
 * 知识库条目服务实现
 *
 * @author: qing
 * @Date: 2025/7/27
 */
@Slf4j
@Service
public class KnowledgeBaseItemService extends ServiceImpl<KnowledgeBaseItemMapper, KnowledgeBaseItem> {

    @Resource
    private KnowledgeBaseService knowledgeBaseService;

    @Resource
    private FileService fileService;

    @Resource
    private EmbeddingRagService embeddingRAGService;

    /**
     * 根据知识库ID查询条目列表
     *
     * @param kbId 知识库ID
     * @return 条目列表
     */
    public List<KbItemDto> listItemByKbId(Integer kbId) {
        // 检查知识库权限
        knowledgeBaseService.getAndCheck(kbId);

        // 查询条目列表
        List<KnowledgeBaseItem> items = lambdaQuery()
                .eq(KnowledgeBaseItem::getKbId, kbId)
                .orderByDesc(KnowledgeBaseItem::getCreateTime)
                .list();

        return items.stream()
                .map(KnowledgeBaseItemConverter::toDto)
                .collect(Collectors.toList());
    }

    /**
     * 上传文档并保存为知识库条目
     *
     * @param kbId 知识库ID
     * @param docs 文档文件数组
     * @return 是否成功
     */
    public boolean uploadDocs(Integer kbId, MultipartFile[] docs) {
        if (docs == null || docs.length == 0) {
            throw BusinessException.newInstance(StatusEnum.ILLEGAL_ARGUMENTS_MIXED, "文档不能为空");
        }

        List<KnowledgeBaseItem> items = new ArrayList<>();
        for (MultipartFile doc : docs) {
            uploadDoc(kbId, doc);
        }

        return true;
    }

    @Transactional
    public KnowledgeBaseItem uploadDoc(Integer kbId, MultipartFile doc) {
        // 检查知识库权限
        KnowledgeBase kb = knowledgeBaseService.getAndCheck(kbId);
        // 1. 上传文件到本地
        BaseFile baseFile = fileService.upload(doc);

        // 2. 将文件转为kb item并保存
        KnowledgeBaseItem item = saveItemFormFile(baseFile, kb);

        // 3. 异步索引文档
        asyncIndexDocument(baseFile, item);
        return getById(item.getId());
    }

    /**
     * 异步索引文档
     *
     * @param baseFile 文件信息
     * @param item     知识库条目
     */
    private void asyncIndexDocument(BaseFile baseFile, KnowledgeBaseItem item) {
        CompletableFuture.runAsync(() -> {
            try {
                // 更新状态为切分中
                updateItemStatus(item.getId(), EmbeddingStatusEnum.SPLITTING);

                // 1. 使用fileOperator加载文档
                Document document = LocalFileOperator.loadDocument(baseFile.getPath(), baseFile.getExt());
                if (document == null) {
                    updateItemStatus(item.getId(), EmbeddingStatusEnum.FAILED);
                    return;
                }

                // 2. 设置文档元数据
                document.metadata().put("kbItemId", item.getId().toString());
                document.metadata().put("kbId", item.getKbId().toString());

                // 3. DocumentSplitter & 4. EmbeddingStoreIngestor
                KnowledgeBase kb = knowledgeBaseService.getById(item.getKbId());
                ProcessSetting settings = ProcessSetting.builder()
                        .blockSize(kb.getBlockSize())
                        .maxOverlap(kb.getMaxOverlap())
                        .processType(kb.getProcessType())
                        .build();
                embeddingRAGService.ingest(document, settings);

                // 更新状态为已索引
                updateItemStatus(item.getId(), EmbeddingStatusEnum.INDEXED);

                // todo 设置item 向量数
            } catch (Exception e) {
                log.error("索引文档失败: {}", e.getMessage(), e);
                updateItemStatus(item.getId(), EmbeddingStatusEnum.FAILED);
            }
        });
    }

    public KnowledgeBaseItem saveItemFormFile(BaseFile file, KnowledgeBase kb) {
        KnowledgeBaseItem item = new KnowledgeBaseItem();
        item.setKbId(kb.getId());
        item.setTitle(file.getFileName());
        item.setIsEnable(true);
        item.setSourceId(file.getId());
        item.setSourceName(file.getFileName());
        item.setProcessType(kb.getProcessType());
        item.setEmbeddingStatus(EmbeddingStatusEnum.PENDING);
        item.setEmbeddingStatusChangeTime(LocalDateTime.now());

        save(item);
        return item;
    }

    /**
     * 更新条目状态
     *
     * @param itemId 状态
     * @param status 状态
     */
    private void updateItemStatus(Integer itemId, EmbeddingStatusEnum status) {
        KnowledgeBaseItem item = new KnowledgeBaseItem();
        item.setId(itemId);
        item.setEmbeddingStatus(status);
        item.setEmbeddingStatusChangeTime(LocalDateTime.now());
        updateById(item);
    }

    /**
     * 删除知识库条目
     *
     * @param itemId 条目ID
     * @return 是否成功
     */
    @Transactional
    public boolean deleteItem(String itemId) {
        if (itemId == null) {
            throw BusinessException.newInstance(StatusEnum.ILLEGAL_ARGUMENTS_MIXED, "条目ID不能为空");
        }

        KnowledgeBaseItem item = getById(itemId);
        if (item == null) {
            throw BusinessException.newInstance(StatusEnum.ILLEGAL_ARGUMENTS_MIXED, "条目不存在");
        }

        // 检查权限
        knowledgeBaseService.getAndCheck(item.getKbId().intValue());

        // 删除条目
        removeById(itemId);
        return true;
    }
}
