package ink.whi.backend.common.dto.agent;

import ink.whi.backend.common.dto.chat.ModelParams;
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
    private ModelParams modelParams;

    /**
     * 知识库（可选）
     */
    private List<Integer> kbId;

    /**
     * 知识库检索参数
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
