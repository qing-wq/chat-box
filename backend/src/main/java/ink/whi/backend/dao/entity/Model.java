package ink.whi.backend.dao.entity;

import com.baomidou.mybatisplus.annotation.TableName;
import ink.whi.backend.common.enums.ModelTypeEnum;
import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * @author: qing
 * @Date: 2025/6/20
 */
@Data
@TableName("model")
@EqualsAndHashCode(callSuper = true)
public class Model extends BaseEntity {

    /**
     * 模型名称
     */
    private String name;

    /**
     * 模型类型
     */
    private ModelTypeEnum type;

    /**
     * 描述
     */
    private String description;

    /**
     * 模型平台
     */
    private Integer platformId;
}
