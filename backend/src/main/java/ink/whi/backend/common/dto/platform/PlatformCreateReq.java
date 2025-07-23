package ink.whi.backend.common.dto.platform;

import lombok.Data;

/**
 * 平台创建请求
 * @author: qing
 * @Date: 2025/1/14
 */
@Data
public class PlatformCreateReq {

    /**
     * 平台名称
     */
    private String name;

    /**
     * 平台类型
     */
    private String type;

    /**
     * API密钥
     */
    private String apiKey;

    /**
     * 基础URL
     */
    private String baseUrl;
} 