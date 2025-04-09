package ink.whi.backend.common.dto.agent;

import lombok.Data;

/**
 * @author: qing
 * @Date: 2025/3/30
 */
@Data
public class ModelParams {
    /**
     * 温度参数，控制输出的随机性 (0-2.0)
     */
    private Double temperature;

    /**
     * 核采样参数 (0-1.0)
     */
    private Double topP;

    /**
     * 最大输出token数
     */
    private Integer maxTokens;
}
