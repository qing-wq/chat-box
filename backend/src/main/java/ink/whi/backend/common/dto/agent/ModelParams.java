package ink.whi.backend.common.dto.agent;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;

/**
 * @author: qing
 * @Date: 2025/3/30
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ModelParams implements Serializable {
    /**
     * 温度参数，控制输出的随机性 (0-2.0)
     */
    @JsonProperty("temperature")
    private Double temperature;

    /**
     * 最大token数
     */
    @JsonProperty("maxTokens")
    private Integer maxTokens;

    /**
     * 上下文窗口
     */
    @JsonProperty("contextWindow")
    private Integer contextWindow;
}
