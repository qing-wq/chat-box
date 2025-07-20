package ink.whi.backend.controller;


import ink.whi.backend.common.dto.ResVo;
import ink.whi.backend.common.dto.user.BaseUserInfoDTO;
import ink.whi.backend.common.permission.Permission;
import ink.whi.backend.common.permission.UserRole;
import ink.whi.backend.common.status.StatusEnum;
import ink.whi.backend.common.utils.JwtUtil;
import ink.whi.backend.common.utils.SessionUtil;
import ink.whi.backend.dao.entity.User;
import ink.whi.backend.service.UserService;
import jakarta.servlet.http.HttpServletResponse;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import static ink.whi.backend.global.GlobalInitHelper.SESSION_KEY;


/**
 * 登录接口
 *
 * @author: qing
 * @Date: 2023/4/26
 */
@RestController
@RequestMapping("api")
public class LoginController {

    @Autowired
    private UserService userService;

    /**
     * 账号密码登录
     * application/x-www-form-urlencoded
     * @param username
     * @param password
     * @param response
     * @return
     */
    @PostMapping(path = "login")
    public ResVo<BaseUserInfoDTO> login(@RequestParam("username") String username,
                                        @RequestParam("password") String password,
                                        HttpServletResponse response) {
        if (StringUtils.isBlank(username) || StringUtils.isBlank(password)) {
            return ResVo.fail(StatusEnum.ILLEGAL_ARGUMENTS_MIXED, "用户名或密码不能为空");
        }
        BaseUserInfoDTO info = userService.passwordLogin(username, password);
        // 签发token
        String token = JwtUtil.createToken(info.getUserId());
        if (StringUtils.isNotBlank(token)) {
            response.addCookie(SessionUtil.newCookie(SESSION_KEY, token));
            return ResVo.ok(info);
        } else {
            return ResVo.fail(StatusEnum.LOGIN_FAILED_MIXED, "登录失败，请重试");
        }
    }

    /**
     * 登出接口
     * @param response
     * @return
     */
    @Permission(role = UserRole.LOGIN)
    @GetMapping(path = "logout")
    public ResVo<String> logout(HttpServletResponse response) {
        response.addCookie(SessionUtil.delCookie(SESSION_KEY));
        return ResVo.ok("ok");
    }

    /**
     * 用户注册
     * @param
     * @return
     */
    @PostMapping(path = "register")
    public ResVo<Integer> register(@RequestParam("username") String username,
                                   @RequestParam("password") String password,
                                   HttpServletResponse response) {

        User user = userService.createUser(username, password);
        Integer userId = user.getId();
        // 签发token
        String token = JwtUtil.createToken(userId);
        if (StringUtils.isBlank(token)) {
            return ResVo.fail(StatusEnum.TOKEN_NOT_EXISTS);
        }
        response.addCookie(SessionUtil.newCookie(SESSION_KEY, token));
        return ResVo.ok(userId);
    }
}
