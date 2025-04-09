package ink.whi.backend.service;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import ink.whi.chatboxbackend.common.converter.UserConverter;
import ink.whi.chatboxbackend.common.dto.user.BaseUserInfoDTO;
import ink.whi.chatboxbackend.common.dto.user.UserSaveReq;
import ink.whi.chatboxbackend.common.exception.BusinessException;
import ink.whi.chatboxbackend.common.exception.StatusEnum;
import ink.whi.chatboxbackend.dao.entity.UserDO;
import ink.whi.chatboxbackend.dao.mapper.UserMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

/**
 * @author: qing
 * @Date: 2023/4/26
 */
@Service
@RequiredArgsConstructor
public class UserService extends ServiceImpl<UserMapper, UserDO> {

    private final UserMapper userMapper;

    public BaseUserInfoDTO passwordLogin(String username, String password) {
        UserDO user = getUserByName(username);
        if (user == null) {
            throw BusinessException.newInstance(StatusEnum.USER_NOT_EXISTS, username);
        }

        // 密码加密
        if (!UserPwdEncoder.match(password, user.getPassword())) {
            throw BusinessException.newInstance(StatusEnum.USER_PWD_ERROR);
        }

        return queryBasicUserInfo(user.getId());
    }

    public BaseUserInfoDTO queryBasicUserInfo(Integer userId) {
        UserDO user = getById(userId);
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
    public Integer saveUser(UserSaveReq req) {
        UserDO user = UserConverter.toDO(req);
        UserDO record = getUserByName(user.getUsername());
        if (record != null) {
            throw BusinessException.newInstance(StatusEnum.ILLEGAL_ARGUMENTS_MIXED, "用户已存在");
        }
        user.setPassword(UserPwdEncoder.encoder(user.getPassword()));
        save(user);
        return user.getId();
    }

    private UserDO getUserByName(String username) {
        LambdaQueryWrapper<UserDO> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(UserDO::getUsername, username);
        return userMapper.selectOne(wrapper);
    }
}
