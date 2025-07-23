package ink.whi.backend.dao.entity;

import com.baomidou.mybatisplus.annotation.TableName;
import ink.whi.backend.common.dto.agent.ModelParams;
import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * @author: qing
 * @Date: 2025/3/2
 */
@Data
@EqualsAndHashCode(callSuper = true)
@TableName("conversation")
public class Conversation extends BaseEntity {

    /**
     * 标题
     */
    private String title;

    private String uuid;

    private Integer userId;

    /**
     * 是否允许公开访问
     */
    private Integer isPublic;

    /**
     * 系统提示词
     */
    private String systemMessage;

    private ModelParams modelParams;
}
