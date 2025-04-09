package ink.whi.backend.common.enums;

import lombok.Getter;

import java.util.Objects;

@Getter
public enum RoleEnum {

    User(1, "user"),
    ASSISTANT(2, "assistant");
    
    private int id;
    private String role;

    RoleEnum(int id, String role) {
        this.id = id;
        this.role = role;
    }
    
    /**
     * 根据类型获取角色名称
     */
    public static RoleEnum getRoleByName(String role) {
        for (RoleEnum roleEnum : RoleEnum.values()) {
            if (Objects.equals(role, roleEnum.getRole())) {
                return roleEnum;
            }
        }
        return null;
    }

    public static RoleEnum getRoleByType(Integer type) {
        for (RoleEnum roleEnum : RoleEnum.values()) {
            if (Objects.equals(roleEnum.getId(), type)) {
                return roleEnum;
            }
        }
        return null;
    }

}
