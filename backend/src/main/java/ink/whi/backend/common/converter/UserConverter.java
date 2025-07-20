package ink.whi.backend.common.converter;

import ink.whi.backend.common.dto.user.BaseUserInfoDTO;
import ink.whi.backend.common.dto.user.UserSaveReq;
import ink.whi.backend.dao.entity.User;

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
    public static BaseUserInfoDTO toDTO(User userDO) {
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
    public static User toDO(UserSaveReq req) {
        if (req == null) {
            return null;
        }
        
        User userDO = new User();
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
    public static void updateDO(User userDO, UserSaveReq req) {
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
