package ink.whi.backend.common.context;

import ink.whi.backend.common.exception.BusinessException;
import ink.whi.backend.common.status.StatusEnum;
import lombok.Builder;
import lombok.Data;

/**
 * 请求信息上下文
 * 使用ThreadLocal存储当前请求的信息
 *
 * @author: qing
 * @Date: 2025/3/11
 */
public class ReqInfoContext {
    /**
     * 本地线程变量
     */
    private static final ThreadLocal<ReqInfo> contexts = new InheritableThreadLocal<>();

    public static void addReqInfo(ReqInfo reqInfo) {
        contexts.set(reqInfo);
    }

    public static void clear() {
        contexts.remove();
    }

    public static ReqInfo getReqInfo() {
        return contexts.get();
    }

    /**
     * 获取当前用户ID
     *
     * @return 用户ID
     */
    public static Integer getUserId() {
        ReqInfo reqInfo = getReqInfo();
        Integer userId = reqInfo.getUserId();
        if (userId == null) {
            throw BusinessException.newInstance(StatusEnum.UNEXPECT_ERROR);
        }
        return userId;
    }

    /**
     * 请求信息
     *
     * @author: qing
     * @Date: 2025/3/11
     */
    @Data
    public static class ReqInfo {
        public String host;
        public String path;
        public String referer;
        public String userAgent;
        /**
         * post 表单参数
         */
        public String payload;

        /**
         * 用户ID
         */
        public Integer userId;

        /**
         * 请求URI
         */
        public String uri;
    }
}
