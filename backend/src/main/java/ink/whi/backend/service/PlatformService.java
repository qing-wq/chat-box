package ink.whi.backend.service;

import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import ink.whi.backend.common.context.ReqInfoContext;
import ink.whi.backend.common.dto.platform.PlatformCreateReq;
import ink.whi.backend.common.dto.platform.PlatformUpdateReq;
import ink.whi.backend.common.enums.PlatformTypeEnum;
import ink.whi.backend.common.exception.BusinessException;
import ink.whi.backend.common.status.StatusEnum;
import ink.whi.backend.dao.entity.Platform;
import ink.whi.backend.dao.mapper.PlatformMapper;
import jakarta.annotation.Resource;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/**
 * 平台服务实现
 * @author: qing
 * @Date: 2025/1/14
 */
@Service
public class PlatformService extends ServiceImpl<PlatformMapper, Platform> {

    @Resource
    private ModelService modelService;

    /**
     * 创建平台
     * @param req 创建请求
     * @return 平台ID
     */
    public Integer createPlatform(PlatformCreateReq req) {
        // 验证平台名称是否已存在
        if (getPlatformByName(req.getName()) != null) {
            throw new BusinessException(StatusEnum.PLATFORM_NAME_EXIST);
        }

        Platform platform = new Platform();
        platform.setName(req.getName());

        // 默认OPENAI
        PlatformTypeEnum type = PlatformTypeEnum.formName(req.getType());
        if (type == null) {
            throw BusinessException.newInstance(StatusEnum.ILLEGAL_ARGUMENTS_MIXED, "platformType非法");
        }
        platform.setPlatformType(type);
        platform.setApiKey(req.getApiKey());
        platform.setBaseUrl(req.getBaseUrl());
        platform.setUserId(ReqInfoContext.getUserId());

        save(platform);
        return platform.getId();
    }

    /**
     * 获取所有平台列表
     * @return 平台列表
     */
    public List<Platform> getAllPlatforms() {
        return lambdaQuery().eq(Platform::getUserId, ReqInfoContext.getUserId()).list();
    }



    /**
     * 根据ID获取平台详情
     * @param platformId 平台ID
     * @return 平台详情
     */
    public Platform getOrThrow(Integer platformId) {
        if (platformId == null) {
            throw BusinessException.newInstance(StatusEnum.ILLEGAL_ARGUMENTS_MIXED, "platform_id不能为空");
        }

        Platform platform = getById(platformId);
        checkStatus(platform);
        return platform;
    }

    public Platform getPlatformByName(String name) {
        return lambdaQuery().eq(Platform::getName, name)
                .eq(Platform::getUserId, ReqInfoContext.getUserId())
                .one();
    }

    /**
     * 更新平台信息
     * @param req 更新请求
     * @return 是否成功
     */
    public void updatePlatform(PlatformUpdateReq req) {
        Platform platform = getById(req.getId());
        checkStatus(platform);
        
        if (StringUtils.isNotBlank(req.getApiKey())) {
            platform.setApiKey(req.getApiKey());
        }
        if (StringUtils.isNotBlank(req.getBaseUrl())) {
            platform.setBaseUrl(req.getBaseUrl());
        }

        updateById(platform);
    }

    /**
     * 删除平台
     * @param platformId 平台ID
     * @return
     */
    @Transactional(rollbackFor = Exception.class)
    public void deletePlatform(Integer platformId) {
        Platform platform = getById(platformId);
        checkStatus(platform);
        removeById(platformId);

        // 删除相关模型
        modelService.deleteAll(platformId);
    }



    public void checkStatus(Platform platform) {
        if (platform == null) {
            throw BusinessException.newInstance(StatusEnum.ILLEGAL_ARGUMENTS_MIXED, "platform不存在");
        }

        if (!platform.getUserId().equals(ReqInfoContext.getUserId())) {
            throw BusinessException.newInstance(StatusEnum.FORBID_ERROR);
        }
    }
}