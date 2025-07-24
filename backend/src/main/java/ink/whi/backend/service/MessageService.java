package ink.whi.backend.service;

import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import dev.langchain4j.model.chat.response.ChatResponse;
import ink.whi.backend.common.context.ReqInfoContext;
import ink.whi.backend.common.converter.MessageConverter;
import ink.whi.backend.common.dto.agent.ChatReq;
import ink.whi.backend.common.dto.message.MessageDTO;
import ink.whi.backend.common.enums.MsgRoleEnum;
import ink.whi.backend.dao.entity.Message;
import ink.whi.backend.dao.mapper.MessageMapper;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * 消息服务实现类
 *
 * @author: qing
 * @Date: 2025/3/2
 */
@Service
public class MessageService extends ServiceImpl<MessageMapper, Message> {

    public List<MessageDTO> queryMessageList(String uuid) {
        List<Message> list = lambdaQuery().eq(Message::getConversationUuid, uuid)
                .orderByAsc(Message::getCreateTime)
                .list();
        return MessageConverter.toDTOList(list);
    }

    public void deleteAllMessages(String uuid) {
        lambdaUpdate().eq(Message::getConversationUuid, uuid).remove();
    }

    public void saveUserMessage(String userMessage, String uuid, Integer modelId) {
        saveMessage(userMessage, MsgRoleEnum.User, uuid, modelId);
    }

    public void saveAiMessage(String aiMessage, ChatReq request, ChatResponse response) {
        Message message = new Message();
        message.setUserId(ReqInfoContext.getUserId());
        message.setContent(aiMessage);
        message.setRole(MsgRoleEnum.Assistant);
        message.setConversationUuid(request.getConversationUuId());
        message.setModelId(request.getModelId());

        message.setTokenUsage(response.tokenUsage());
        message.setTools(request.getToolList());
        message.setAttachments(String.join(",", request.getImageUrls()));
        save(message);
    }

    public void saveMessage(String content, MsgRoleEnum role, String uuid, Integer modelId) {
        Message message = new Message();
        message.setUserId(ReqInfoContext.getUserId());
        message.setContent(content);
        message.setRole(role);
        message.setConversationUuid(uuid);
        message.setModelId(modelId);
        save(message);
    }

    public Message getLastMessage() {
        return lambdaQuery().eq(Message::getUserId, ReqInfoContext.getUserId())
                .orderByDesc(Message::getUpdateTime)
                .last("limit 1")
                .one();
    }
}
