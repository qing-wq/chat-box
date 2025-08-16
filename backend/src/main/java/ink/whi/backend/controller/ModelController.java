package ink.whi.backend.controller;

import ink.whi.backend.common.dto.model.ModelUpdateReq;
import ink.whi.backend.dao.converter.ModelConverter;
import ink.whi.backend.common.dto.ResVo;
import ink.whi.backend.common.dto.model.ModelCreReq;
import ink.whi.backend.common.dto.model.SimpleModelDTO;
import ink.whi.backend.common.enums.ModelTypeEnum;
import ink.whi.backend.common.status.StatusEnum;
import ink.whi.backend.dao.entity.Model;
import ink.whi.backend.service.conv.MessageService;
import ink.whi.backend.service.model.ModelService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * 模型管理接口
 * @author: qing
 * @Date: 2025/7/8
 */
@RestController
@RequestMapping("api/model")
public class ModelController {

    @Autowired
    private ModelService modelService;

    @Autowired
    private MessageService messageService;

    /**
     * 创建AI模型
     * @param req 创建请求
     * @return 创建的模型ID
     */
    @PostMapping("/create")
    public ResVo<Model> createModel(@RequestBody ModelCreReq req) {
        Model model = modelService.createModel(req);
        return ResVo.ok(model);
    }

    /**
     * 根据模型ID获取模型详情
     * @param modelId 模型ID
     * @return 模型详情
     */
    @GetMapping("/detail/{modelId}")
    public ResVo<Model> getModelById(@PathVariable Integer modelId) {
        Model model = modelService.getById(modelId);
        return ResVo.ok(model);
    }

    /**
     * 更新模型信息
     * @param req 模型信息
     * @return 是否成功
     */
    @PostMapping("/update")
    public ResVo<String> updateModel(@RequestBody ModelUpdateReq req) {
        modelService.updateModel(req);
        return ResVo.ok("ok");
    }

    /**
     * 删除模型
     * @param modelId 模型ID
     * @return 是否成功
     */
    @GetMapping("/delete/{modelId}")
    public ResVo<String> deleteModel(@PathVariable Integer modelId) {
        modelService.deleteModel(modelId);
        return ResVo.ok("ok");
    }

    /**
     * 模型选择接口
     * @return 模型列表
     */
    @GetMapping("/list/{type}")
    public ResVo<List<SimpleModelDTO>> getModelList(@PathVariable String type) {
        ModelTypeEnum modelTypeEnum = ModelTypeEnum.of(type);
        if (modelTypeEnum == null) {
            return ResVo.fail(StatusEnum.ILLEGAL_ARGUMENTS_MIXED, "type不存在");
        }
        List<Model> list = modelService.getModelByType(modelTypeEnum);
        List<SimpleModelDTO> dtos = ModelConverter.toSimpleDTOs(list);
        return ResVo.ok(dtos);
    }
}
