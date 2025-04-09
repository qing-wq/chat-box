package ink.whi.backend.common.utils;

import org.springframework.util.DigestUtils;

import java.nio.charset.StandardCharsets;
import java.util.Objects;

/**
 * 密码加盐校验工具类
 * @author: qing
 * @Date: 2023/4/26
 */
public class UserPwdEncoderUtil {
    /**
     * 盐值
     */
    private static final String salt = "xxx";
    /**
     * 加盐位置
     */
    private static final Integer saltIndex = 1;

    public static String encoder(String pwd) {
        if (pwd.length() > saltIndex) {
            pwd = pwd.substring(0, saltIndex) + salt + pwd.substring(saltIndex);
        } else {
            pwd = pwd + salt;
        }
        return (DigestUtils.md5DigestAsHex(pwd.getBytes(StandardCharsets.UTF_8)));
    }

    public static boolean match(String plainPwd, String encPwd) {
        if (plainPwd.length() > saltIndex) {
            plainPwd = plainPwd.substring(0, saltIndex) + salt + plainPwd.substring(saltIndex);
        } else {
            plainPwd = plainPwd + salt;
        }

        return Objects.equals(DigestUtils.md5DigestAsHex(plainPwd.getBytes(StandardCharsets.UTF_8)), encPwd);
    }

}
