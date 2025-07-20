package ink.whi.backend.service;

import com.google.common.collect.Maps;
import ink.whi.backend.common.context.ReqInfoContext;
import ink.whi.backend.common.converter.ModelConverter;
import ink.whi.backend.common.dto.ResVo;
import ink.whi.backend.common.dto.agent.ModelConfig;
import ink.whi.backend.common.dto.model.ModelCreReq;
import ink.whi.backend.common.dto.model.SimpleModelDTO;
import ink.whi.backend.common.exception.BusinessException;
import ink.whi.backend.common.status.StatusEnum;
import ink.whi.backend.dao.entity.Model;
import ink.whi.backend.dao.entity.Platform;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;

/**
 * @author: qing
 * @Date: 2025/7/20
 */
@Service
@RequiredArgsConstructor
public class PMService {
    private final PlatformService platformService;
    private final ModelService modelService;


    public Model createModel(ModelCreReq req) {
        // check
        platformService.getOrThrow(req.getPlatformId());
        return modelService.createModel(req);
    }

    /**
     * 获取可用模型列表（对话模块）
     * @return 模型列表
     */
    public Map<String, List<SimpleModelDTO>> getUserModelList() {
        Map<String, List<SimpleModelDTO>> map = Maps.newHashMap();

        List<Platform> platforms = platformService.getAllPlatforms();
        platforms.forEach(platform -> {
            List<Model> models = modelService.getModelsByPlatformId(platform.getId());
            map.put(platform.getName(), ModelConverter.toSimpleDTOs(models));
        });

        return map;
    }

    public ModelConfig buildModelConfig(Integer modelId) {
        Model model = modelService.getById(modelId);
        Platform platform = platformService.getById(model.getPlatformId());
        platformService.checkStatus(platform);

        return ModelConfig.builder()
                .apiKey(platform.getApiKey())
                .baseUrl(platform.getBaseUrl())
                .modelName(model.getName())
                .build();
    }

    /**
     * 删除平台
     * @param platformId 平台ID
     * @return 是否成功
     */
    public void deletePlatform(Integer platformId) {
        platformService.deletePlatform(platformId);

        // 删除相关模型
        modelService.deleteAll(platformId);
    }
}
