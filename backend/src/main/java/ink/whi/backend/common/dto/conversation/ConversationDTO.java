package ink.whi.backend.common.dto.conversation;

import ink.whi.backend.common.dto.BaseDTO;
import ink.whi.backend.common.dto.message.MessageDTO;
import lombok.Data;
import lombok.EqualsAndHashCode;

import java.io.Serial;
import java.util.List;

/**
 * @author: qing
 * @Date: 2025/3/30
 */
@Data
public class ConversationDTO extends BaseDTO {

    @Serial
    private static final long serialVersionUID = -1314162575898615006L;

    private String uuid;

    private String title;

    private String systemMessage;
}
