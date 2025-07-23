package ink.whi.backend.common.dto.model;

import lombok.Data;

/**
 * @author: qing
 * @Date: 2025/6/27
 */
@Data
public class ModelCreReq {

    private String modelId;

    private String name;

    private Integer platformId;

    private String modelType;

}
