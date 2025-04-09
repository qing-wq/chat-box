package ink.whi.backend.common.dto.user;

import ink.whi.backend.common.dto.BaseDTO;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.experimental.Accessors;

import java.io.Serial;
import java.io.Serializable;

/**
 * @author: qing
 * @Date: 2023/4/26
 */
@Data
public class BaseUserInfoDTO implements Serializable {
    @Serial
    private static final long serialVersionUID = -2426438424647735636L;

    /**
     * 用户id
     */
    private Integer userId;

    /**
     * 用户名
     */
    private String userName;

}
