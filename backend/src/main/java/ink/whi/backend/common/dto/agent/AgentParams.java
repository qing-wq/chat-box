package ink.whi.backend.common.dto.agent;

import ink.whi.backend.common.dto.chat.ModelSettings;
import lombok.Data;

import java.util.List;

/**
 * 请求数据传输对象
 */
@Data
public class AgentParams {

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
     * 模型参数
     */
    private ModelSettings modelSettings;

    /**
     * 知识库（可选）
     */
    private List<Integer> kbId;

    /**
     * 检索参数
     */
    private RetrieveSetting retrieveSetting;

    /**
     * 工具列表（可选）
     */
    private List<String> toolList;

    /**
     * 附件列表（可选）
     */
    private List<String> imageUrls;
}
