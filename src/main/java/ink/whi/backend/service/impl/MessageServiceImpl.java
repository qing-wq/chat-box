package ink.whi.backend.service;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import ink.whi.backend.common.converter.MessageConverter;
import ink.whi.backend.common.dto.message.MessageDTO;
import ink.whi.backend.common.enums.RoleEnum;
import ink.whi.backend.dao.entity.MessageDO;
import ink.whi.backend.dao.mapper.MessageMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * 消息服务实现类
 *
 * @author: qing
 * @Date: 2025/3/2
 */
@Service
@RequiredArgsConstructor
public class MessageServiceImpl extends ServiceImpl<MessageMapper, MessageDO> {

    private final MessageMapper messageMapper;

    public List<MessageDTO> createPairMessage(MessageDTO message) {
        // 创建用户消息
        MessageDO userMessage = new MessageDO();
        userMessage.setContent(message.getContent());
        userMessage.setRole(RoleEnum.User.getId());
        userMessage = createMessage(userMessage);

        // 创建AI消息
        MessageDO aiMessage = new MessageDO();
        aiMessage.setContent("");   // aiMessage 先设置为空
        aiMessage.setRole(RoleEnum.ChatLanguageModel.getId());
        aiMessage = createMessage(aiMessage);

        return List.of(MessageConverter.toDTO(userMessage), MessageConverter.toDTO(aiMessage));
    }


    public MessageDO createMessage(MessageDO message) {
         messageMapper.insert(message);
         return message;
    }

    public List<MessageDO> listMessagesByConversationId(Long conversationId) {
        LambdaQueryWrapper<MessageDO> queryWrapper = new LambdaQueryWrapper<>();
        queryWrapper.eq(MessageDO::getConversationId, conversationId);
        // 可以加入排序等其他条件
        return messageMapper.selectList(queryWrapper);
    }

    public boolean deleteMessagesByConversationId(Long conversationId) {
        LambdaQueryWrapper<MessageDO> queryWrapper = new LambdaQueryWrapper<>();
        queryWrapper.eq(MessageDO::getConversationId, conversationId);
        return messageMapper.delete(queryWrapper) >= 0;
    }
}
