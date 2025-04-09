package ink.whi.chatboxbackend.common.converter;

import ink.whi.chatboxbackend.common.dto.message.MessageDTO;
import ink.whi.chatboxbackend.common.dto.message.MessageVO;
import ink.whi.chatboxbackend.dao.entity.MessageDO;
import ink.whi.chatboxbackend.common.enums.RoleEnum;
import org.springframework.beans.BeanUtils;

import java.util.ArrayList;
import java.util.Collections;
import java.util.Date;
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
        BeanUtils.copyProperties(messageDO, messageDTO);
        return messageDTO;
    }

    /**
     * MessageDTO 转 MessageDO
     *
     * @param messageDTO 消息DTO对象
     * @return 消息DO对象
     */
    public static MessageDO toDO(MessageDTO messageDTO) {
        if (messageDTO == null) {
            return null;
        }
        MessageDO messageDO = new MessageDO();
        BeanUtils.copyProperties(messageDTO, messageDO);
        return messageDO;
    }

    /**
     * MessageDO 转 MessageVO
     *
     * @param messageDO 消息DO对象
     * @return 消息VO对象
     */
    public static MessageVO toVO(MessageDO messageDO) {
        if (messageDO == null) {
            return null;
        }
        MessageVO messageVO = new MessageVO();
        messageVO.setId(messageDO.getId());
        messageVO.setContent(messageDO.getContent());
        messageVO.setRole(RoleEnum.getNameByType(messageDO.getRole()));
        if (messageDO.getCreateTime() != null) {
            messageVO.setCreateTime(messageDO.getCreateTime());
        }
        return messageVO;
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

    /**
     * 批量转换MessageDTO列表为MessageDO列表
     *
     * @param messageDTOList 消息DTO对象列表
     * @return 消息DO对象列表
     */
    public static List<MessageDO> toDOList(List<MessageDTO> messageDTOList) {
        if (messageDTOList == null || messageDTOList.isEmpty()) {
            return Collections.emptyList();
        }
        List<MessageDO> doList = new ArrayList<>(messageDTOList.size());
        for (MessageDTO messageDTO : messageDTOList) {
            MessageDO doObj = toDO(messageDTO);
            if (Objects.nonNull(doObj)) {
                doList.add(doObj);
            }
        }
        return doList;
    }

    /**
     * 批量转换MessageDO列表为MessageVO列表
     *
     * @param messageDOList 消息DO对象列表
     * @return 消息VO对象列表
     */
    public static List<MessageVO> toVOList(List<MessageDO> messageDOList) {
        if (messageDOList == null || messageDOList.isEmpty()) {
            return Collections.emptyList();
        }
        List<MessageVO> voList = new ArrayList<>(messageDOList.size());
        for (MessageDO messageDO : messageDOList) {
            MessageVO vo = toVO(messageDO);
            if (Objects.nonNull(vo)) {
                voList.add(vo);
            }
        }
        return voList;
    }
}
