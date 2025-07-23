package ink.whi.backend.common.dto.agent;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

/**
 * 请求数据传输对象
 */
@Data
public class MemoryChatRequest extends ChatReq {
    /**
     * 单条消息内容
     */
    @NotBlank(message = "消息内容不能为空")
    private String message;

    /**
     * 保存消息数量
     */
//    private Integer maxCount;
}
