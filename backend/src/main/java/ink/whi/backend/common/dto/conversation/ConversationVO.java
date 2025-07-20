package ink.whi.backend.common.dto.conversation;

import ink.whi.backend.common.dto.message.MessageDTO;
import ink.whi.backend.dao.entity.Message;
import lombok.Data;

import java.util.List;

/**
 * @author: qing
 * @Date: 2025/7/5
 */
@Data
public class ConversationVO {

    private ConversationDTO conversation;

    private List<MessageDTO> messageList;
}
