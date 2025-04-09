package ink.whi.backend.controller;


import ink.whi.backend.common.context.ReqInfoContext;
import ink.whi.backend.common.converter.ChatConverter;
import ink.whi.backend.common.dto.ResVo;
import ink.whi.backend.common.dto.chat.ChatDTO;
import ink.whi.backend.common.dto.chat.ChatUpdateReq;
import ink.whi.backend.common.dto.chat.SimpleChatDTO;
import ink.whi.backend.common.dto.message.MessageDTO;
import ink.whi.backend.common.status.StatusEnum;
import ink.whi.backend.dao.entity.ChatDO;
import ink.whi.backend.service.impl.ChatServiceImpl;
import ink.whi.backend.service.impl.MessageServiceImpl;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * 对话接口
 *
 * @author: qing
 * @Date: 2025/3/2
 */
@RestController
@RequestMapping("/api/chat")
@RequiredArgsConstructor
public class ChatController {

    private final ChatServiceImpl chatService;
    private final MessageServiceImpl messageService;

    /**
     * 创建新的对话
     *
     * @return 对话ID
     */
    @PostMapping("/new")
    public ResVo<SimpleChatDTO> createChat() {
        ChatDO chatDO = new ChatDO();
        chatDO.setTitle("新建对话");
        chatDO.setUserId(ReqInfoContext.getReqInfo().getUserId());

        chatDO = chatService.createChat(chatDO);
        return ResVo.ok(ChatConverter.toDTO(chatDO));
    }

    /**
     * 保存对话消息
     * @param
     * @return
     */
    @PostMapping("/update")
    public ResVo<String> updateChat(@RequestBody @Validated ChatUpdateReq req) {
        List<MessageDTO> newMessageList = req.getNewMessageList();
        if (newMessageList.size() != 2) {
            return ResVo.fail(StatusEnum.ILLEGAL_ARGUMENTS_MIXED, "更新消息不合法");
        }
        chatService.updateChatMessage(req);
        return ResVo.ok("ok");
    }

    /**
     * 获取对话详情
     *
     * @param chatId 对话ID
     * @return 对话详情
     */
    @GetMapping("/detail/{chatId}")
    public ResVo<ChatDTO> getChat(@PathVariable Integer chatId) {
        ChatDTO chat = chatService.queryChatDetail(chatId);
        return ResVo.ok(chat);
    }

    /**
     * 获取用户的所有对话
     *
     * @return 对话列表
     */
    @GetMapping("/list")
    public ResVo<List<SimpleChatDTO>> listChats() {
        Integer userId = ReqInfoContext.getUserId();
        List<ChatDO> chats = chatService.listChatsByUserId(userId);
        return ResVo.ok(ChatConverter.toDTOList(chats));
    }

    /**
     * 更新对话信息（仅更新标题以及更新时间）
     *
     * @param chat 更新请求
     * @return 是否成功
     */
    @PostMapping("/update/info")
    public ResVo<String> updateChatInfo(@RequestBody SimpleChatDTO chat) {
        // TODO 权限校验

        chatService.updateChatInfo(chat);
        return ResVo.ok("ok");
    }

    /**
     * 删除对话
     *
     * @param id 对话ID
     * @return 是否成功
     */
    @GetMapping("/delete/{id}")
    public ResVo<String> deleteChat(@PathVariable Integer id) {
        // TODO 权限校验

        // 删除对话相关的所有消息
        messageService.deleteMessagesByChatId(id.longValue());

        // 删除对话
        chatService.deleteChat(id);
        return ResVo.ok("ok");
    }



    /**
     * 清除对话中的消息
     * @param id
     * @return
     */
//    @GetMapping("/clear/{id}")
//    public ResVo<String> clearChat(@PathVariable Integer id) {
//        // 首先确认对话是否存在
//        ChatDO chatDO = chatService.getById(id);
//        if (chatDO == null) {
//            return ResVo.fail(StatusEnum.ILLEGAL_ARGUMENTS_MIXED, "对话不存在");
//        }
//
//        // 删除对话相关的所有消息
//        messageService.deleteMessagesByChatId(id.longValue());
//
//        // 删除对话
//        return ResVo.ok("success");
//    }
}
