package ink.whi.chatboxbackend.controller;

import ink.whi.chatboxbackend.common.converter.ConversationConverter;
import ink.whi.chatboxbackend.common.dto.ResVo;
import ink.whi.chatboxbackend.common.exception.BusinessException;
import ink.whi.chatboxbackend.common.exception.StatusEnum;
import ink.whi.chatboxbackend.context.ReqInfoContext;
import ink.whi.chatboxbackend.common.dto.conversation.ConversationDTO;
import ink.whi.chatboxbackend.dao.entity.ConversationDO;
import ink.whi.chatboxbackend.service.ConversationServiceImpl;
import ink.whi.chatboxbackend.service.MessageService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * 聊天控制器
 *
 * @author: qing
 * @Date: 2025/3/2
 */
@RestController
@RequestMapping("/api/conversation")
@RequiredArgsConstructor
public class ConversationController {

    private final ConversationServiceImpl conversationServiceImpl;
    private final MessageService messageService;

    /**
     * 创建新的对话
     *
     * @return 对话ID
     */
    @PostMapping("/new")
    public ResVo<ConversationDTO> createConversation() {
        ConversationDO conversationDO = new ConversationDO();
        conversationDO.setTitle("新建对话");
        conversationDO.setUserId(ReqInfoContext.getReqInfo().getUserId());

        conversationDO = conversationServiceImpl.createConversation(conversationDO);
        return ResVo.ok(ConversationConverter.toDTO(conversationDO));
    }

    /**
     * 获取对话详情
     *
     * @param id 对话ID
     * @return 对话详情
     */
    @GetMapping("/{id}")
    public ResVo<ConversationDTO> getConversation(@PathVariable Integer id) {
        ConversationDO conversationDO = checkConversation(id);

        return ResVo.ok(ConversationConverter.toDTO(conversationDO));
    }

    /**
     * 获取用户的所有对话
     *
     * @return 对话列表
     */
    @GetMapping("/list")
    public ResVo<List<ConversationDTO>> listConversations() {
        Integer userId = ReqInfoContext.getUserId();
        List<ConversationDO> conversations = conversationServiceImpl.listConversationsByUserId(userId);
        List<ConversationDTO> conversationDTOs = ConversationConverter.toDTOList(conversations);
        
        return ResVo.ok(conversationDTOs);
    }

    /**
     * 更新对话信息
     *
     * @param request 更新请求
     * @return 是否成功
     */
    @PostMapping("/update")
    public ResVo<Boolean> updateConversation(@RequestBody ConversationDTO request) {
        ConversationDO conversationDO = checkConversation(request.getId());

        conversationDO.setTitle(request.getTitle());
        
        boolean success = conversationServiceImpl.updateConversation(conversationDO);
        return ResVo.ok(success);
    }

    /**
     * 删除对话
     *
     * @param id 对话ID
     * @return 是否成功
     */
    @GetMapping("/delete/{id}")
    public ResVo<Boolean> deleteConversation(@PathVariable Integer id) {
        checkConversation(id);

        // 删除对话相关的所有消息
        messageService.deleteMessagesByConversationId(id.longValue());
        
        // 删除对话
        boolean success = conversationServiceImpl.deleteConversation(id);
        return ResVo.ok(success);
    }

    public ConversationDO checkConversation(Integer id) {
        // 首先确认对话是否存在
        ConversationDO conversationDO = conversationServiceImpl.getConversationById(id);
        if (conversationDO == null) {
            throw BusinessException.newInstance(StatusEnum.ILLEGAL_ARGUMENTS_MIXED, "对话不存在");
        }
        return conversationDO;
    }

    /**
     * 清除对话中的消息
     * @param id
     * @return
     */
    @GetMapping("/clear/{id}")
    public ResVo<String> clearConversation(@PathVariable Integer id) {
        // 首先确认对话是否存在
        ConversationDO conversationDO = conversationServiceImpl.getConversationById(id);
        if (conversationDO == null) {
            return ResVo.fail(StatusEnum.ILLEGAL_ARGUMENTS_MIXED, "对话不存在");
        }

        // 删除对话相关的所有消息
        messageService.deleteMessagesByConversationId(id.longValue());

        // 删除对话
        return ResVo.ok("success");
    }
}
