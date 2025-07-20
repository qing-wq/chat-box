package ink.whi.backend.service;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import ink.whi.backend.common.dto.agent.ModelConfig;
import ink.whi.backend.common.dto.model.ModelCreReq;
import ink.whi.backend.common.exception.BusinessException;
import ink.whi.backend.common.status.StatusEnum;
import ink.whi.backend.dao.entity.Model;
import ink.whi.backend.dao.entity.BaseEntity;
import ink.whi.backend.dao.entity.Platform;
import ink.whi.backend.dao.mapper.ModelMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Date;
import java.util.List;

/**
 * AI模型服务实现
 * @author: qing
 * @Date: 2025/7/8
 */
@Service
@RequiredArgsConstructor
public class ModelService extends ServiceImpl<ModelMapper, Model> {

    private final ModelMapper modelMapper;

    public Model createModel(ModelCreReq req) {
        // 检查模型名称是否已存在
        if (getByName(req.getName()) != null) {
            throw BusinessException.newInstance(StatusEnum.ILLEGAL_ARGUMENTS_MIXED, "该平台下模型名称已存在");
        }

        Model model = new Model();
        model.setName(req.getName());
        model.setPlatformId(req.getPlatformId());

        save(model);
        return model;
    }

    public List<Model> getUserModelList(Integer userId) {
        QueryWrapper<Model> queryWrapper = new QueryWrapper<>();
        queryWrapper.eq("is_enable", true);
        queryWrapper.orderByDesc("create_time");
        return modelMapper.selectList(queryWrapper);
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

    public Model getByName(String name) {
        return lambdaQuery().eq(Model::getName, name).one();
    }

    public void updateModel(Model model) {
        model.setUpdateTime(new Date());
        modelMapper.updateById(model);
    }

    public void deleteModel(Integer modelId) {
        modelMapper.deleteById(modelId);
    }

    @Transactional
    public void deleteAll(Integer platformId) {
        List<Model> models = getModelsByPlatformId(platformId);
        removeBatchByIds(models.stream().map(Model::getId).toList());
    }
}