package ink.whi.backend.common.enums;

import lombok.Getter;

/**
 * @author: qing
 * @Date: 2025/8/17
 */
@Getter
public enum SseEventEnum {
    
    BEGIN("begin"),
    ERROR("error"),
    STOP("stop");
    
    private final String event;

    SseEventEnum(String event) {
        this.event = event;
    }
}
