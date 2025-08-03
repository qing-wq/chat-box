package ink.whi.backend.controller;

import ink.whi.backend.dao.converter.KnowledgeBaseItemConverter;
import ink.whi.backend.common.dto.ResVo;
import ink.whi.backend.common.dto.knowledgeBase.KbItemDto;
import ink.whi.backend.common.status.StatusEnum;
import ink.whi.backend.dao.entity.KnowledgeBaseItem;
import ink.whi.backend.service.KnowledgeBaseItemService;
import jakarta.annotation.Resource;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

/**
 * 知识库条目接口
 * @author: qing
 * @Date: 2025/7/27
 */
@Slf4j
@RestController
@RequestMapping("/api/kb-item")
public class KnowledgeBaseItemController {

    @Resource
    private KnowledgeBaseItemService knowledgeBaseItemService;

    /**
     * 获取指定知识库下的所有条目
     * 
     * @param kbId 知识库ID
     * @return 知识库条目列表
     */
    @GetMapping("list/{kbId}")
    public ResVo<List<KbItemDto>> listItem(@PathVariable Integer kbId) {
        List<KbItemDto> items = knowledgeBaseItemService.listItemByKbId(kbId);
        return ResVo.ok(items);
    }

    /**
     * 上传文档到指定知识库
     * 
     * @param kbId 知识库ID
     * @param docs 文档文件数组
     * @return 上传结果
     */
//    @PostMapping(path = "/uploadDocs", headers = "content-type=multipart/form-data", produces = MediaType.APPLICATION_JSON_VALUE)
//    public ResVo<String> uploadDocs(@RequestParam Integer kbId,
//                                    @RequestParam("files") MultipartFile[] docs) {
//        try {
//            boolean result = knowledgeBaseItemService.uploadDocs(kbId, docs);
//            return result ? ResVo.ok("上传成功") : ResVo.fail(StatusEnum.UNEXPECT_ERROR, "上传失败");
//        } catch (Exception e) {
//            log.error("上传文档失败: {}", e.getMessage(), e);
//            return ResVo.fail(StatusEnum.UNEXPECT_ERROR, "上传失败: " + e.getMessage());
//        }
//    }

    /**
     * 上传、解析并索引文档
     *
     * @param doc              二进制文件
     * @return 上传成功的文件信息
     */
    @PostMapping(path = "/upload/{kbId}", headers = "content-type=multipart/form-data", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResVo<KbItemDto> upload(@PathVariable Integer kbId,
                          @RequestParam("file") MultipartFile doc) {
        KnowledgeBaseItem item = knowledgeBaseItemService.uploadDoc(kbId, doc);
        return ResVo.ok(KnowledgeBaseItemConverter.toDto(item));
    }

    /**
     * 删除知识库中的指定条目
     * 
     * @param itemId 知识库条目ID
     * @return 删除结果
     */
    @GetMapping("del/{itemId}")
    public ResVo<String> deleteItem(@PathVariable String itemId) {
        try {
            boolean result = knowledgeBaseItemService.deleteItem(itemId);
            return result ? ResVo.ok("删除成功") : ResVo.fail(StatusEnum.UNEXPECT_ERROR, "删除失败");
        } catch (Exception e) {
            log.error("删除条目失败: {}", e.getMessage(), e);
            return ResVo.fail(StatusEnum.UNEXPECT_ERROR, "删除失败: " + e.getMessage());
        }
    }
}
