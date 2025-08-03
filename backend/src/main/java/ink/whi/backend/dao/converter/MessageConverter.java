package ink.whi.backend.dao.converter;

import ink.whi.backend.common.dto.message.MessageDTO;
import ink.whi.backend.common.enums.MsgRoleEnum;
import ink.whi.backend.dao.entity.Message;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Objects;

/**
 * 消息对象转换器
 *
 * @author: qing
 * @Date: 2025/3/14
 */
public class MessageConverter {

    /**
     * MessageDO 转 MessageDTO
     *
     * @param messageDO 消息DO对象
     * @return 消息DTO对象
     */
    public static MessageDTO toDTO(Message messageDO) {
        if (messageDO == null) {
            return null;
        }
        MessageDTO dto = new MessageDTO();
        dto.setId(messageDO.getId());
        dto.setRole(messageDO.getRole().getRole());
        dto.setConversationUuid(messageDO.getConversationUuid());
        dto.setContent(messageDO.getContent());
        dto.setCreateTime(messageDO.getCreateTime());
        dto.setUpdateTime(messageDO.getUpdateTime());
        dto.setTokens(messageDO.getTokens());
        return dto;
    }

    /**
     * MessageDTO 转 MessageDO
     *
     * @param dto 消息DTO对象
     * @return 消息DO对象
     */
    public static Message toDO(MessageDTO dto) {
        if (dto == null) {
            return null;
        }
        Message message = new Message();
        message.setContent(dto.getContent());
        message.setConversationUuid(dto.getConversationUuid());
        MsgRoleEnum role = MsgRoleEnum.formRole(dto.getRole());
        if (role == null) {
            throw new IllegalArgumentException("Invalid role: " + dto.getRole());
        }
        message.setRole(MsgRoleEnum.formRole(dto.getRole()));
        return message;
    }

    /**
     * 批量转换MessageDO列表为MessageDTO列表
     *
     * @param list 消息DO对象列表
     * @return 消息DTO对象列表
     */
    public static List<MessageDTO> toDTOList(List<Message> list) {
        if (list == null || list.isEmpty()) {
            return Collections.emptyList();
        }

        List<MessageDTO> dtoList = new ArrayList<>(list.size());
        for (Message messageDO : list) {
            MessageDTO dto = toDTO(messageDO);
            if (Objects.nonNull(dto)) {
                dtoList.add(dto);
            }
        }
        return dtoList;
    }

}