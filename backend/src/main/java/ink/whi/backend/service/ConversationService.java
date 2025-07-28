package ink.whi.backend.service;

import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import ink.whi.backend.common.context.ReqInfoContext;
import ink.whi.backend.common.dto.conversation.ConvUpdateReq;
import ink.whi.backend.common.exception.BusinessException;
import ink.whi.backend.common.status.StatusEnum;
import ink.whi.backend.dao.entity.Conversation;
import ink.whi.backend.dao.mapper.ChatMapper;
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
public class ConversationService extends ServiceImpl<ChatMapper, Conversation> {

    public Conversation createConv(Conversation conversation) {
        save(conversation);
        return conversation;
    }

    public List<Conversation> listConvByUserId(Integer userId) {
        return lambdaQuery().eq(Conversation::getUserId, userId)
                .orderByDesc(Conversation::getUpdateTime)
                .list();
    }

    public void updateConvInfo(ConvUpdateReq req) {
        Conversation conv = getAndCheck(req.getUuid());

        if (req.getTitle() != null) {
            conv.setTitle(req.getTitle());
        }

        if (req.getSystemMessage() != null) {
            conv.setSystemMessage(req.getSystemMessage());
        }       

        updateById(conv);
    }

    public void deleteConv(String uuid) {
        lambdaUpdate().eq(Conversation::getUuid, uuid).remove();
    }

    public Conversation getAndCheck(String uuid) {
        Conversation conv = lambdaQuery().eq(Conversation::getUuid, uuid).oneOpt().orElse(null);
        checkStatus(conv);
        return conv;
    }

    public void checkStatus(Conversation conversation) {
        if (conversation == null) {
            throw BusinessException.newInstance(StatusEnum.ILLEGAL_ARGUMENTS_MIXED, "对话不存在");
        }

        if (!Objects.equals(conversation.getUserId(), ReqInfoContext.getUserId())) {
            throw BusinessException.newInstance(StatusEnum.FORBID_ERROR);
        }
    }

    public void updateTime(Conversation conv) {
        conv.setUpdateTime(new Date());
        updateById(conv);
    }
}
