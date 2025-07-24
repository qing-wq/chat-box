package ink.whi.backend.common.enums;

import com.baomidou.mybatisplus.annotation.EnumValue;
import com.fasterxml.jackson.annotation.JsonValue;
import dev.langchain4j.data.message.AiMessage;
import dev.langchain4j.data.message.ChatMessage;
import dev.langchain4j.data.message.SystemMessage;
import dev.langchain4j.data.message.UserMessage;
import lombok.Getter;

import java.util.Objects;

@Getter
public enum MsgRoleEnum {

    User(1, "user") {
        @Override
        public ChatMessage createMessage(String content) {
            return new UserMessage(content);
        }
    },
    Assistant(2, "assistant") {
        @Override
        public ChatMessage createMessage(String content) {
            return new AiMessage(content);
        }
    },
    System(3, "system") {
        @Override
        public ChatMessage createMessage(String content) {
            return new SystemMessage(content);
        }
    };

    @EnumValue
    private int type;

    @JsonValue
    private String role;

    MsgRoleEnum(int type, String role) {
        this.type = type;
        this.role = role;
    }

    public abstract ChatMessage createMessage(String content);

    /**
     * 根据类型获取角色名称
     */
    public static MsgRoleEnum formRole(String role) {
        for (MsgRoleEnum msgRoleEnum : MsgRoleEnum.values()) {
            if (Objects.equals(role, msgRoleEnum.getRole())) {
                return msgRoleEnum;
            }
        }
        return null;
    }

    public static MsgRoleEnum formType(Integer type) {
        for (MsgRoleEnum msgRoleEnum : MsgRoleEnum.values()) {
            if (Objects.equals(msgRoleEnum.getType(), type)) {
                return msgRoleEnum;
            }
        }
        return null;
    }
}
