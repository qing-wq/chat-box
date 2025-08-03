package ink.whi.backend.common.dto.knowledgeBase;

import lombok.Data;

import java.io.Serializable;

/**
 * @author: qing
 * @Date: 2025/7/30
 */
@Data
public class KbCreateReq implements Serializable {
    /**
     * 标题
     */
    private String title;

    /**
     * 描述
     */
    private String remark;

    /**
     * 嵌入模型id
     */
    private Long embeddingModelId;

    /**
     * 问答模型id
     */
    private Integer qaModelId;
}
