package ink.whi.backend.service.impl;

import com.google.common.hash.Hashing;
import com.google.common.io.Files;
import ink.whi.backend.common.context.ReqInfoContext;
import ink.whi.backend.common.utils.FileUtil;
import ink.whi.backend.dao.entity.BaseFile;
import ink.whi.backend.dao.mapper.FileMapper;
import ink.whi.backend.service.FileService;
import org.apache.commons.lang3.tuple.Pair;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.util.UUID;

/**
 * @author: qing
 * @Date: 2025/7/26
 */
@Service
public class FileServiceImpl implements FileService {

    @Value("${file.upload-dir}")
    private String uploadDir;

    @Autowired
    private FileMapper fileMapper;

    @Override
    public BaseFile upload(MultipartFile file) {
        String uuid = UUID.randomUUID().toString();
        FileUtil.FileInfo fileInfo = FileUtil.saveToLocal(file, uploadDir, uuid);

        BaseFile baseFile = new BaseFile();
        baseFile.setUuid(uuid);
        baseFile.setFileName(fileInfo.getFileName());
        baseFile.setFileSize(file.getSize());
        baseFile.setPath(fileInfo.getPath());
        baseFile.setExt(fileInfo.getExt());
        baseFile.setUserId(ReqInfoContext.getUserId());
        fileMapper.insert(baseFile);

        return baseFile;
    }
}
