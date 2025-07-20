package ink.whi.backend.agent;

import dev.langchain4j.data.message.ChatMessage;
import dev.langchain4j.model.openai.OpenAiStreamingChatModel;
import dev.langchain4j.service.AiServices;
import dev.langchain4j.service.TokenStream;
import ink.whi.backend.agent.interfaces.ChatAssistant;
import ink.whi.backend.common.dto.agent.ChatReq;
import ink.whi.backend.common.dto.agent.ModelConfig;
import ink.whi.backend.common.dto.message.MessageDTO;
import ink.whi.backend.common.enums.MsgRoleEnum;
import ink.whi.backend.dao.entity.Conversation;
import ink.whi.backend.service.ConversationService;
import ink.whi.backend.service.MessageService;
import ink.whi.backend.service.PMService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
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

    @Autowired
    private MessageService messageService;

    @Autowired
    private PMService pmService;

    @Autowired
    private ConversationService conversationService;

    private static final String PROMPT = """
            你是一个智能的AI助手，能够帮助用户回答问题、提供信息和解决问题。
            """;

    public SseEmitter streamingChat(ChatReq request) {
        SseEmitter emitter = createEmitter();
        // check
        Conversation conv = conversationService.getAndCheck(request.getConversationUuId());

        // save user message
        messageService.saveUserMessage(request.getUserMessage(), request.getConversationUuId());

        // build model
        ModelConfig config = buildModelConfig(request);

        if (conv.getModelParams() != null) {
            // TODO 处理额外参数
        }

//        ModelConfig modelConfig = ModelConfig.builder().modelName(TempModelConfig.MODEL_NAME)
//                .baseUrl(TempModelConfig.BASE_URL)
//                .apiKey(TempModelConfig.API_KEY)
//                .build();
        OpenAiStreamingChatModel chatModel = buildStreamChatLanguagesModel(config);

        // TODO tools
//        buildTools(request.getToolList());

        ChatAssistant chatAssistant = AiServices.builder(ChatAssistant.class)
                .streamingChatLanguageModel(chatModel)
//                .tools()
                .build();

        MessageDTO msg = new MessageDTO();
        msg.setRole(MsgRoleEnum.User.getRole());
        msg.setContent(request.getUserMessage());
        List<ChatMessage> chatMessages = buildChatMessages(List.of(msg), PROMPT);

        TokenStream tokenStream = chatAssistant.chatMessages(chatMessages);
        registerStreamingHandler(tokenStream, emitter, aiMessage -> {
            // TODO 考虑事务
            messageService.saveAiMessage(aiMessage.text(), request.getConversationUuId());
            conversationService.updateTime(conv);
        });

        return emitter;
    }

    public ModelConfig buildModelConfig(ChatReq request) {
        Integer modelId = request.getModelId();
        return pmService.buildModelConfig(modelId);
    }
}
