package ink.whi.backend.common.dto.agent;

import lombok.Data;

/**
 * 检索设置
 * @author: qing
 * @Date: 2025/7/27
 */
@Data
public class RetrieveSetting {

    /**
     * 检索类型
     */
    private String retrieveType;

    /**
     * 文档召回最大数量
     */
    private Integer retrieveMaxResults;

    /**
     * 文档召回最小分数
     */
    private Double retrieveMinScore;

    /**
     * 启动重排
     */
    private Boolean enableRerank;
}
