package ink.whi.chatboxbackend.common.converter;

import ink.whi.chatboxbackend.common.dto.user.BaseUserInfoDTO;
import ink.whi.chatboxbackend.common.dto.user.UserSaveReq;
import ink.whi.chatboxbackend.dao.entity.UserDO;

/**
 * User converter to transform between different user related objects
 * @author: qing
 * @Date: 2025/3/21
 */
public class UserConverter {

    /**
     * Convert UserDO to BaseUserInfoDTO
     * @param userDO User database object
     * @return BaseUserInfoDTO
     */
    public static BaseUserInfoDTO toDTO(UserDO userDO) {
        if (userDO == null) {
            return null;
        }
        
        BaseUserInfoDTO dto = new BaseUserInfoDTO();
        // Convert Integer to Long for userId
        dto.setUserId(userDO.getId());
        dto.setUserName(userDO.getUsername());
        return dto;
    }
    
    /**
     * Convert UserSaveReq to UserDO
     * @param req User save/update request
     * @return UserDO
     */
    public static UserDO toDO(UserSaveReq req) {
        if (req == null) {
            return null;
        }
        
        UserDO userDO = new UserDO();
        userDO.setUsername(req.getUsername());
        userDO.setPassword(req.getPassword());
        
        // Set ID only if it exists in the request
        if (req.getUserId() != null) {
            userDO.setId(req.getUserId().intValue());
        }
        
        return userDO;
    }
    
    /**
     * Update existing UserDO with UserSaveReq data
     * @param userDO Existing user DO to update
     * @param req Request containing update information
     */
    public static void updateDO(UserDO userDO, UserSaveReq req) {
        if (userDO == null || req == null) {
            return;
        }
        
        if (req.getUsername() != null) {
            userDO.setUsername(req.getUsername());
        }
        
        if (req.getPassword() != null) {
            userDO.setPassword(req.getPassword());
        }
    }
}
