package ink.whi.chatboxbackend.dao.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;

import lombok.Data;

import java.io.Serializable;
import java.util.Date;

/**
 * @author: qing
 * @Date: 2025/3/2
 */
@Data
public class BaseDO implements Serializable {
    @TableId(type = IdType.AUTO)
    private Integer id;

    private Date createTime;
    private Date updateTime;
}
