package ink.whi.backend.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import ink.whi.backend.dao.entity.ChatDO;
import ink.whi.backend.dao.mapper.ChatMapper;
import ink.whi.backend.service.ChatService;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.List;

/**
 * 会话服务实现类
 *
 * @author: qing
 * @Date: 2025/3/2
 */
@Service
public class ChatServiceServiceImpl extends ServiceImpl<ChatMapper, ChatDO> implements ChatService {

    public ChatDO createChat(ChatDO chat) {
        save(chat);
        return chat;
    }

    public ChatDO getChatById(Integer id) {
        return getById(id);
    }

    public List<ChatDO> listChatsByUserId(Integer userId) {
        LambdaQueryWrapper<ChatDO> queryWrapper = new LambdaQueryWrapper<>();
        queryWrapper.eq(ChatDO::getUserId, userId);
        queryWrapper.orderByDesc(ChatDO::getUpdateTime);
        return this.baseMapper.selectList(queryWrapper);
    }

    public boolean updateChat(ChatDO chat) {
        // 更新修改时间
        chat.setUpdateTime(new Date());
        return updateById(chat);
    }

    public boolean deleteChat(Integer id) {
        return removeById(id);
    }
}
