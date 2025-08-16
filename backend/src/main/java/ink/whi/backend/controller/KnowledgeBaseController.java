package ink.whi.backend.controller;

import ink.whi.backend.common.context.ReqInfoContext;
import ink.whi.backend.common.dto.ResVo;
import ink.whi.backend.common.dto.knowledgeBase.KbCreateReq;
import ink.whi.backend.common.dto.knowledgeBase.KbUpdateReq;
import ink.whi.backend.common.dto.knowledgeBase.KbDetailVO;
import ink.whi.backend.common.dto.knowledgeBase.SimpleKbDto;
import ink.whi.backend.common.enums.ProcessTypeEnum;
import ink.whi.backend.common.status.StatusEnum;
import ink.whi.backend.dao.entity.KnowledgeBase;
import ink.whi.backend.service.knowledgeBase.KnowledgeBaseService;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * 知识库接口
 *
 * @author: qing
 * @Date: 2025/7/25
 */
@RestController
@RequestMapping("api/kb")
public class KnowledgeBaseController {

    @Autowired
    private KnowledgeBaseService knowledgeBaseService;

    /**
     * 创建知识库
     *
     * @param kbCreateReq 知识库创建请求参数
     * @return 知识库信息
     */
    @PostMapping(path = "/create")
    public ResVo<KnowledgeBase> create(@RequestBody KbCreateReq kbCreateReq) {
        KnowledgeBase knowledgeBase = new KnowledgeBase();

        // 重名校验
        KnowledgeBase record = knowledgeBaseService.getByTitle(kbCreateReq.getTitle());
        if (record != null) {
            return ResVo.fail(StatusEnum.ILLEGAL_ARGUMENTS_MIXED, "知识库名重复");
        }

        BeanUtils.copyProperties(kbCreateReq, knowledgeBase);
        knowledgeBase.setOwnerId(ReqInfoContext.getUserId());

        // 设置默认参数
        knowledgeBase.setProcessType(ProcessTypeEnum.DIRECT);
        knowledgeBase.setBlockSize(512);
        knowledgeBase.setIsPublic(true);
        knowledgeBase.setMaxOverlap(0);
        knowledgeBase.setRetrieveMaxResults(3);
        knowledgeBase.setRetrieveMinScore(0.6);

        // todo 校验模型类型

        knowledgeBaseService.save(knowledgeBase);
        return ResVo.ok(knowledgeBase);
    }

    /**
     * 更新知识库
     *
     * @param kbUpdateReq 知识库更新请求参数
     * @return 知识库信息
     */
    @PostMapping(path = "/update")
    public ResVo<KnowledgeBase> update(@RequestBody KbUpdateReq kbUpdateReq) {
        if (kbUpdateReq.getId() == null) {
            return ResVo.fail(StatusEnum.ILLEGAL_ARGUMENTS_MIXED, "id不能为空");
        }

        if (kbUpdateReq.getProcessType() != null) {
            ProcessTypeEnum type = ProcessTypeEnum.ofName(kbUpdateReq.getProcessType());
            if (type == null) {
                return ResVo.fail(StatusEnum.ILLEGAL_ARGUMENTS_MIXED, "processType不合法");
            }
        }

        KnowledgeBase result = knowledgeBaseService.update(kbUpdateReq);
        return ResVo.ok(result);
    }

    /**
     * 获取当前用户的知识库列表
     *
     * @return ResVo<List <SimpleKbDto>> 返回当前用户拥有的知识库简要信息列表
     *         包含知识库的基本信息：标题、描述、是否公开等
     */
    @GetMapping("list")
    public ResVo<List<SimpleKbDto>> list() {
        try {
            List<SimpleKbDto> result = knowledgeBaseService.listKnowledgeBases();
            return ResVo.ok(result);
        } catch (Exception e) {
            return ResVo.fail(StatusEnum.UNEXPECT_ERROR, e.getMessage());
        }
    }

    /**
     * 获取知识库详细信息
     *
     * @param id 知识库ID
     * @return ResVo<KbDetailVO> 返回知识库的详细信息
     *         包含知识库基本信息和关联的文档项目列表
     *         如果知识库不存在，返回错误信息
     */
    @GetMapping("detail/{id}")
    public ResVo<KbDetailVO> detail(@PathVariable String id) {
        try {
            KbDetailVO result = knowledgeBaseService.detail(id);
            if (result == null) {
                return ResVo.fail(StatusEnum.RECORDS_NOT_EXISTS, "知识库");
            }
            return ResVo.ok(result);
        } catch (Exception e) {
            return ResVo.fail(StatusEnum.UNEXPECT_ERROR, e.getMessage());
        }
    }

    /**
     * 删除接口
     * @param id
     * @return
     */
    @GetMapping("del/{id}")
    public ResVo<String> del(@PathVariable Integer id) {
        knowledgeBaseService.deleteKnowledgeBase(id);
        return ResVo.ok("ok");
    }
}