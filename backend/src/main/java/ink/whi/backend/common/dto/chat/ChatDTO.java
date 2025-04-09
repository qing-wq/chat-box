package ink.whi.backend.common.dto.chat;

import ink.whi.backend.common.dto.BaseDTO;
import ink.whi.backend.common.dto.message.MessageDTO;
import lombok.Data;
import lombok.EqualsAndHashCode;

import java.io.Serial;
import java.io.Serializable;
import java.util.List;

/**
 * @author: qing
 * @Date: 2025/3/30
 */
@Data
@EqualsAndHashCode(callSuper = true)
public class ChatDTO extends BaseDTO {

    @Serial
    private static final long serialVersionUID = -1314162575898615006L;

    public String title;

    public List<MessageDTO> messageList;
}
