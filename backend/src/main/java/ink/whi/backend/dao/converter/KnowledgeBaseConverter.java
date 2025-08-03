package ink.whi.backend.dao.converter;

import ink.whi.backend.common.dto.knowledgeBase.KbUpdateReq;
import ink.whi.backend.common.enums.ProcessTypeEnum;
import ink.whi.backend.common.exception.BusinessException;
import ink.whi.backend.common.status.StatusEnum;
import ink.whi.backend.dao.entity.KnowledgeBase;

/**
 * 知识库转换工具类
 *
 * @author: qing
 * @Date: 2025/8/3
 */
public class KnowledgeBaseConverter {

    /**
     * 将KbUpdateReq转换为KnowledgeBase
     *
     * @param req 请求参数
     * @return 更新后的知识库记录
     */
    public static KnowledgeBase toDO(KbUpdateReq req) {
        if (req == null) {
            return null;
        }

        KnowledgeBase knowledgeBase = new KnowledgeBase();
        ProcessTypeEnum processType = ProcessTypeEnum.ofName(req.getProcessType());
        if (processType == null) {
            throw BusinessException.newInstance(StatusEnum.ILLEGAL_ARGUMENTS_MIXED, "processType不合法");
        }

        knowledgeBase.setId(req.getId());
        knowledgeBase.setTitle(req.getTitle());
        knowledgeBase.setRemark(req.getRemark());
        knowledgeBase.setIsPublic(req.getIsPublic());
        knowledgeBase.setProcessType(processType);
        knowledgeBase.setEmbeddingModelId(req.getEmbeddingModelId());
        knowledgeBase.setQaModelId(req.getQaModelId());
        knowledgeBase.setBlockSize(req.getBlockSize());
        knowledgeBase.setMaxOverlap(req.getMaxOverlap());
        knowledgeBase.setQaPrompt(req.getQaPrompt());
        knowledgeBase.setRetrieveMaxResults(req.getRetrieveMaxResults());
        knowledgeBase.setRetrieveMinScore(req.getRetrieveMinScore());

        return knowledgeBase;
    }
}
