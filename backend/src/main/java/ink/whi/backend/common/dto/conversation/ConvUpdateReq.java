package ink.whi.backend.common.dto.conversation;

import ink.whi.backend.common.dto.agent.ModelParams;
import lombok.Data;

/**
 * @author: qing
 * @Date: 2025/3/13
 */
@Data
public class ConvUpdateReq {

    private String uuid;

    private String title;

    private String systemMessage;

    /**
     * 温度参数，控制输出的随机性 (0-2.0)
     */
    private Double temperature;

    /**
     * 最大token数
     */
    private Integer maxTokens;

    /**
     * 上下文窗口
     */
    private Integer contextWindow;
}
