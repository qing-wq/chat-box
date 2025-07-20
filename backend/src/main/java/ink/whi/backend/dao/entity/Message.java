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
public class Message extends BaseEntity {

    public String conversationUuid;

    public Integer userId;

    private Integer role;

    private Integer modelId;

    public String content;

    /**
     * token数量
     */
    private Integer tokens;
}
