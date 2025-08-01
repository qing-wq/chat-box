package ink.whi.backend.dao.entity;

import com.baomidou.mybatisplus.annotation.TableName;
import ink.whi.backend.common.enums.UserRoleEnum;
import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * @author: qing
 * @Date: 2025/3/21
 */
@Data
@EqualsAndHashCode(callSuper = true)
@TableName("user")
public class User extends BaseEntity {
    private String username;

    private String password;

    private UserRoleEnum role;

    private String avatar;
}
