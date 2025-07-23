package ink.whi.backend.dao.entity;

import com.baomidou.mybatisplus.annotation.TableName;
import ink.whi.backend.common.enums.PlatformTypeEnum;
import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * @author: qing
 * @Date: 2025/7/9
 */
@Data
@TableName("platform")
@EqualsAndHashCode(callSuper = true)
public class Platform extends BaseEntity{

    private Integer userId;

    private String name;

    /**
     * {@link PlatformTypeEnum}
     */
    private Integer platformType;

    private String apiKey;

    private String baseUrl;

    private Boolean enable;
}