package ink.whi.backend.common.enums;

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

    private String type;

    ModelTypeEnum( String type) {
        this.type = type;
    }
}
