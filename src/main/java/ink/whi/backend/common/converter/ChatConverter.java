package ink.whi.backend.common.converter;

import ink.whi.backend.common.dto.conversation.ConversationDTO;
import ink.whi.backend.dao.entity.ConversationDO;
import org.springframework.beans.BeanUtils;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Objects;

/**
 * 会话对象转换器
 *
 * @author: qing
 * @Date: 2025/3/11
 */
public class ConversationConverter {

    /**
     * ConversationDO 转 ConversationDTO
     *
     * @param conversationDO 会话DO对象
     * @return 会话DTO对象
     */
    public static ConversationDTO toDTO(ConversationDO conversationDO) {
        if (conversationDO == null) {
            return null;
        }
        ConversationDTO conversationDTO = new ConversationDTO();
        conversationDTO.setTitle(conversationDO.getTitle());
        conversationDTO.setId(conversationDO.getId());
        conversationDTO.setCreateTime(conversationDO.getCreateTime());
        conversationDTO.setUpdateTime(conversationDO.getUpdateTime());
        return conversationDTO;
    }

    /**
     * ConversationDTO 转 ConversationDO
     *
     * @param conversationDTO 会话DTO对象
     * @return 会话DO对象
     */
    public static ConversationDO toDO(ConversationDTO conversationDTO) {
        if (conversationDTO == null) {
            return null;
        }
        ConversationDO conversationDO = new ConversationDO();
        BeanUtils.copyProperties(conversationDTO, conversationDO);
        return conversationDO;
    }

    /**
     * 批量转换ConversationDO列表为ConversationDTO列表
     *
     * @param conversationDOList 会话DO对象列表
     * @return 会话DTO对象列表
     */
    public static List<ConversationDTO> toDTOList(List<ConversationDO> conversationDOList) {
        if (conversationDOList == null || conversationDOList.isEmpty()) {
            return Collections.emptyList();
        }
        List<ConversationDTO> dtoList = new ArrayList<>(conversationDOList.size());
        for (ConversationDO conversationDO : conversationDOList) {
            ConversationDTO dto = toDTO(conversationDO);
            if (Objects.nonNull(dto)) {
                dtoList.add(dto);
            }
        }
        return dtoList;
    }

    /**
     * 批量转换ConversationDTO列表为ConversationDO列表
     *
     * @param conversationDTOList 会话DTO对象列表
     * @return 会话DO对象列表
     */
    public static List<ConversationDO> toDOList(List<ConversationDTO> conversationDTOList) {
        if (conversationDTOList == null || conversationDTOList.isEmpty()) {
            return Collections.emptyList();
        }
        List<ConversationDO> doList = new ArrayList<>(conversationDTOList.size());
        for (ConversationDTO conversationDTO : conversationDTOList) {
            ConversationDO doObj = toDO(conversationDTO);
            if (Objects.nonNull(doObj)) {
                doList.add(doObj);
            }
        }
        return doList;
    }
}
