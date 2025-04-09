package ink.whi.backend.common.utils;

import dev.langchain4j.data.message.ChatMessage;
import dev.langchain4j.model.openai.OpenAiStreamingChatModel;
import dev.langchain4j.service.TokenStream;
import ink.whi.backend.common.enums.ChatMessageRoleEnum;
import ink.whi.backend.common.exception.BusinessException;
import ink.whi.backend.common.status.StatusEnum;
import ink.whi.backend.common.dto.message.MessageDTO;
import ink.whi.backend.common.dto.agent.ModelConfig;
import ink.whi.backend.common.dto.agent.ModelParams;
import lombok.extern.slf4j.Slf4j;
import org.springframework.util.CollectionUtils;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Collection;
import java.util.Collections;
import java.util.List;

import static dev.langchain4j.data.message.SystemMessage.systemMessage;

/**
 * @author: qing
 * @Date: 2025/3/30
 */
@Slf4j
public class AgentUtil {

    public static void buildTools(List<String> toolList) {
        if (CollectionUtils.isEmpty(toolList)) {
            return;
        }
        for (String toolName : toolList) {
//            if (toolName.equals(dateTool))
        }
    }

    public static OpenAiStreamingChatModel buildStreamChatLanguagesModel(ModelConfig config) {
        OpenAiStreamingChatModel.OpenAiStreamingChatModelBuilder builder = OpenAiStreamingChatModel.builder()
                .apiKey(config.getApiKey())
                .baseUrl(config.getApiUrl())
                .modelName(config.getModelName());
        buildModelParams(config.getModelParams(), builder);
        return builder.build();
    }

    public static List<ChatMessage> buildChatMessages(List<MessageDTO> messages, String systemMessage) {
        // 构建消息列表
        List<ChatMessage> chatMessages = new ArrayList<>();
        // system message
        chatMessages.add(systemMessage(systemMessage));

        if (messages != null) {
            for (MessageDTO msgDTO : messages) {
                ChatMessage chatMessage;

                ChatMessageRoleEnum chatMessageRoleEnum = ChatMessageRoleEnum.fromRole(msgDTO.getRole());
                if (chatMessageRoleEnum == null) {
                    throw BusinessException.newInstance(StatusEnum.ILLEGAL_ARGUMENTS_MIXED, "不支持的消息角色: " + msgDTO.getRole());
                }
                chatMessage = chatMessageRoleEnum.createMessage(msgDTO.getContent());
                chatMessages.add(chatMessage);
            }
        }
        return chatMessages;
    }

    private static void buildModelParams(ModelParams params, OpenAiStreamingChatModel.OpenAiStreamingChatModelBuilder builder) {
        if (params == null) {
            return;
        }
        // 应用模型配置参数（如果有）
        if (params.getTemperature() != null) {
            builder.temperature(params.getTemperature());
        }

        if (params.getTopP() != null) {
            builder.topP(params.getTopP());
        }

        if (params.getMaxTokens() != null) {
            builder.maxTokens(params.getMaxTokens());
        }
    }

    public static void registerStreamingHandler(TokenStream tokenStream, SseEmitter emitter) {
        tokenStream.onNext(token -> {
                    try {
                        emitter.send(SseEmitter.event().data(token));
                    } catch (IOException e) {
                        throw new RuntimeException(e);
                    }
                })
                .onComplete((response) -> {
                    try {
                        emitter.complete();
                        log.info("流式响应完成, response:{}", response);
                    } catch (Exception e) {
                        log.error("关闭SSE连接失败", e);
                    }
                })
                .onError(e -> handleError(emitter, e.getMessage()))
                .start();
    }

    /**
     * 处理错误情况
     */
    public static void handleError(SseEmitter emitter, String errorMessage) {
        try {
            // 发送错误消息和错误码
            emitter.send(SseEmitter.event()
                    .name("error")
                    .data(errorMessage));
            emitter.complete();
        } catch (IOException e) {
            log.error("发送错误消息失败", e);
        }
    }
}
