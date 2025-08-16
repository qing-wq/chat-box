package ink.whi.backend.common.utils;

import dev.langchain4j.data.message.AiMessage;
import dev.langchain4j.data.message.ChatMessage;
import dev.langchain4j.model.openai.OpenAiStreamingChatModel;
import dev.langchain4j.model.output.TokenUsage;
import dev.langchain4j.service.TokenStream;
import ink.whi.backend.common.enums.MsgRoleEnum;
import ink.whi.backend.common.enums.SseEventEnum;
import ink.whi.backend.common.exception.BusinessException;
import ink.whi.backend.common.status.StatusEnum;
import ink.whi.backend.common.dto.message.MessageDTO;
import ink.whi.backend.common.dto.chat.ModelConfig;
import ink.whi.backend.common.dto.chat.ModelSettings;
import lombok.extern.slf4j.Slf4j;
import org.springframework.util.CollectionUtils;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.HashMap;
import java.util.Map;
import java.util.function.BiConsumer;

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
            // if (toolName.equals(dateTool))
        }
    }

    public static OpenAiStreamingChatModel buildStreamChatLanguagesModel(ModelConfig config) {
        OpenAiStreamingChatModel.OpenAiStreamingChatModelBuilder builder = OpenAiStreamingChatModel.builder()
                .apiKey(config.getApiKey())
                .baseUrl(config.getBaseUrl())
                .modelName(config.getModelName());
        buildModelParams(config.getModelSettings(), builder);
        return builder.build();
    }

    public static List<ChatMessage> buildChatMessages(List<MessageDTO> messages, String systemMessage) {
        List<ChatMessage> chatMessages = new ArrayList<>();
        // system message
        chatMessages.add(systemMessage(systemMessage));

        if (messages != null) {
            for (MessageDTO msgDTO : messages) {
                ChatMessage chatMessage;

                MsgRoleEnum role = MsgRoleEnum.formRole(msgDTO.getRole());
                if (role == null) {
                    throw BusinessException.newInstance(StatusEnum.ILLEGAL_ARGUMENTS_MIXED,
                            "不支持的消息角色: " + msgDTO.getRole());
                }
                chatMessage = role.createMessage(msgDTO.getContent());
                chatMessages.add(chatMessage);
            }
        }
        return chatMessages;
    }

    private static void buildModelParams(ModelSettings params,
                                         OpenAiStreamingChatModel.OpenAiStreamingChatModelBuilder builder) {
        if (params == null) {
            return;
        }
        // 应用模型配置参数（如果有）
        if (params.getTemperature() != null) {
            builder.temperature(params.getTemperature());
        }

        if (params.getMaxTokens() != null) {
            builder.maxTokens(params.getMaxTokens());
        }
    }

    public static void registerStreamingHandler(TokenStream tokenStream, SseEmitter emitter,
                                                BiConsumer<AiMessage, TokenUsage> consumer) {
        tokenStream.onPartialResponse(token -> {
                    try {
                        // 将token封装为JSON格式 {v: token}
                        Map<String, String> tokenData = new HashMap<>();
                        tokenData.put("v", token);
                        emitter.send(SseEmitter.event().data(tokenData));
                    } catch (IOException e) {
                        throw new RuntimeException(e);
                    }
                })
                .onCompleteResponse((response) -> {
                    try {
                        emitter.complete();
                        AiMessage aiMessage = response.aiMessage();
                        log.info("流式响应完成, response:{}", response.metadata());

                        // save aiMessage
                        consumer.accept(aiMessage, response.tokenUsage());
                        log.info("请求完成，响应：{}", response);
                    } catch (Exception e) {
                        log.error("关闭SSE连接失败", e);
                    }
                })
                .onToolExecuted(toolExecution -> log.info("toolExecution:{}", toolExecution))
                .onError(e -> handleError(emitter, e.getMessage()))
                .start();
    }

    public static void handleError(SseEmitter emitter, String errorMessage) {
        try {
            // 发送错误消息和错误码
            emitter.send(SseEmitter.event()
                    .name(SseEventEnum.BEGIN.getEvent())
                    .data(errorMessage));
            emitter.complete();
        } catch (IOException e) {
            log.error("发送错误消息失败", e);
        }
    }
}
