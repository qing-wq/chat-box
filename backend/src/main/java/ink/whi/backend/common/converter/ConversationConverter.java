package ink.whi.backend.common.converter;

import ink.whi.backend.common.dto.conversation.ConversationDTO;
import ink.whi.backend.common.dto.conversation.ConvUpdateReq;
import ink.whi.backend.common.dto.conversation.ConversationVO;
import ink.whi.backend.common.dto.conversation.SimpleConvDTO;
import ink.whi.backend.dao.entity.Conversation;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.BeanUtils;
import org.springframework.util.CollectionUtils;

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
     * ChatDO 转 ChatDTO
     *
     * @param conversationDO 会话DO对象
     * @return 会话DTO对象
     */
    public static ConversationDTO toDTO(Conversation conversationDO) {
        if (conversationDO == null) {
            return null;
        }

        ConversationDTO dto = new ConversationDTO();
        dto.setId(conversationDO.getId());
        dto.setUuid(conversationDO.getUuid());
        dto.setTitle(conversationDO.getTitle());
        dto.setSystemMessage(StringUtils.isEmpty(conversationDO.getSystemMessage()) ? "" : conversationDO.getSystemMessage());
        dto.setCreateTime(conversationDO.getCreateTime());
        dto.setUpdateTime(conversationDO.getUpdateTime());
        return dto;
    }

    /**
     * ChatDTO 转 ChatDO
     *
     * @param convUpdateReq 会话DTO对象
     * @return 会话DO对象
     */
    public static Conversation toDO(ConvUpdateReq convUpdateReq) {
        if (convUpdateReq == null) {
            return null;
        }
        Conversation conversationDO = new Conversation();
        BeanUtils.copyProperties(convUpdateReq, conversationDO);
        return conversationDO;
    }

    public static SimpleConvDTO toSimpleDTO(Conversation conversation) {
        if (conversation == null) {
            return null;
        }

        SimpleConvDTO sdto = new SimpleConvDTO();
        sdto.setUuid(conversation.getUuid());
        sdto.setTitle(conversation.getTitle());
        sdto.setCreateTime(conversation.getCreateTime());
        sdto.setUpdateTime(conversation.getUpdateTime());
        return sdto;
    }

    /**
     * 批量转换ChatDO列表为ChatDTO列表
     *
     * @param list 会话DO对象列表
     * @return 会话DTO对象列表
     */
    public static List<ConversationDTO> toDTOList(List<Conversation> list) {
        if (CollectionUtils.isEmpty(list)) {
            return Collections.emptyList();
        }

        List<ConversationDTO> dtoList = new ArrayList<>(list.size());
        for (Conversation conversationDO : list) {
            ConversationDTO dto = toDTO(conversationDO);
            if (Objects.nonNull(dto)) {
                dtoList.add(dto);
            }
        }
        return dtoList;
    }

    /**
     * 批量转换ChatDTO列表为ChatDO列表
     *
     * @param list 会话DTO对象列表
     * @return 会话DO对象列表
     */
    public static List<Conversation> toDOList(List<ConvUpdateReq> list) {
        if (CollectionUtils.isEmpty(list)) {
            return Collections.emptyList();
        }
        List<Conversation> doList = new ArrayList<>(list.size());
        for (ConvUpdateReq convUpdateReq : list) {
            Conversation doObj = toDO(convUpdateReq);
            if (Objects.nonNull(doObj)) {
                doList.add(doObj);
            }
        }
        return doList;
    }

    public static List<SimpleConvDTO> toSimpleDTO(List<Conversation> list) {
        if (CollectionUtils.isEmpty(list)) {
            return Collections.emptyList();
        }

        List<SimpleConvDTO> sdtoList = new ArrayList<>(list.size());
        for (Conversation conversationDO : list) {
            SimpleConvDTO dto = toSimpleDTO(conversationDO);
            if (Objects.nonNull(dto)) {
                sdtoList.add(dto);
            }
        }
        return sdtoList;
    }
}
