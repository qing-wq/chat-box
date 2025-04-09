package ink.whi.backend.service;

import ink.whi.backend.common.dto.chat.ChatDTO;
import ink.whi.backend.common.dto.chat.ChatUpdateReq;
import ink.whi.backend.common.dto.chat.SimpleChatDTO;
import ink.whi.backend.dao.entity.ChatDO;

import java.util.List;

/**
 * @author: qing
 * @Date: 2025/3/24
 */
public interface ChatService {
    ChatDO createChat(ChatDO chat);
    ChatDTO queryChatDetail(Integer chatId);
    List<ChatDO> listChatsByUserId(Integer userId);
    void updateChatInfo(SimpleChatDTO chat);
    void deleteChat(Integer chatId);

    void updateChatMessage(ChatUpdateReq request);
}
