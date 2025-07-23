package ink.whi.backend.common.converter;

import ink.whi.backend.common.dto.model.ModelDTO;
import ink.whi.backend.common.dto.model.SimpleModelDTO;
import ink.whi.backend.dao.entity.Model;

import java.util.List;
import java.util.stream.Collectors;

/**
 * @author: qing
 * @Date: 2025/7/19
 */
public class ModelConverter {
    public static ModelDTO toModelDTO(Model model) {
        if (model == null) {
            return null;
        }

        ModelDTO dto = new ModelDTO();
        dto.setId(model.getId());
        dto.setName(model.getName());
        dto.setType(model.getType());
        dto.setPlatformId(model.getPlatformId());
        dto.setCreateTime(model.getCreateTime());
        dto.setUpdateTime(model.getUpdateTime());
        return dto;
    }

    public static SimpleModelDTO toSimpleDTO(Model model) {
        if (model == null) {
            return null;
        }

        SimpleModelDTO dto = new SimpleModelDTO();
        dto.setId(model.getId());
        dto.setName(model.getName());
        return dto;
    }

    public static List<SimpleModelDTO> toSimpleDTOs(List<Model> models) {
        return models.stream().map(ModelConverter::toSimpleDTO).toList();
    }
}
