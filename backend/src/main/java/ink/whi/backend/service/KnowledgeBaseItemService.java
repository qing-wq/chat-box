package ink.whi.backend.service;

import com.baomidou.mybatisplus.extension.service.IService;
import ink.whi.backend.common.dto.knowledgeBase.KbItemDto;
import ink.whi.backend.dao.entity.KnowledgeBaseItem;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

/**
 * 知识库条目服务接口
 *
 * @author: qing
 * @Date: 2025/7/27
 */
public interface KnowledgeBaseItemService extends IService<KnowledgeBaseItem> {

    /**
     * 根据知识库ID查询条目列表
     *
     * @param kbId 知识库ID
     * @return 条目列表
     */
    List<KbItemDto> listItemByKbId(Integer kbId);

    /**
     * 上传文档并保存为知识库条目
     *
     * @param kbId 知识库ID
     * @param docs 文档文件数组
     * @return 是否成功
     */
    boolean uploadDocs(Integer kbId, MultipartFile[] docs);

    KnowledgeBaseItem uploadDoc(Integer kbId, MultipartFile doc);

    /**
     * 删除知识库条目
     *
     * @param itemId 条目ID
     * @return 是否成功
     */
    boolean deleteItem(String itemId);
}
