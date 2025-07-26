package ink.whi.backend.dao.entity;

import com.baomidou.mybatisplus.annotation.TableField;
import com.baomidou.mybatisplus.annotation.TableName;
import com.baomidou.mybatisplus.extension.handlers.JacksonTypeHandler;
import com.fasterxml.jackson.annotation.JsonValue;
import dev.langchain4j.model.output.TokenUsage;
import ink.whi.backend.common.enums.MsgRoleEnum;
import lombok.Data;
import lombok.EqualsAndHashCode;
import org.apache.el.parser.Token;

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
    @TableField(typeHandler = JacksonTypeHandler.class)
    private TokenUsage tokenUsage;

    @TableField(typeHandler = JacksonTypeHandler.class)
    private List<String> tools;

    /**
     * 附件
     */
    private String attachments;
}
