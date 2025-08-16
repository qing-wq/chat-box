package ink.whi.backend.common.utils;

import ink.whi.backend.common.enums.SseEventEnum;
import lombok.extern.slf4j.Slf4j;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import java.io.IOException;
import java.text.MessageFormat;
import java.util.HashMap;
import java.util.Map;
import java.util.concurrent.TimeUnit;

/**
 * @author: qing
 * @Date: 2025/8/17
 */
@Slf4j
public class SseEmitterUtil {

    private static final Logger logger = LoggerFactory.getLogger("sse");

    private static final long SSE_TIMEOUT = TimeUnit.SECONDS.toMillis(30);

    /**
     * 创建SseEmitter
     */
    public static SseEmitter createEmitter() {
        SseEmitter emitter = new SseEmitter(SSE_TIMEOUT);

        // 配置回调函数
        emitter.onCompletion(() -> logger.info("response complete"));
        emitter.onTimeout(() -> logger.warn("sseEmitter on timeout:{}", emitter.getTimeout()));
        emitter.onError(
                throwable -> {
                    try {
                        log.error("sseEmitter on error", throwable);
                        emitter.send(SseEmitter.event().name(SseEventEnum.ERROR.getEvent()).data(throwable.getMessage()));
                    } catch (IOException e) {
                        log.error("error", e);
                    }
                }
        );

        return emitter;
    }

    /**
     * 发送开始事件
     */
    public static void startSse(SseEmitter emitter, String data) {
        try {
            emitter.send(SseEmitter.event()
                    .name("begin")
                    .data(data));
        } catch (IOException e) {
            log.error("Failed to send begin event", e);
        }
    }
}
