package ink.whi.backend.service;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import ink.whi.backend.dao.converter.UserConverter;
import ink.whi.backend.common.dto.user.BaseUserInfoDTO;
import ink.whi.backend.common.dto.user.UserSaveReq;
import ink.whi.backend.common.exception.BusinessException;
import ink.whi.backend.common.status.StatusEnum;
import ink.whi.backend.dao.entity.User;
import ink.whi.backend.dao.mapper.UserMapper;
import ink.whi.backend.common.utils.UserPwdEncoderUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

/**
 * @author: qing
 * @Date: 2023/4/26
 */
@Service
@RequiredArgsConstructor
public class UserService extends ServiceImpl<UserMapper, User> {

    public BaseUserInfoDTO passwordLogin(String username, String password) {
        User user = getUserByName(username);
        if (user == null) {
            throw BusinessException.newInstance(StatusEnum.USER_NOT_EXISTS, username);
        }

        // 密码加密
        if (!UserPwdEncoderUtil.match(password, user.getPassword())) {
            throw BusinessException.newInstance(StatusEnum.USER_PWD_ERROR);
        }

        return queryBasicUserInfo(user.getId());
    }

    public BaseUserInfoDTO queryBasicUserInfo(Integer userId) {
        User user = getById(userId);
        if (user == null) {
            throw BusinessException.newInstance(StatusEnum.USER_NOT_EXISTS, "userId=" + userId);
        }
        return UserConverter.toDTO(user);
    }

    /**
     * 创建用户
     * @param req
     * @return
     */
    public User saveUser(UserSaveReq req) {
        User user = UserConverter.toDO(req);
        User record = getUserByName(user.getUsername());
        if (record != null) {
            throw BusinessException.newInstance(StatusEnum.ILLEGAL_ARGUMENTS_MIXED, "用户已存在");
        }
        user.setPassword(UserPwdEncoderUtil.encoder(user.getPassword()));
        save(user);
        return user;
    }

    public User createUser(String username, String password) {
        User user = new User();
        user.setUsername(username);
        user.setPassword(UserPwdEncoderUtil.encoder(password));
        save(user);
        return user;
    }

    private User getUserByName(String username) {
        LambdaQueryWrapper<User> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(User::getUsername, username);
        return baseMapper.selectOne(wrapper);
    }
}
