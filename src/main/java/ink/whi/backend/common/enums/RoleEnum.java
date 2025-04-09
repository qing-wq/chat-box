package ink.whi.chatboxbackend.common.enums;

import lombok.Getter;

@Getter
public enum RoleEnum {

    User(1, "user"),
    ChatLanguageModel(2, "chat_language_model");
    
    private int id;
    private String role;

    RoleEnum(int id, String role) {
        this.id = id;
        this.role = role;
    }
    
    /**
     * 根据类型获取角色名称
     * 
     * @param type 角色类型
     * @return 角色名称
     */
    public static String getNameByType(Integer type) {
        if (type == null) {
            return "";
        }
        for (RoleEnum roleEnum : RoleEnum.values()) {
            if (roleEnum.id == type) {
                return roleEnum.role;
            }
        }
        return "";
    }
}
