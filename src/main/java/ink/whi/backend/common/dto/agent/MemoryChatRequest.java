package ink.whi.backend.common.dto.request;

import ink.whi.backend.common.dto.ModelConfig;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

import java.util.List;

/**
 * 请求数据传输对象
 */
@Data
public class MemoryChatRequest extends BaseModelRequest{
    /**
     * 单条消息内容
     */
    @NotBlank(message = "消息内容不能为空")
    private String message;

    /**
     * 保存消息数量
     */
    @NotBlank(message = "保存消息数量不能为空")
    private Integer maxCount;
}
