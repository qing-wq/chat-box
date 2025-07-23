package ink.whi.backend.common.enums;

import lombok.Getter;

import java.util.Objects;

/**
 * @author: qing
 * @Date: 2025/7/15
 */
@Getter
public enum UserRoleEnum {
    NORMAL(0, "普通用户"),
    ADMIN(1, "超级用户");

    private int role;
    private String desc;

    UserRoleEnum(int role, String desc) {
        this.role = role;
        this.desc = desc;
    }

    public static String role(Integer roleId) {
        if (Objects.equals(roleId, 1)) {
            return ADMIN.name();
        } else {
            return NORMAL.name();
        }
    }
}
