package ink.whi.backend.common.dto.request;

import jakarta.validation.constraints.NotNull;

import java.io.File;

/**
 * @author: qing
 * @Date: 2025/3/30
 */
public class FileChatRequest extends BaseModelRequest{

    @NotNull
    public File file;
}
