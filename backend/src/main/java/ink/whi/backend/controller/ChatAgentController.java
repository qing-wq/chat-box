package ink.whi.backend.controller;

import ink.whi.backend.agent.ChatAgent;
import ink.whi.backend.agent.ChatMemoryAgent;
import ink.whi.backend.common.dto.ResVo;
import ink.whi.backend.common.dto.agent.MemoryChatRequest;
import ink.whi.backend.common.dto.agent.BaseModelRequest;
import ink.whi.backend.common.exception.BusinessException;
import ink.whi.backend.common.status.StatusEnum;
import ink.whi.backend.dao.entity.ChatDO;
import ink.whi.backend.service.impl.ChatServiceImpl;
import jakarta.validation.Valid;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

/**
 * 聊天Agent接口
 * @author: qing
 * @Date: 2025/3/30
 */
@Slf4j
@RestController
@RequestMapping("/api/agent")
public class ChatAgentController {

    @Autowired
    public ChatServiceImpl chatService;

    @Autowired
    public ChatAgent chatAgent;

    @Autowired
    public ChatMemoryAgent chatmemoryAgent;

    /**
     * 流式多轮对话接口
     * @param request 请求参数
     * @return SseEmitter 流式响应
     */
    @PostMapping("/chat")
    public SseEmitter chat(@Valid @RequestBody BaseModelRequest request) {
        log.info("接收到chat请求，消息数: {}", request.getMessageList().size());
        ChatDO chat = chatService.getById(request.getChatId());
        if (chat == null) {
            throw BusinessException.newInstance(StatusEnum.ILLEGAL_ARGUMENTS_MIXED, "chatId不存在");
        }
        return chatAgent.streamingChat(request);
    }

    /**
     * 记忆对话接口
     * @param request 请求参数
     * @return SseEmitter 流式响应
     */
    @PostMapping("/chat/memory/{sessionId}")
    public SseEmitter chatWithMemory(@Valid @RequestBody BaseModelRequest request, @PathVariable String sessionId) {
        return chatmemoryAgent.streamingChatWithMemory(request, sessionId);
    }

    /**
     * 带文件对话接口
     * @param request 请求参数
     * @return SseEmitter 流式响应
     */
    @PostMapping("/chat/file")
    public SseEmitter chatWithFile(@RequestBody BaseModelRequest request) {

        return null;
    }
}
