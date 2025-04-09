package ink.whi.backend.agent;

import dev.langchain4j.data.message.ChatMessage;
import dev.langchain4j.model.openai.OpenAiStreamingChatModel;
import dev.langchain4j.service.AiServices;
import dev.langchain4j.service.TokenStream;
import ink.whi.backend.agent.interfaces.ChatAssistant;
import ink.whi.backend.common.dto.agent.BaseModelRequest;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import java.util.List;

import static ink.whi.backend.common.utils.SSEUtil.createEmitter;
import static ink.whi.backend.common.utils.AgentUtil.*;


/**
 * @author: qing
 * @Date: 2025/3/29
 */
@Slf4j
@Service
public class ChatAgent {

    private static final String PROMPT = """
            你是一个智能的AI助手，能够帮助用户回答问题、提供信息和解决问题。
            """;

    public SseEmitter streamingChat(BaseModelRequest request) {
        SseEmitter emitter = createEmitter();

        OpenAiStreamingChatModel model = buildStreamChatLanguagesModel(request.getModelConfig());
        buildTools(request.getToolList());

        ChatAssistant chatAssistant = AiServices.builder(ChatAssistant.class)
                .streamingChatLanguageModel(model)
                .tools()
                .build();

        List<ChatMessage> chatMessages = buildChatMessages(request.getMessageList(), PROMPT);
        TokenStream tokenStream = chatAssistant.chatMessages(chatMessages);
       registerStreamingHandler(tokenStream, emitter);

        return emitter;
    }
}
