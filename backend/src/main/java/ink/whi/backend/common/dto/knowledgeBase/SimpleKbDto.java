package ink.whi.backend.common.dto.knowledgeBase;

import ink.whi.backend.common.dto.BaseDTO;
import ink.whi.backend.common.dto.model.ModelDTO;
import lombok.Data;

/**
 * @author: qing
 * @Date: 2025/7/27
 */
@Data
public class SimpleKbDto extends BaseDTO {
    /**
     * 标题
     */
    private String title;

    /**
     * 描述
     */
    private String remark;

    /**
     * 是否公开
     */
    private Boolean isPublic;
}
