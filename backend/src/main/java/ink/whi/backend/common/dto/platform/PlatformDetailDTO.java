package ink.whi.backend.common.dto.platform;

import ink.whi.backend.common.dto.BaseDTO;
import ink.whi.backend.dao.entity.Model;
import lombok.Data;
import lombok.EqualsAndHashCode;

import java.util.List;

/**
 * @author: qing
 * @Date: 2025/7/19
 */
@Data
@EqualsAndHashCode(callSuper = true)
public class PlatformDetailDTO extends BaseDTO {

    private Integer userId;

    private String name;

    private String platformType;

    private String apiKey;

    private String baseUrl;

    private Boolean enable;

    private List<Model> modelList;
}
