package ink.whi.backend.service.model;

import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import dev.langchain4j.model.chat.StreamingChatLanguageModel;
import dev.langchain4j.model.openai.OpenAiStreamingChatModel;
import ink.whi.backend.common.context.ReqInfoContext;
import ink.whi.backend.common.dto.chat.ModelParams;
import ink.whi.backend.common.dto.model.ModelUpdateReq;
import ink.whi.backend.common.dto.model.ModelCreReq;
import ink.whi.backend.common.enums.ModelTypeEnum;
import ink.whi.backend.common.enums.PlatformTypeEnum;
import ink.whi.backend.common.exception.BusinessException;
import ink.whi.backend.common.status.StatusEnum;
import ink.whi.backend.dao.entity.Model;
import ink.whi.backend.dao.entity.BaseEntity;
import ink.whi.backend.dao.entity.Platform;
import ink.whi.backend.dao.mapper.ModelMapper;
import jakarta.annotation.Resource;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.BeanUtils;
import org.springframework.context.annotation.Lazy;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Objects;

/**
 * AI模型服务实现
 *
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
        if (getByName(req.getName(), req.getPlatformId()) != null) {
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
        model.setUserId(ReqInfoContext.getUserId());

        save(model);
        return model;
    }

    /**
     * 根据平台ID获取模型列表
     *
     * @param platformId 平台ID
     * @return 模型列表
     */
    public List<Model> getModelsByPlatformId(Integer platformId) {
        return lambdaQuery().eq(Model::getPlatformId, platformId)
                .orderByDesc(BaseEntity::getCreateTime)
                .list();
    }

    public List<Model> getModelByType(ModelTypeEnum typeEnum) {
        return lambdaQuery().eq(Model::getType, typeEnum)
                .eq(Model::getUserId, ReqInfoContext.getUserId())
                .orderByDesc(BaseEntity::getCreateTime)
                .list();
    }

    public StreamingChatLanguageModel buildStreamChatLanguagesModel(Integer modelId, ModelParams params) {
        Model model = getById(modelId);
        if (model == null) {
            throw BusinessException.newInstance(StatusEnum.ILLEGAL_ARGUMENTS_MIXED, "模型不存在");
        }
        Platform platform = platformService.getById(model.getPlatformId());
        platformService.checkStatus(platform);

        // TODO 支持其他平台
        if(!platform.getPlatformType().getName().contains("openai")){
            throw BusinessException.newInstance(StatusEnum.ILLEGAL_ARGUMENTS_MIXED, "目前只支持OpenAI格式");
        }

        var builder = OpenAiStreamingChatModel.builder()
                .apiKey(platform.getApiKey())
                .baseUrl(platform.getBaseUrl())
                .modelName(model.getName());

        if (params != null) {
            // 应用模型配置参数（如果有）
            if (params.getTemperature() != null) {
                builder.temperature(params.getTemperature());
            }

            if (params.getMaxTokens() != null) {
                builder.maxTokens(params.getMaxTokens());
            }
        }
        return builder.build();
    }

    public Model getByName(String name, Integer platformId) {
        return lambdaQuery().eq(Model::getPlatformId, platformId).eq(Model::getName, name).one();
    }

    public void updateModel(ModelUpdateReq req) {
        Model record = getById(req.getModelId());
        if (record == null) {
            throw BusinessException.newInstance(StatusEnum.ILLEGAL_ARGUMENTS_MIXED, "模型不存在");
        }

        if (!Objects.equals(req.getName(), record.getName())) {
            Model recordName = getByName(req.getName(), record.getPlatformId());
            if (recordName != null) {
                throw BusinessException.newInstance(StatusEnum.ILLEGAL_ARGUMENTS_MIXED, "模型名称已存在");
            }
        }

        BeanUtils.copyProperties(req, record);
        record.setType(ModelTypeEnum.of(req.getType()));
        updateById(record);
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