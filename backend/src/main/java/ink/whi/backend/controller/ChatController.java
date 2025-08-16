package ink.whi.backend.controller;

import ink.whi.backend.service.conv.ChatService;
//import ink.whi.backend.agent.ChatMemoryAgent;
import ink.whi.backend.common.dto.chat.ChatReq;
import ink.whi.backend.service.conv.ConversationService;
import jakarta.validation.Valid;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

/**
 * chat接口
 * @author: qing
 * @Date: 2025/3/30
 */
@Slf4j
@RestController
@RequestMapping("/api/chat")
public class ChatController {

    @Autowired
    public ConversationService convService;

    @Autowired
    public ChatService chatService;

    /**
     * 流式对话接口
     * @param request 请求参数
     * @return SseEmitter 流式响应
     */
    @PostMapping("/")
    public SseEmitter chat(@Valid @RequestBody ChatReq request) {
        return chatService.streamingChat(request);
    }
}
