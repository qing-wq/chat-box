package ink.whi.backend.service.conv;

import dev.langchain4j.data.message.ChatMessage;
import dev.langchain4j.model.openai.OpenAiStreamingChatModel;
import dev.langchain4j.service.AiServices;
import dev.langchain4j.service.TokenStream;
import ink.whi.backend.agent.interfaces.ChatAssistant;
import ink.whi.backend.common.dto.chat.ChatReq;
import ink.whi.backend.common.dto.chat.ModelConfig;
import ink.whi.backend.common.dto.message.MessageDTO;
import ink.whi.backend.common.enums.MsgRoleEnum;
import ink.whi.backend.common.exception.BusinessException;
import ink.whi.backend.common.status.StatusEnum;
import ink.whi.backend.common.utils.SseEmitterUtil;
import ink.whi.backend.dao.entity.Conversation;
import ink.whi.backend.service.model.ModelService;
import io.micrometer.common.util.StringUtils;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import static ink.whi.backend.common.utils.AgentUtil.*;
import static ink.whi.backend.common.utils.SseEmitterUtil.*;


/**
 * @author: qing
 * @Date: 2025/3/29
 */
@Slf4j
@Service
public class ChatService {

    @Autowired
    private MessageService messageService;

    @Autowired
    private ConversationService conversationService;

    private static final String PROMPT = """
            你是一个智能的AI助手，能够帮助用户回答问题、提供信息和解决问题。
            """;

    @Autowired
    private ModelService modelService;

    public SseEmitter streamingChat(ChatReq request) {
        // check
        Conversation conv = conversationService.getAndCheck(request.getConversationUuId());
        if (StringUtils.isBlank(request.getUserMessage())) {
            throw BusinessException.newInstance(StatusEnum.ILLEGAL_ARGUMENTS, "用户请求不能为空");
        }

        SseEmitter emitter = createEmitter();
        // Send begin event to signal streaming start
        startSse(emitter, null);

        // build model
        ModelConfig config = buildModelConfig(request);
        if (conv.getModelSettings() != null) {
            config.setModelSettings(conv.getModelSettings());
        }

        OpenAiStreamingChatModel chatModel = buildStreamChatLanguagesModel(config);

        // TODO tools
//        buildTools(request.getToolList());
        ChatAssistant chatAssistant = AiServices.builder(ChatAssistant.class)
                .streamingChatLanguageModel(chatModel)
//                .tools()
                .build();

        if (conv.getModelSettings() != null && conv.getModelSettings().getContextWindow() != null) {
            // TODO 上下文限制
        }

        List<MessageDTO> messages = messageService.queryMessageList(conv.getUuid());
        List<ChatMessage> chatMessages = buildChatMessages(messages, PROMPT);
        chatMessages.add(MsgRoleEnum.User.createMessage(request.getUserMessage()));

        TokenStream tokenStream = chatAssistant.chatMessages(chatMessages);

        registerStreamingHandler(tokenStream, emitter, (aiMessage, tokenUsage) -> {
            // TODO 考虑事务
            messageService.saveUserMessage(request, tokenUsage.inputTokenCount());
            messageService.saveAiMessage(aiMessage.text(), request, tokenUsage.outputTokenCount());
            conversationService.updateTime(conv);
        });

        return emitter;
    }

    public ModelConfig buildModelConfig(ChatReq request) {
        Integer modelId = request.getModelId();
        return modelService.buildModelConfig(modelId);
    }
}
