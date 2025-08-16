package ink.whi.backend.common.enums;

import com.baomidou.mybatisplus.annotation.EnumValue;
import com.fasterxml.jackson.annotation.JsonValue;
import ink.whi.backend.dao.entity.Platform;
import lombok.Getter;

import java.util.Objects;
import java.util.Optional;

/**
 * @author: qing
 * @Date: 2025/6/23
 */
@Getter
public enum PlatformTypeEnum {
    OPENAI(0, "openai"),
    OPENAI_RESPONSE(1, "openai-response"),
    GEMINI(2, "gemini"),
    ANTHROPIC(3, "anthropic"),
    AZURE_OPENAI(4, "azure_openai");

    @EnumValue
    public int type;

    @JsonValue
    public String name;

    PlatformTypeEnum(int type, String name) {
        this.type = type;
        this.name = name;
    }

    public static Optional<PlatformTypeEnum> formType(Integer type) {
        for (PlatformTypeEnum platformTypeEnum : PlatformTypeEnum.values()) {
            if (platformTypeEnum.type == type) {
                return Optional.of(platformTypeEnum);
            }
        }

        return Optional.empty();
    }

    public static PlatformTypeEnum formName(String name) {
        for (PlatformTypeEnum typeEnum : PlatformTypeEnum.values()) {
            if (Objects.equals(typeEnum.getName(), name)) {
                return typeEnum;
            }
        }
        return null;
    }
}
