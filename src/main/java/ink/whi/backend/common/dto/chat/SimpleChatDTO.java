package ink.whi.backend.common.dto.chat;

import ink.whi.backend.common.dto.BaseDTO;
import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * @author: qing
 * @Date: 2025/3/13
 */
@Data
@EqualsAndHashCode(callSuper = true)
public class ChatDTO extends BaseDTO {
    private String title;
}
