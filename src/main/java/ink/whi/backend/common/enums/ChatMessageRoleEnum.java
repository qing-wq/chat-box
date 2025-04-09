package ink.whi.backend.common.enums;

import dev.langchain4j.data.message.AiMessage;
import dev.langchain4j.data.message.ChatMessage;
import dev.langchain4j.data.message.SystemMessage;
import dev.langchain4j.data.message.UserMessage;
import lombok.Getter;

/**
 * 消息角色枚举
 */
@Getter
public enum ChatMessageRoleEnum {
    
    USER("user") {
        @Override
        public ChatMessage createMessage(String content) {
            return new UserMessage(content);
        }
    },
    
    ASSISTANT("assistant") {
        @Override
        public ChatMessage createMessage(String content) {
            return new AiMessage(content);
        }
    },
    
    SYSTEM("system") {
        @Override
        public ChatMessage createMessage(String content) {
            return new SystemMessage(content);
        }
    };
    
    private final String role;
    
    ChatMessageRoleEnum(String role) {
        this.role = role;
    }
    
    /**
     * 创建对应类型的消息对象
     */
    public abstract ChatMessage createMessage(String content);
    
    /**
     * 通过角色名称获取对应的枚举
     */
    public static ChatMessageRoleEnum fromRole(String role) {
        if (role == null) {
            return null;
        }
        
        for (ChatMessageRoleEnum chatMessageRoleEnum : values()) {
            if (chatMessageRoleEnum.getRole().equalsIgnoreCase(role)) {
                return chatMessageRoleEnum;
            }
        }
        
        return null;
    }
}
