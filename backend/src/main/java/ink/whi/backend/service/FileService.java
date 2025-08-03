package ink.whi.backend.service;

import ink.whi.backend.dao.entity.BaseFile;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

/**
 * @author: qing
 * @Date: 2025/7/26
 */
public interface FileService {
    /**
     * 上传文件
     *
     * @param file 文件
     * @return BaseFile
     * @throws IOException IO异常
     */
    BaseFile upload(MultipartFile file) ;
}
