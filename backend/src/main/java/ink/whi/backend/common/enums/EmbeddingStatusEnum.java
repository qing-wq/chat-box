package ink.whi.backend.common.enums;

import com.baomidou.mybatisplus.annotation.EnumValue;
import lombok.Getter;

/**
 * @author: qing
 * @Date: 2025/7/26
 */
@Getter
public enum EmbeddingStatusEnum {
    PENDING(0, "待处理"),
    SPLITTING(1, "切分中"),
    INDEXED(2, "已索引"),
    FAILED(3, "失败");

    @EnumValue
    private int status;
    private String desc;

    EmbeddingStatusEnum(int status, String desc) {
        this.status = status;
        this.desc = desc;
    }
}
