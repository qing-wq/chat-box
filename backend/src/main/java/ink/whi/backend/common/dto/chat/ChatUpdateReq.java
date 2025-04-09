package ink.whi.backend.common.dto.chat;

import ink.whi.backend.common.dto.message.MessageDTO;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.io.Serializable;
import java.util.List;

/**
 * @author: qing
 * @Date: 2025/3/30
 */
@Data
public class ChatUpdateReq implements Serializable {

    @NotNull
    Integer chatId;

    @NotNull
    List<MessageDTO> newMessageList;
}
