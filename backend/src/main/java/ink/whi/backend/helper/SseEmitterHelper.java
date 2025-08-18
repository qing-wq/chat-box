package ink.whi.backend.helper;

import ink.whi.backend.cache.SseEmitterCache;
import ink.whi.backend.common.dto.sse.SessionInfo;
import ink.whi.backend.common.enums.SseEventEnum;
import ink.whi.backend.common.exception.BusinessException;
import ink.whi.backend.common.status.StatusEnum;
import lombok.extern.slf4j.Slf4j;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import java.io.IOException;
import java.util.concurrent.TimeUnit;

/**
 * @author: qing
 * @Date: 2025/8/17
 */
@Slf4j
@Component
public class SseEmitterHelper {

    private static final Logger logger = LoggerFactory.getLogger("sse");

    private static final long SSE_TIMEOUT = TimeUnit.MINUTES.toMillis(10);

    @Autowired
    private SseEmitterCache sseEmitterCache;

    /**
     * 创建SseEmitter并缓存
     * @param uuid 会话UUID
     */
    public SseEmitter createEmitter(String uuid) {
        SseEmitter emitter = new SseEmitter(SSE_TIMEOUT);
        
        // 创建SessionInfo并放入缓存
        sseEmitterCache.put(uuid, emitter);

        emitter.onCompletion(() -> {
            logger.info("response complete for uuid: {}", uuid);
            sseEmitterCache.remove(uuid);
        });
        emitter.onTimeout(() -> {
            logger.warn("sseEmitter on timeout:{} for uuid: {}", emitter.getTimeout(), uuid);
            sseEmitterCache.remove(uuid);
        });
        emitter.onError(
                throwable -> {
                    try {
                        log.error("sseEmitter on error for uuid: {}", uuid, throwable);
                        emitter.send(SseEmitter.event().name(SseEventEnum.ERROR.getEvent()).data(throwable.getMessage()));
                        sseEmitterCache.remove(uuid);
                    } catch (IOException e) {
                        log.error("error", e);
                    }
                }
        );

        return emitter;
    }

    /**
     * 发送开始事件
     * @param sseEmitter
     */
    public void startSse(SseEmitter sseEmitter) {
        startSse(sseEmitter, null);
    }

    /**
     * 发送开始事件
     * @param emitter
     * @param data 可选数据
     */
    public void startSse(SseEmitter emitter, String data) {
        try {
            emitter.send(SseEmitter.event()
                    .name(SseEventEnum.BEGIN.getEvent())
                    .data(data != null ? data : ""));
        } catch (IOException e) {
            log.error("Failed to send begin event", e);
        }
    }

    /**
     * 通过UUID停止SSE连接
     * @param uuid 会话UUID
     */
    public void stopSse(String uuid) {
        SessionInfo sessionInfo = sseEmitterCache.getSessionInfo(uuid);
        
        if (sessionInfo == null) {
            logger.warn("SessionInfo not found for uuid: {}", uuid);
            return;
        }
        
        // 设置停止状态，让流处理逻辑检测并优雅停止
        sseEmitterCache.setStopStatus(uuid);
        logger.info("停止信号已发送, uuid: {}", uuid);
    }
    
    /**
     * 检查会话是否停止
     * @param uuid 会话UUID
     * @return 是否停止
     */
    public boolean isSessionStopped(String uuid) {
        SessionInfo sessionInfo = sseEmitterCache.getSessionInfo(uuid);
        return sessionInfo != null && sessionInfo.isStop();
    }
    
    /**
     * 获取会话信息
     * @param uuid 会话UUID
     * @return SessionInfo
     */
    public SessionInfo getSessionInfo(String uuid) {
        return sseEmitterCache.getSessionInfo(uuid);
    }
}
