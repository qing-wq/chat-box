package ink.whi.backend.common.dto.conversation;

import lombok.Data;

/**
 * @author: qing
 * @Date: 2025/3/13
 */
@Data
public class ConvUpdateReq {
    private String uuid;

    private String title;

    private String description;

    private String systemMessage;
}
