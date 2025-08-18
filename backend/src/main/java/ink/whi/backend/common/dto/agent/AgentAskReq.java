package ink.whi.backend.common.dto.agent;

import lombok.Data;

import java.io.Serializable;
import java.util.List;

/**
 * @author: qing
 * @Date: 2025/8/5
 */
@Data
public class AgentAskReq implements Serializable {
    /**
     * 对话id
     */
    private String conversationUuId;

    /**
     * 用户消息
     */
    private String userMessage;

    /**
     * 模型
     */
    private Integer modelId;

    /**
     * 知识库（可选）
     */
    private List<Integer> kbId;

    /**
     * 工具列表（可选）
     */
    private List<String> toolList;

    /**
     * 附件列表（可选）
     */
    private List<String> imageUrls;
}
