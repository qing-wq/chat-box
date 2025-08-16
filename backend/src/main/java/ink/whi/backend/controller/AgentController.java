package ink.whi.backend.controller;

import ink.whi.backend.common.dto.agent.AgentParams;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

/**
 * @author: qing
 * @Date: 2025/8/5
 */
@RestController
@RequestMapping("api/agent")
public class AgentController {

    @PostMapping("/")
    public SseEmitter ask(@RequestBody AgentParams request) {
        return null;
    }
}
