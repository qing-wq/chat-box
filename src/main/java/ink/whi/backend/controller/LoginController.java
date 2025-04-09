package ink.whi.chatboxbackend.controller;

import ink.whi.chatboxbackend.common.dto.ResVo;
import ink.whi.chatboxbackend.common.dto.user.BaseUserInfoDTO;
import ink.whi.chatboxbackend.common.dto.user.UserSaveReq;
import ink.whi.chatboxbackend.common.exception.StatusEnum;
import ink.whi.chatboxbackend.permission.Permission;
import ink.whi.chatboxbackend.permission.UserRole;
import ink.whi.chatboxbackend.service.UserService;
import ink.whi.chatboxbackend.utils.JwtUtil;
import ink.whi.chatboxbackend.utils.SessionUtil;
import jakarta.servlet.http.HttpServletResponse;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import static ink.whi.chatboxbackend.global.GlobalInitHelper.SESSION_KEY;


/**
 * 前后台登录接口
 *
 * @author: qing
 * @Date: 2023/4/26
 */
@RestController("api")
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
     * application/json
     * @param req
     * @return
     */
    @PostMapping(path = "register")
    public ResVo<Integer> register(@Validated @RequestBody UserSaveReq req, HttpServletResponse response) {

        Integer userId = userService.saveUser(req);
        // 签发token
        String token = JwtUtil.createToken(userId);
        if (StringUtils.isBlank(token)) {
            return ResVo.fail(StatusEnum.TOKEN_NOT_EXISTS);
        }
        response.addCookie(SessionUtil.newCookie(SESSION_KEY, token));
        return ResVo.ok(userId);
    }

}
