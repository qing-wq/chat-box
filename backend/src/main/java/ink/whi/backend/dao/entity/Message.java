package ink.whi.backend.dao.entity;

import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * @author: qing
 * @Date: 2025/3/2
 */
@Data
@EqualsAndHashCode(callSuper = true)
@TableName("message")
public class MessageDO extends BaseDO {

    public Integer chatId;
//    public Integer parentId;
    public String content;
    public Integer role;
}
