package ink.whi.backend.common.dto.sse;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import java.time.LocalDateTime;

/**
 * SSE会话信息
 * 
 * @author: qing
 * @Date: 2025/8/18
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class SessionInfo {
    
    /**
     * 会话ID
     */
    private String sessionId;
    
    /**
     * SSE连接
     */
    private SseEmitter emitter;
    
    /**
     * 是否停止标志
     */
    private boolean isStop;
}
