package ink.whi.backend.common.dto.message;

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
     * 消息角色：user, assistant, system
     */
    private String role;

    private Integer chatId;
    
    /**
     * 消息内容
     */
    private String content;
}
