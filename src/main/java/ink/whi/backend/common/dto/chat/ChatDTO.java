package ink.whi.backend.common.dto.chat;

import ink.whi.backend.common.dto.message.MessageDTO;
import lombok.Data;

import java.io.Serial;
import java.io.Serializable;
import java.util.List;

/**
 * @author: qing
 * @Date: 2025/3/30
 */
@Data
public class ChatSaveReq implements Serializable {

    @Serial
    private static final long serialVersionUID = -1314162575898615006L;

    private Integer chatId;

    List<MessageDTO> messageList;
}
