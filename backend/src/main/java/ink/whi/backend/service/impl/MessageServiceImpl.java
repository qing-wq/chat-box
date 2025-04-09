package ink.whi.backend.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import ink.whi.backend.common.converter.MessageConverter;
import ink.whi.backend.common.dto.message.MessageDTO;
import ink.whi.backend.dao.entity.MessageDO;
import ink.whi.backend.dao.mapper.MessageMapper;
import ink.whi.backend.service.MessageService;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * 消息服务实现类
 *
 * @author: qing
 * @Date: 2025/3/2
 */
@Service
public class MessageServiceImpl extends ServiceImpl<MessageMapper, MessageDO> implements MessageService {

    public void saveMessages(List<MessageDTO> messages) {
        List<MessageDO> messageList = messages.stream().map(MessageConverter::toDO).toList();
        saveBatch(messageList);
    }

    public MessageDO createMessage(MessageDO message) {
        baseMapper.insert(message);
        return message;
    }

    public List<MessageDTO> queryMessageListByChatId(Integer chatId) {
        LambdaQueryWrapper<MessageDO> queryWrapper = new LambdaQueryWrapper<>();
        queryWrapper.eq(MessageDO::getChatId, chatId)
                .orderByAsc(MessageDO::getCreateTime);
        List<MessageDO> messages = baseMapper.selectList(queryWrapper);
        return MessageConverter.toDTOList(messages);
    }

    public void deleteMessagesByChatId(Long chatId) {
        LambdaQueryWrapper<MessageDO> queryWrapper = new LambdaQueryWrapper<>();
        queryWrapper.eq(MessageDO::getChatId, chatId);
        baseMapper.delete(queryWrapper);
    }
}
