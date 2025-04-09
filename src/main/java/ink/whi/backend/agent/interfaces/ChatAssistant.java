package ink.whi.backend.aiService;

import dev.langchain4j.data.message.ChatMessage;
import dev.langchain4j.service.TokenStream;
import dev.langchain4j.service.spring.AiService;
import ink.whi.backend.dto.MessageDTO;

import java.util.List;

/**
 * @author: qing
 * @Date: 2025/3/29
 */
public interface ChatAssistant {

    TokenStream chatMessage(ChatMessage message);

    TokenStream chatMessages(List<ChatMessage> userMessage);
}
