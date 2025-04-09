package ink.whi.backend.common.utils;

import dev.langchain4j.data.message.ChatMessage;
import dev.langchain4j.model.openai.OpenAiStreamingChatModel;
import ink.whi.backend.common.enums.MessageRoleEnum;
import ink.whi.backend.common.exception.BusinessException;
import ink.whi.backend.common.status.StatusEnum;
import ink.whi.backend.dto.MessageDTO;
import ink.whi.backend.dto.ModelConfig;
import ink.whi.backend.dto.ModelParams;
import ink.whi.backend.dto.RequestDTO;

import java.util.ArrayList;
import java.util.List;

import static dev.langchain4j.data.message.SystemMessage.systemMessage;

/**
 * @author: qing
 * @Date: 2025/3/30
 */
public class BuildModelUtil {

    public static void buildTools(List<String> toolList) {
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
}
