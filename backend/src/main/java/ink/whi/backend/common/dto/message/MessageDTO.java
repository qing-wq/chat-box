package ink.whi.backend.common.dto.message;

import dev.langchain4j.model.output.TokenUsage;
import ink.whi.backend.common.dto.BaseDTO;
import lombok.*;

/**
 * 聊天消息数据传输对象
 */
@Data
@EqualsAndHashCode(callSuper = true)
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MessageDTO extends BaseDTO {

    /**
     * 消息角色：user, assistant
     */
    private String role;

    private String conversationUuid;
    
    /**
     * 消息内容
     */
    private String content;

    private TokenUsage tokenUsage;
}
