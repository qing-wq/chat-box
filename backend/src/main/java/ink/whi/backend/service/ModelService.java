package ink.whi.backend.service;

import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.google.common.collect.Maps;
import ink.whi.backend.common.converter.ModelConverter;
import ink.whi.backend.common.dto.ResVo;
import ink.whi.backend.common.dto.agent.ModelConfig;
import ink.whi.backend.common.dto.model.ModelCreReq;
import ink.whi.backend.common.dto.model.SimpleModelDTO;
import ink.whi.backend.common.enums.ModelTypeEnum;
import ink.whi.backend.common.exception.BusinessException;
import ink.whi.backend.common.status.StatusEnum;
import ink.whi.backend.dao.entity.Message;
import ink.whi.backend.dao.entity.Model;
import ink.whi.backend.dao.entity.BaseEntity;
import ink.whi.backend.dao.entity.Platform;
import ink.whi.backend.dao.mapper.ModelMapper;
import jakarta.annotation.Resource;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Lazy;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Date;
import java.util.List;
import java.util.Map;

/**
 * AI模型服务实现
 * @author: qing
 * @Date: 2025/7/8
 */
@Service
@RequiredArgsConstructor
public class ModelService extends ServiceImpl<ModelMapper, Model> {

    @Lazy
    @Resource
    private PlatformService platformService;

    public Model createModel(ModelCreReq req) {
        // check
        platformService.getOrThrow(req.getPlatformId());
        // 检查模型名称是否已存在
        if (getByName(req.getName()) != null) {
            throw BusinessException.newInstance(StatusEnum.ILLEGAL_ARGUMENTS_MIXED, "该平台下模型名称已存在");
        }

        ModelTypeEnum modelType = ModelTypeEnum.of(req.getModelType());
        if (modelType == null) {
            throw BusinessException.newInstance(StatusEnum.ILLEGAL_ARGUMENTS_MIXED, "modelType非法");
        }

        Model model = new Model();
        model.setName(req.getName());
        model.setPlatformId(req.getPlatformId());
        model.setType(modelType);

        save(model);
        return model;
    }

    /**
     * 获取可用模型列表（对话模块）
     * @return 模型列表
     */
    public Map<String, List<SimpleModelDTO>> getUserModelList() {
        Map<String, List<SimpleModelDTO>> map = Maps.newHashMap();

        List<Platform> platforms = platformService.getAllPlatforms();
        platforms.forEach(platform -> {
            List<Model> models = getModelsByPlatformId(platform.getId());
            if (!models.isEmpty()) {
                map.put(platform.getName(), ModelConverter.toSimpleDTOs(models));
            }
        });

        return map;
    }

    /**
     * 根据平台ID获取模型列表
     * @param platformId 平台ID
     * @return 模型列表
     */
    public List<Model> getModelsByPlatformId(Integer platformId) {
        return lambdaQuery().eq(Model::getPlatformId, platformId)
                .orderByDesc(BaseEntity::getCreateTime)
                .list();
    }

    public ModelConfig buildModelConfig(Integer modelId) {
        Model model = getById(modelId);
        Platform platform = platformService.getById(model.getPlatformId());
        platformService.checkStatus(platform);

        return ModelConfig.builder()
                .apiKey(platform.getApiKey())
                .baseUrl(platform.getBaseUrl())
                .modelName(model.getName())
                .build();
    }

    public Model getByName(String name) {
        return lambdaQuery().eq(Model::getName, name).one();
    }

    public void updateModel(Model model) {
        model.setUpdateTime(new Date());
        updateById(model);
    }

    public void deleteModel(Integer modelId) {
        removeById(modelId);
    }

    @Transactional
    public void deleteAll(Integer platformId) {
        List<Model> models = getModelsByPlatformId(platformId);
        removeBatchByIds(models.stream().map(Model::getId).toList());
    }
}