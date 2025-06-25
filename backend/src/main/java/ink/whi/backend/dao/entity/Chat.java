package ink.whi.backend.dao.entity;

import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * @author: qing
 * @Date: 2025/3/2
 */
@Data
@EqualsAndHashCode(callSuper=true)
@TableName("chat")
public class ChatDO extends BaseDO {

    public String title;
    public Integer userId;
}
