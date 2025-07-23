package ink.whi.backend.common.dto.platform;

import lombok.Data;

/**
 * 平台更新请求
 * @author: qing
 * @Date: 2025/1/14
 */
@Data
public class PlatformUpdateReq {

    /**
     * 平台ID
     */
    private Integer id;

    /**
     * API密钥
     */
    private String apiKey;

    /**
     * 基础URL
     */
    private String baseUrl;
} 