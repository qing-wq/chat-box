package ink.whi.backend.service.impl;

import dev.langchain4j.data.message.ChatMessage;
import dev.langchain4j.model.openai.OpenAiStreamingChatModel;
import dev.langchain4j.service.AiServices;
import dev.langchain4j.service.TokenStream;
import ink.whi.backend.aiService.ChatAssistant;
import ink.whi.backend.common.enums.MessageRoleEnum;
import ink.whi.backend.common.exception.BusinessException;
import ink.whi.backend.common.status.StatusEnum;
import ink.whi.backend.dto.MessageDTO;
import ink.whi.backend.dto.ModelConfig;
import ink.whi.backend.dto.RequestDTO;
import lombok.Data;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Service;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import javax.tools.Tool;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

import static ink.whi.backend.common.SSEUtil.createEmitter;


/**
 * @author: qing
 * @Date: 2025/3/29
 */
@Slf4j
@Service
public class ChatService {

    public void streamingComplete(RequestDTO request) {
        SseEmitter emitter = createEmitter();

        OpenAiStreamingChatModel model = buildStreamChatLanguagesModel(request);
        buildTools(request.getToolList());

        ChatAssistant chatAssistant = AiServices.builder(ChatAssistant.class)
                .streamingChatLanguageModel(model)
                .tools()
                .build();

        List<ChatMessage> chatMessages = buildChatMessages(request.getMessageList());

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
    }

    private void buildTools(List<String> toolList) {
        for (String toolName : toolList) {
//            if (toolName.equals(dateTool))
        }
    }

    private OpenAiStreamingChatModel buildStreamChatLanguagesModel(RequestDTO request) {
        OpenAiStreamingChatModel.OpenAiStreamingChatModelBuilder builder = OpenAiStreamingChatModel.builder()
                .apiKey(request.getApiKey())
                .baseUrl(request.getApiUrl())
                .modelName(request.getModelName());
        buildModelConfig(request.getModelConfig(), builder);
        return builder.build();
    }

    public List<ChatMessage> buildChatMessages(List<MessageDTO> messages) {
        // 构建消息列表
        List<ChatMessage> chatMessages = new ArrayList<>();

        if (messages != null) {
            for (MessageDTO msgDTO : messages) {
                ChatMessage chatMessage;

                MessageRoleEnum messageRoleEnum = MessageRoleEnum.fromRole(msgDTO.getRole());
                if (messageRoleEnum == null) {
                    throw BusinessException.newInstance(StatusEnum.ILLEGAL_ARGUMENTS_MIXED, "不支持的消息角色: " + msgDTO.getRole());
                }
                chatMessage = messageRoleEnum.createMessage(msgDTO.getContent());
                chatMessages.add(chatMessage);
            }
        }
        return chatMessages;
    }

    private static void buildModelConfig(ModelConfig config, OpenAiStreamingChatModel.OpenAiStreamingChatModelBuilder builder) {
        if (config == null) {
            return;
        }
        // 应用模型配置参数（如果有）
        if (config.getTemperature() != null) {
            builder.temperature(config.getTemperature());
        }

        if (config.getTopP() != null) {
            builder.topP(config.getTopP());
        }

        if (config.getMaxTokens() != null) {
            builder.maxTokens(config.getMaxTokens());
        }
    }
}
