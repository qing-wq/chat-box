package ink.whi.backend.common.dto.chat;

import jakarta.validation.constraints.NotBlank;
import lombok.Builder;
import lombok.Data;

/**
 * 模型配置参数
 */
@Data
@Builder
public class ModelConfig {
    /**
     * API地址（必填）
     */
    @NotBlank(message = "API地址不能为空")
    private String baseUrl;

    /**
     * API密钥（必填）
     */
    @NotBlank(message = "API密钥不能为空")
    private String apiKey;

    /**
     * 模型名称（必填）
     */
    @NotBlank(message = "模型名称不能为空")
    private String modelName;

    /**
     * 模型参数（可选）
     */
    private ModelSettings modelSettings;
}
