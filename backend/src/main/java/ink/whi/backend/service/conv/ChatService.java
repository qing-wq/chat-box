package ink.whi.backend.service.conv;

import dev.langchain4j.data.message.ChatMessage;
import dev.langchain4j.model.chat.StreamingChatLanguageModel;
import dev.langchain4j.model.output.TokenUsage;
import dev.langchain4j.service.AiServices;
import dev.langchain4j.service.TokenStream;
import ink.whi.backend.agent.interfaces.ChatAssistant;
import ink.whi.backend.common.dto.chat.ChatReq;
import ink.whi.backend.common.dto.message.MessageDTO;
import ink.whi.backend.common.enums.MsgRoleEnum;
import ink.whi.backend.common.exception.BusinessException;
import ink.whi.backend.common.status.StatusEnum;
import ink.whi.backend.helper.SseEmitterHelper;
import ink.whi.backend.dao.entity.Conversation;
import ink.whi.backend.service.model.ModelService;
import ink.whi.backend.utils.LLMService;
import io.micrometer.common.util.StringUtils;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import java.util.List;
import java.util.Optional;


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

    @Autowired
    private ModelService modelService;

    @Autowired
    private SseEmitterHelper sseEmitterHelper;

    @Autowired
    private LLMService llmService;

    private static final String PROMPT = """
            你是一个智能的AI助手，能够帮助用户回答问题、提供信息和解决问题。
            """;

    public SseEmitter streamingChat(ChatReq request) {
        // check
        Conversation conv = conversationService.getAndCheck(request.getConversationUuId());
        if (StringUtils.isBlank(request.getUserMessage())) {
            throw BusinessException.newInstance(StatusEnum.ILLEGAL_ARGUMENTS, "用户请求不能为空");
        }

        SseEmitter emitter = sseEmitterHelper.createEmitter(request.getConversationUuId());
        // Send begin event to signal streaming start
        sseEmitterHelper.startSse(emitter);

        // build model
        StreamingChatLanguageModel chatModel = modelService.buildStreamChatLanguagesModel(request.getModelId(), conv.getModelParams());

        // TODO tools
//        buildTools(request.getToolList());
        ChatAssistant chatAssistant = AiServices.builder(ChatAssistant.class)
                .streamingChatLanguageModel(chatModel)
//                .tools()
                .build();

        // TODO 上下文限制
        if (conv.getModelParams() != null && conv.getModelParams().getContextWindow() != null) {
        }

        List<MessageDTO> messages = messageService.queryMessageList(conv.getUuid());
        List<ChatMessage> chatMessages = llmService.buildChatMessages(messages, PROMPT);
        chatMessages.add(MsgRoleEnum.User.createMessage(request.getUserMessage()));

        TokenStream tokenStream = chatAssistant.chatMessages(chatMessages);

        llmService.registerStreamingHandler(tokenStream, emitter, conv.getUuid(), (aiMessage, tokenUsage) -> {
            Optional<TokenUsage> option = Optional.ofNullable(tokenUsage);
            // TODO 考虑事务
            messageService.saveUserMessage(request, option.map(TokenUsage::inputTokenCount).orElse(0));
            messageService.saveAiMessage(aiMessage.text(), request, option.map(TokenUsage::outputTokenCount).orElse(0));
            conversationService.updateTime(conv);
        });
        return emitter;
    }

    public void stopChat(String uuid) {
        sseEmitterHelper.stopSse(uuid);
    }
}
