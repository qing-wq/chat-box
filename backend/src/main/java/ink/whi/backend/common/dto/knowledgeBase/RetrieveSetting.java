package ink.whi.backend.common.dto.knowledgeBase;

import lombok.Data;

/**
 * 召回设置
 * @author: qing
 * @Date: 2025/7/27
 */
@Data
public class RetrieveSetting {

    /**
     * 文档召回最大数量
     */
    private Integer retrieveMaxResults;

    /**
     * 文档召回最小分数
     */
    private Double retrieveMinScore;
}
