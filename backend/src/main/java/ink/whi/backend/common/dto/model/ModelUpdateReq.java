package ink.whi.backend.common.dto.model;

import lombok.Data;

import java.io.Serializable;

/**
 * @author: qing
 * @Date: 2025/6/27
 */
@Data
public class ModelUpdateReq implements Serializable {

    private Integer modelId;

    private String name;

    /**
     * 类型 text,image,embedding,rerank
     */
    private String type;

    /**
     * 描述
     */
    private String description;

}
