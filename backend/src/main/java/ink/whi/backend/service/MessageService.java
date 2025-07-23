package ink.whi.backend.service;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import ink.whi.backend.common.context.ReqInfoContext;
import ink.whi.backend.common.converter.MessageConverter;
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

    public void saveUserMessage(String userMessage, String uuid) {
        saveMessage(userMessage, MsgRoleEnum.User, uuid);
    }

    public void saveAiMessage(String aiMessage, String uuid) {
        saveMessage(aiMessage, MsgRoleEnum.Assistant, uuid);
    }

    public void saveMessage(String content, MsgRoleEnum role, String uuid) {
        Message message = new Message();
        message.setUserId(ReqInfoContext.getUserId());
        message.setContent(content);
        message.setRole(role.getType());
        message.setConversationUuid(uuid);
        save(message);
    }

    public Message getLastMessage() {
        return lambdaQuery().eq(Message::getUserId, ReqInfoContext.getUserId())
                .orderByDesc(Message::getUpdateTime)
                .one();
    }
}
