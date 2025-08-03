package ink.whi.backend.common.dto.knowledgeBase;

import ink.whi.backend.common.dto.BaseDTO;
import lombok.Data;

/**
 * @author: qing
 * @Date: 2025/7/27
 */
@Data
public class KbItemDto extends BaseDTO {
    public String title;

    /**
     * 处理方式
     */
    private String processType;

    /**
     * 分块数量
     */
    private Integer chunks;

    private String embeddingStatus;

    private Boolean isEnable;
}
