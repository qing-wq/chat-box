package ink.whi.backend.common.dto.file;

import ink.whi.backend.common.dto.BaseDTO;
import lombok.Data;

/**
 * @author: qing
 * @Date: 2025/7/31
 */
@Data
public class FileDTO extends BaseDTO {
    private String fileName;
    private Integer fileSize;
    private Integer token_usage;
}
