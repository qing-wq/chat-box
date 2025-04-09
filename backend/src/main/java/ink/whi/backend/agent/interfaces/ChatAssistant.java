package ink.whi.backend.agent.interfaces;

import dev.langchain4j.data.message.ChatMessage;
import dev.langchain4j.service.MemoryId;
import dev.langchain4j.service.TokenStream;

import java.util.List;

/**
 * @author: qing
 * @Date: 2025/3/29
 */
public interface ChatAssistant {

    TokenStream chatMessage(ChatMessage message);

    TokenStream chatMessages(List<ChatMessage> userMessage);

    TokenStream chatWithMemory(@MemoryId String sessionId, ChatMessage message);
}
