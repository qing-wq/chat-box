package ink.whi.backend.common.enums;

import lombok.Getter;

/**
 * @author: qing
 * @Date: 2025/6/23
 */
@Getter
public enum PlatformEnum {
    OPENAI(0, "openai"),
    ANTHROPIC(1, "anthropic"),
    GEMINI(2, "gemini"),
    AZURE_OPENAI(3, "azure_openai"),
    DEEPSEEK(4, "deepseek"),
    DOUBAO(5, "doubao"),
    QIANWEN(6, "qianwen");

    public int type;
    public String name;

    PlatformEnum(int type, String name) {
        this.type = type;
        this.name = name;
    }
}
