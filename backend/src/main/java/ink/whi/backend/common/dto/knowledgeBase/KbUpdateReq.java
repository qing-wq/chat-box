package ink.whi.backend.common.dto.knowledgeBase;

import lombok.Data;

/**
 * @author: qing
 * @Date: 2025/7/26
 */
@Data
public class KbUpdateReq {

    private Integer id;

    private String title;

    /**
     * 描述
     */
    private String remark;

    /**
     * 是否公开
     */
    private Boolean isPublic;

    /**
     * 嵌入模型id
     */
    private Long embeddingModelId;

    /**
     * 问答模型id
     */
    private Integer qaModelId;

    // =================数据处理设置==================

    /**
     * 处理方式 direct,qa
     */
    private String processType;

    /**
     * 分块大小(100-3000)
     */
    private Integer blockSize;

    /**
     * 文档切割时重叠数量(按token来计)
     */
    private Integer maxOverlap;

    /**
     * 问答提示词（可选）
     */
    private String qaPrompt;

    // ==================召回设置==================

    /**
     * 文档召回最大数量
     */
    private Integer retrieveMaxResults;

    /**
     * 文档召回最小分数
     */
    private Double retrieveMinScore;
}
