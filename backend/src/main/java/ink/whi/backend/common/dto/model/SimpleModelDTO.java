package ink.whi.backend.common.dto.model;

import lombok.Data;

import java.io.Serializable;

/**
 * @author: qing
 * @Date: 2025/7/20
 */
@Data
public class SimpleModelDTO implements Serializable {

    private Integer id;

    private String name;
}
