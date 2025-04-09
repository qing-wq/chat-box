package ink.whi.backend.service;

import ink.whi.backend.common.dto.user.BaseUserInfoDTO;
import ink.whi.backend.common.dto.user.UserSaveReq;
import ink.whi.backend.dao.entity.UserDO;
import org.apache.catalina.User;

/**
 * @author: qing
 * @Date: 2025/3/30
 */
public interface UserService {
    BaseUserInfoDTO passwordLogin(String username, String password);
    BaseUserInfoDTO queryBasicUserInfo(Integer userId);
    UserDO saveUser(UserSaveReq req);
    UserDO createUser(String username, String password);
}
