package ink.whi.backend.common.dto.agent;

import ink.whi.backend.common.dto.message.MessageDTO;
import lombok.Data;

import java.io.Serializable;
import java.util.List;

/**
 * 请求数据传输对象
 */
@Data
public class BaseModelRequest implements Serializable {

    /**
     * 对话id
     */
    public Integer chatId;

    /**
     * 单条消息
     */
    private String message;
    
    /**
     * 消息列表
     */
    private List<MessageDTO> messageList;
    
    /**
     * 模型配置参数
     */
    private ModelConfig modelConfig;
    
    /**
     * 工具列表（可选）
     */
    private List<String> toolList;
}
