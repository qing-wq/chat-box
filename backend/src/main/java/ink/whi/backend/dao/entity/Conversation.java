package ink.whi.backend.dao.entity;

import com.baomidou.mybatisplus.annotation.TableField;
import com.baomidou.mybatisplus.annotation.TableName;
import com.baomidou.mybatisplus.extension.handlers.FastjsonTypeHandler;
import ink.whi.backend.common.dto.chat.ModelParams;
import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * @author: qing
 * @Date: 2025/3/2
 */
@Data
@EqualsAndHashCode(callSuper = true)
@TableName(value = "conversation", autoResultMap = true)
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

    @TableField(typeHandler = FastjsonTypeHandler.class)
    private ModelParams modelParams;
}
