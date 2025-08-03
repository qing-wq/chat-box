package ink.whi.backend.common.utils;

import ink.whi.backend.common.exception.BusinessException;
import ink.whi.backend.common.status.StatusEnum;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import org.apache.commons.lang3.tuple.ImmutablePair;
import org.apache.commons.lang3.tuple.Pair;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;

/**
 * @author: qing
 * @Date: 2025/8/2
 */
public class FileUtil {

    @Data
    @AllArgsConstructor
    public static class FileInfo {
        String fileName;
        String path;
        String ext;
    }

    public static FileInfo saveToLocal(MultipartFile file, String path, String newName) {
        if (file.isEmpty()) {
            throw BusinessException.newInstance(StatusEnum.ILLEGAL_ARGUMENTS_MIXED, "文件不能为空");
        }

        String originalFilename = file.getOriginalFilename();
        if (!StringUtils.hasLength(originalFilename)) {
            throw BusinessException.newInstance(StatusEnum.ILLEGAL_ARGUMENTS_MIXED, "文件名为空");
        }

        File parentDir = new File(path);
        if (!parentDir.exists()) {
            boolean created = parentDir.mkdirs();
            if (!created) {
                throw BusinessException.newInstance(StatusEnum.UNEXPECT_ERROR, "无法创建目录: " + parentDir.getAbsolutePath());
            }
        }

        String extension = StringUtils.getFilenameExtension(originalFilename);
        String fullPath = path + newName + "." + extension;
        System.out.println(fullPath);
        try {
            file.transferTo(new File(fullPath));
        } catch (IOException e) {
            throw BusinessException.newInstance(StatusEnum.UNEXPECT_ERROR, e.getMessage());
        }
        return new FileInfo(originalFilename, fullPath, extension);
    }
}
