package ink.whi.backend.common.dto.model;

import lombok.Data;

import java.io.Serializable;

/**
 * @author: qing
 * @Date: 2025/6/27
 */
@Data
public class ModelUpdateReq implements Serializable {

    private String modelId;

    private String name;

    /**
     * 类型 text,image,embedding,rerank
     */
    private String modelType;

    /**
     * 描述
     */
    private String description;

}
