package ink.whi.backend.common.enums;

import lombok.Getter;

/**
 * @author: qing
 * @Date: 2025/7/26
 */
@Getter
public enum FileStatusEnum {
    UPLOADING(0, "上传中"),
    UPLOADED(1, "上传完成"),
    FAILED(2, "上传失败");

    private final int status;
    private final String desc;

    FileStatusEnum(int status, String desc) {
        this.status = status;
        this.desc = desc;
    }
}
