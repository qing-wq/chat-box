package ink.whi.backend.common.dto.agent;

import lombok.Data;

/**
 * Agent请求数据传输对象
 */
@Data
public class AgentRequestDTO {
    /**
     * 消息内容
     */
    private String message;
    
    /**
     * API密钥（可选）
     */
    private String apiKey;
}
