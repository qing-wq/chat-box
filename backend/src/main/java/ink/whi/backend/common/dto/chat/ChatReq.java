package ink.whi.backend.common.dto.chat;

import lombok.Data;

import java.io.Serializable;
import java.util.List;

/**
 * 请求数据传输对象
 */
@Data
public class ChatReq implements Serializable {

    /**
     * 对话id
     */
    private String conversationUuId;

    /**
     * 单条消息
     */
    private String userMessage;

    /**
     * 模型
     */
    private Integer modelId;
    
    /**
     * 工具列表（可选）
     */
    private List<String> toolList;

    /**
     * 附件列表（可选）
     */
    private List<String> imageUrls;
}
