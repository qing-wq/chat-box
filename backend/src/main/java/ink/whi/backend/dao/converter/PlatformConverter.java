package ink.whi.backend.dao.converter;

import ink.whi.backend.common.dto.platform.PlatformCreateReq;
import ink.whi.backend.common.dto.platform.PlatformDetailDTO;
import ink.whi.backend.common.enums.PlatformTypeEnum;
import ink.whi.backend.dao.entity.Platform;

import java.util.Optional;

/**
 * @author: qing
 * @Date: 2025/7/19
 */
public class PlatformConverter {

    public static PlatformDetailDTO toPlatformDetailDTO(Platform platform) {
        if (platform == null) {
            return null;
        }
        PlatformDetailDTO dto = new PlatformDetailDTO();
        dto.setId(platform.getId());
        dto.setName(platform.getName());
        dto.setPlatformType(platform.getPlatformType().getName());
        dto.setEnable(platform.getEnable());
        dto.setApiKey(platform.getApiKey());
        dto.setBaseUrl(platform.getBaseUrl());
        dto.setCreateTime(platform.getCreateTime());
        dto.setUpdateTime(platform.getUpdateTime());
        return dto;
    }
}
