package ink.whi.backend.common.utils;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import java.util.concurrent.TimeUnit;

/**
 * @author: qing
 * @Date: 2025/3/29
 */
public class SSEUtil {

    private static final Logger logger = LoggerFactory.getLogger("sse");

    private static final long SSE_TIMEOUT = TimeUnit.SECONDS.toMillis(30);

    /**
     * 创建SSE发射器
     */
    public static SseEmitter createEmitter() {
        SseEmitter emitter = new SseEmitter(SSE_TIMEOUT);

        // 配置回调函数
        emitter.onCompletion(() -> logger.info("SSE连接完成"));
        emitter.onTimeout(() -> logger.warn("SSE连接超时"));
        emitter.onError(e -> logger.error("SSE连接发生错误", e));

        return emitter;
    }
}
