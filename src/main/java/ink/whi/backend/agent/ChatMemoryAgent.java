package ink.whi.backend;

import dev.langchain4j.data.message.ChatMessage;
import dev.langchain4j.memory.ChatMemory;
import dev.langchain4j.memory.chat.MessageWindowChatMemory;
import dev.langchain4j.model.openai.OpenAiStreamingChatModel;
import dev.langchain4j.service.AiServices;
import dev.langchain4j.service.TokenStream;
import ink.whi.backend.agent.interfaces.ChatAssistant;
import ink.whi.backend.dto.RequestDTO;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import java.io.IOException;
import java.util.List;

import static ink.whi.backend.common.utils.BuildModelUtil.*;
import static ink.whi.backend.common.utils.SSEUtil.createEmitter;


/**
 * @author: qing
 * @Date: 2025/3/29
 */
@Slf4j
@Service
public class ChatMemoryAgent {

    private static final String PROMPT = """
            你是一个智能的AI助手，能够帮助用户回答问题、提供信息和解决问题。
            """;

    public SseEmitter streamingChat(RequestDTO request) {
        SseEmitter emitter = createEmitter();

        OpenAiStreamingChatModel model = buildStreamChatLanguagesModel(request);
        buildTools(request.getToolList());

        ChatAssistant chatAssistant = AiServices.builder(ChatAssistant.class)
                .streamingChatLanguageModel(model)
                .tools()
                .build();

        List<ChatMessage> chatMessages = buildChatMessages(request.getMessageList(), PROMPT);

        ChatMemory chatMemory = MessageWindowChatMemory.withMaxMessages(10);

        TokenStream tokenStream = chatAssistant.chatMessages(chatMessages);
        tokenStream.onNext(token -> {
                    try {
                        emitter.send(SseEmitter.event().data(token));
                    } catch (IOException e) {
                        throw new RuntimeException(e);
                    }
                })
                .onComplete(System.out::println)
                .onError(Throwable::printStackTrace)
                .start();

        return emitter;
    }
}
