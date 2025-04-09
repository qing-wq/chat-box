package ink.whi.backend.common.converter;

import ink.whi.backend.common.dto.message.MessageDTO;
import ink.whi.backend.common.dto.message.MessageDTO;
import ink.whi.backend.common.enums.RoleEnum;
import ink.whi.backend.dao.entity.MessageDO;
import org.springframework.beans.BeanUtils;

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
    public static MessageDTO toDTO(MessageDO messageDO) {
        if (messageDO == null) {
            return null;
        }
        MessageDTO messageDTO = new MessageDTO();
        messageDTO.setId(messageDO.getId());
        messageDTO.setRole(RoleEnum.getRoleByType(messageDO.getRole()).getRole());
        messageDTO.setChatId(messageDO.getChatId());
        messageDTO.setContent(messageDO.getContent());
        messageDTO.setCreateTime(messageDO.getCreateTime());
        messageDTO.setUpdateTime(messageDO.getUpdateTime());
        return messageDTO;
    }

    /**
     * MessageDTO 转 MessageDO
     *
     * @param MessageDTO 消息DTO对象
     * @return 消息DO对象
     */
    public static MessageDO toDO(MessageDTO MessageDTO) {
        if (MessageDTO == null) {
            return null;
        }
        MessageDO messageDO = new MessageDO();
        messageDO.setContent(MessageDTO.getContent());
        messageDO.setChatId(MessageDTO.getChatId());
        RoleEnum role = RoleEnum.getRoleByName(MessageDTO.getRole());
        if (role == null) {
            throw new IllegalArgumentException("Invalid role: " + MessageDTO.getRole());
        }
        messageDO.setRole(role.getId());
        return messageDO;
    }

    /**
     * 批量转换MessageDO列表为MessageDTO列表
     *
     * @param messageDOList 消息DO对象列表
     * @return 消息DTO对象列表
     */
    public static List<MessageDTO> toDTOList(List<MessageDO> messageDOList) {
        if (messageDOList == null || messageDOList.isEmpty()) {
            return Collections.emptyList();
        }
        List<MessageDTO> dtoList = new ArrayList<>(messageDOList.size());
        for (MessageDO messageDO : messageDOList) {
            MessageDTO dto = toDTO(messageDO);
            if (Objects.nonNull(dto)) {
                dtoList.add(dto);
            }
        }
        return dtoList;
    }

}
