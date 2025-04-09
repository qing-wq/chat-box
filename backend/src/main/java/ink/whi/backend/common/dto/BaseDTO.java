package ink.whi.backend.common.dto;

import lombok.Data;

import java.io.Serializable;
import java.util.Date;

/**
 * @author: qing
 * @Date: 2025/3/30
 */
@Data
public class BaseDTO implements Serializable {

    private Integer id;
    private Date createTime;
    private Date updateTime;
}
