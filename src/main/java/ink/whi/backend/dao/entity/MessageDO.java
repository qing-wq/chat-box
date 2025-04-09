package ink.whi.chatboxbackend.dao.entity;

import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;

import java.io.Serializable;

/**
 * @author: qing
 * @Date: 2025/3/2
 */
@Data
@TableName("message")
public class MessageDO extends BaseDO {

    public Integer conversationId;
    public Integer parentId;
    public String content;
    public Integer role;
}
