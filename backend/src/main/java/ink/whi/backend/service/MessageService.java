package ink.whi.backend.service;

import ink.whi.backend.common.dto.message.MessageDTO;
import ink.whi.backend.dao.entity.MessageDO;

import java.util.List;

/**
 * @author: qing
 * @Date: 2025/3/30
 */
public interface MessageService {
    void saveMessages(List<MessageDTO> message);
    MessageDO createMessage(MessageDO message);
    List<MessageDTO> queryMessageListByChatId(Integer chatId);
    void deleteMessagesByChatId(Long conversationId);
}
