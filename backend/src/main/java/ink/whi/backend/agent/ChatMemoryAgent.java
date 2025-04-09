package ink.whi.backend.agent;

import dev.langchain4j.memory.chat.MessageWindowChatMemory;
import dev.langchain4j.model.openai.OpenAiStreamingChatModel;
import dev.langchain4j.service.AiServices;
import dev.langchain4j.service.TokenStream;
import ink.whi.backend.agent.interfaces.ChatAssistant;
import ink.whi.backend.common.dto.agent.BaseModelRequest;
import ink.whi.backend.common.dto.agent.MemoryChatRequest;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import static dev.langchain4j.data.message.UserMessage.userMessage;
import static ink.whi.backend.common.utils.AgentUtil.*;
import static ink.whi.backend.common.utils.SSEUtil.createEmitter;


/**
 * @author: qing
 * @Date: 2025/3/29
 */
@Slf4j
@Service
public class ChatMemoryAgent {

    private static final String PROMPT = """
            你是一个拥有记忆的智能的AI助手，能够帮助用户回答问题、提供信息和解决问题。
            """;

    public SseEmitter streamingChatWithMemory(BaseModelRequest request, String sessionId) {
        SseEmitter emitter = createEmitter();

        OpenAiStreamingChatModel model = buildStreamChatLanguagesModel(request.getModelConfig());
        buildTools(request.getToolList());

        ChatAssistant chatAssistant = AiServices.builder(ChatAssistant.class)
                .streamingChatLanguageModel(model)
                .chatMemoryProvider(memoryId -> MessageWindowChatMemory.withMaxMessages(10))
                .tools()
                .build();

        String userMessage = request.getMessage();
        TokenStream tokenStream = chatAssistant.chatWithMemory(sessionId, userMessage(userMessage));
        registerStreamingHandler(tokenStream, emitter);

        return emitter;
    }
}
