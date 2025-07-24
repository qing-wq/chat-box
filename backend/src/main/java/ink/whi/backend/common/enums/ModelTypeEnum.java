package ink.whi.backend.common.enums;

import com.baomidou.mybatisplus.annotation.EnumValue;
import lombok.Getter;

/**
 * @author: qing
 * @Date: 2025/6/27
 */
@Getter
public enum ModelTypeEnum {
    //text,image,embedding,rerank
    TEXT( "text"),
    IMAGE("image"),
    EMBEDDING("embedding"),
    RERANK("rerank");

    @EnumValue
    private final String type;

    ModelTypeEnum( String type) {
        this.type = type;
    }

    public static ModelTypeEnum of(String type) {
        for (ModelTypeEnum typeEnum : ModelTypeEnum.values()) {
            if (typeEnum.getType().equals(type)) {
                return typeEnum;
            }
        }

        return null;
    }
}
