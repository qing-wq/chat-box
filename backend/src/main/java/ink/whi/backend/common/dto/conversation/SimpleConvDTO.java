package ink.whi.backend.common.dto.conversation;

import lombok.Data;

import java.io.Serializable;
import java.util.Date;

/**
 * @author: qing
 * @Date: 2025/7/15
 */
@Data
public class SimpleConvDTO implements Serializable {

    private String uuid;

    private String title;

    private Date createTime;

    private Date updateTime;
}
