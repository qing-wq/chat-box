package ink.whi.backend.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import ink.whi.backend.common.context.ReqInfoContext;
import ink.whi.backend.common.dto.chat.ChatDTO;
import ink.whi.backend.common.dto.chat.ChatUpdateReq;
import ink.whi.backend.common.dto.chat.SimpleChatDTO;
import ink.whi.backend.common.dto.message.MessageDTO;
import ink.whi.backend.common.exception.BusinessException;
import ink.whi.backend.common.status.StatusEnum;
import ink.whi.backend.dao.entity.ChatDO;
import ink.whi.backend.dao.mapper.ChatMapper;
import ink.whi.backend.service.ChatService;
import io.micrometer.common.util.StringUtils;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.List;
import java.util.Objects;

/**
 * 会话服务实现类
 *
 * @author: qing
 * @Date: 2025/3/2
 */
@Service
public class ChatServiceImpl extends ServiceImpl<ChatMapper, ChatDO> implements ChatService {

    @Autowired
    private MessageServiceImpl messageService;

    public ChatDO createChat(ChatDO chat) {
        save(chat);
        return chat;
    }

    public ChatDTO queryChatDetail(Integer chatId) {
        ChatDTO dto = new ChatDTO();

        ChatDO chatDO = getById(chatId);
        BeanUtils.copyProperties(chatDO, dto);

        List<MessageDTO> messages = messageService.queryMessageListByChatId(chatId);
        dto.setMessageList(messages);

        return dto;
    }

    public List<ChatDO> listChatsByUserId(Integer userId) {
        LambdaQueryWrapper<ChatDO> queryWrapper = new LambdaQueryWrapper<>();
        queryWrapper.eq(ChatDO::getUserId, userId);
        queryWrapper.orderByDesc(ChatDO::getUpdateTime);
        return this.baseMapper.selectList(queryWrapper);
    }

    public void updateChatInfo(SimpleChatDTO chat) {
        ChatDO chatDO = getById(chat.getId());
        if (chatDO == null) {
            throw BusinessException.newInstance(StatusEnum.ILLEGAL_ARGUMENTS_MIXED, chat.getId());
        }

        // 更新修改时间
        chatDO.setUpdateTime(new Date());
        if (StringUtils.isNotBlank(chat.getTitle())) {
            chatDO.setTitle(chat.getTitle());
        }
        updateById(chatDO);
    }

    public void deleteChat(Integer chatId) {
        removeById(chatId);
    }

    @Override
    public void updateChatMessage(ChatUpdateReq request) {
        ChatDO chatDO = getById(request.getChatId());
        if (chatDO == null) {
            throw BusinessException.newInstance(StatusEnum.ILLEGAL_ARGUMENTS_MIXED, "chatId不存在:" + request.getChatId());
        }
        if ( !Objects.equals(chatDO.getUserId(), ReqInfoContext.getUserId())) {
            throw BusinessException.newInstance(StatusEnum.FORBID_ERROR);
        }
        messageService.saveMessages(request.getNewMessageList());
        chatDO.setUpdateTime(new Date());
        updateById(chatDO);
    }
}
