package ink.whi.backend.common.dto.conversation;

import ink.whi.backend.common.dto.BaseDTO;
import ink.whi.backend.common.dto.chat.ModelSettings;
import lombok.Data;

import java.io.Serial;

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

    private ModelSettings modelSettings;
}
