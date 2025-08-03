package ink.whi.backend.dao.entity;

import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * 通用文件实体
 * @author: qing
 * @Date: 2025/7/26
 */
@Data
@EqualsAndHashCode(callSuper = true)
@TableName("base_file")
public class BaseFile extends BaseEntity {

    private Integer userId;

    private String uuid;

    private String fileName;

    private Long fileSize;

    private String path;

    private String ext;
}
