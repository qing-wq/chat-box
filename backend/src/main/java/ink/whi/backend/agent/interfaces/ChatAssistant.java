/*
 * @Author: jingjing.hu jingjing.hu@qunar.com
 * @Date: 2025-03-30 16:56:13
 * @LastEditors: jingjing.hu jingjing.hu@qunar.com
 * @LastEditTime: 2025-07-14 17:08:10
 * @FilePath: /chat-box/backend/src/main/java/ink/whi/backend/agent/interfaces/ChatAssistant.java
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
package ink.whi.backend.agent.interfaces;

import dev.langchain4j.data.message.ChatMessage;
import dev.langchain4j.service.TokenStream;

import java.util.List;

/**
 * @author: qing
 * @Date: 2025/3/29
 */
public interface ChatAssistant {

    TokenStream chatMessage(ChatMessage message);

    TokenStream chatMessages(List<ChatMessage> userMessage);

    // 暂时移除记忆功能，避免 ChatMemoryProvider 配置错误
    // TokenStream chatWithMemory(@MemoryId String sessionId, ChatMessage message);
}
