package ink.whi.backend.dao.converter;

import ink.whi.backend.common.dto.knowledgeBase.KbItemDto;
import ink.whi.backend.dao.entity.KnowledgeBaseItem;

/**
 * 知识库条目转换器
 *
 * @author: qing
 * @Date: 2025/8/3
 */
public class KnowledgeBaseItemConverter {

    /**
     * 将KnowledgeBaseItem实体转换为KbItemDto
     *
     * @param item 知识库条目实体
     * @return KbItemDto
     */
    public static KbItemDto toDto(KnowledgeBaseItem item) {
        if (item == null) {
            return null;
        }

        KbItemDto dto = new KbItemDto();
        
        dto.setId(item.getId());
        dto.setCreateTime(item.getCreateTime());
        dto.setUpdateTime(item.getUpdateTime());
        
        dto.setTitle(item.getTitle());
        dto.setProcessType(item.getProcessType() != null ? item.getProcessType().getDesc() : null);
        dto.setEmbeddingStatus(item.getEmbeddingStatus() != null ? item.getEmbeddingStatus().getDesc() : null);
        dto.setIsEnable(item.getIsEnable());
        
        return dto;
    }
}