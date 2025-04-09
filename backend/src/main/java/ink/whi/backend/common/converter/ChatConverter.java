package ink.whi.backend.common.converter;

import ink.whi.backend.common.dto.chat.SimpleChatDTO;
import ink.whi.backend.dao.entity.ChatDO;
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
public class ChatConverter {

    /**
     * ChatDO 转 ChatDTO
     *
     * @param chatDO 会话DO对象
     * @return 会话DTO对象
     */
    public static SimpleChatDTO toDTO(ChatDO chatDO) {
        if (chatDO == null) {
            return null;
        }
        SimpleChatDTO simpleChatDTO = new SimpleChatDTO();
        simpleChatDTO.setTitle(chatDO.getTitle());
        simpleChatDTO.setId(chatDO.getId());
        simpleChatDTO.setCreateTime(chatDO.getCreateTime());
        simpleChatDTO.setUpdateTime(chatDO.getUpdateTime());
        return simpleChatDTO;
    }

    /**
     * ChatDTO 转 ChatDO
     *
     * @param simpleChatDTO 会话DTO对象
     * @return 会话DO对象
     */
    public static ChatDO toDO(SimpleChatDTO simpleChatDTO) {
        if (simpleChatDTO == null) {
            return null;
        }
        ChatDO chatDO = new ChatDO();
        BeanUtils.copyProperties(simpleChatDTO, chatDO);
        return chatDO;
    }

    /**
     * 批量转换ChatDO列表为ChatDTO列表
     *
     * @param chatDOList 会话DO对象列表
     * @return 会话DTO对象列表
     */
    public static List<SimpleChatDTO> toDTOList(List<ChatDO> chatDOList) {
        if (chatDOList == null || chatDOList.isEmpty()) {
            return Collections.emptyList();
        }
        List<SimpleChatDTO> dtoList = new ArrayList<>(chatDOList.size());
        for (ChatDO chatDO : chatDOList) {
            SimpleChatDTO dto = toDTO(chatDO);
            if (Objects.nonNull(dto)) {
                dtoList.add(dto);
            }
        }
        return dtoList;
    }

    /**
     * 批量转换ChatDTO列表为ChatDO列表
     *
     * @param simpleChatDTOList 会话DTO对象列表
     * @return 会话DO对象列表
     */
    public static List<ChatDO> toDOList(List<SimpleChatDTO> simpleChatDTOList) {
        if (simpleChatDTOList == null || simpleChatDTOList.isEmpty()) {
            return Collections.emptyList();
        }
        List<ChatDO> doList = new ArrayList<>(simpleChatDTOList.size());
        for (SimpleChatDTO simpleChatDTO : simpleChatDTOList) {
            ChatDO doObj = toDO(simpleChatDTO);
            if (Objects.nonNull(doObj)) {
                doList.add(doObj);
            }
        }
        return doList;
    }
}
