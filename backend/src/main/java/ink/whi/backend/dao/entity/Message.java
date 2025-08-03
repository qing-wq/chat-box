package ink.whi.backend.dao.entity;

import com.baomidou.mybatisplus.annotation.TableField;
import com.baomidou.mybatisplus.annotation.TableName;
import com.baomidou.mybatisplus.extension.handlers.JacksonTypeHandler;
import ink.whi.backend.common.enums.MsgRoleEnum;
import lombok.Data;
import lombok.EqualsAndHashCode;

import java.util.List;

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

    private MsgRoleEnum role;

    private Integer modelId;

    public String content;

    /**
     * token数量
     */
    private Integer tokens;

    @TableField(typeHandler = JacksonTypeHandler.class)
    private List<String> tools;

    /**
     * 附件
     */
    private String attachments;
}
