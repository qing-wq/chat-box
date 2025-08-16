package ink.whi.backend.common.dto.knowledgeBase;

import ink.whi.backend.common.enums.ProcessTypeEnum;
import lombok.Builder;
import lombok.Data;

/**
 * 数据处理设置
 * @author: qing
 * @Date: 2025/7/27
 */
@Data
@Builder
public class ProcessSetting {

    /**
     * 处理方式
     */
    private ProcessTypeEnum processType;

    /**
     * 分块大小(100-3000)
     */
    private Integer blockSize;

    /**
     * 重叠大小（可选）
     */
    private int maxOverlap;

    /**
     * 问答提示词（可选）
     */
    private String qaPrompt;
}
