package ink.whi.backend.common.dto.model;

import ink.whi.backend.common.dto.BaseDTO;
import ink.whi.backend.common.enums.ModelTypeEnum;
import lombok.Data;

import java.io.Serializable;

/**
 * @author: qing
 * @Date: 2025/7/19
 */
@Data
public class ModelDTO extends BaseDTO {
    /**
     * 模型名称
     */
    private String name;

    /**
     * 模型类型 text,image,embedding,rerank
     */
    private String type;

    /**
     * 模型平台
     */
    private Integer platformId;
}
