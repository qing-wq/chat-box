package ink.whi.chatboxbackend.context;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * 请求信息上下文
 * 使用ThreadLocal存储当前请求的信息
 *
 * @author: qing
 * @Date: 2025/3/11
 */
public class ReqInfoContext {
    private static final ThreadLocal<ReqInfo> REQ_INFO_THREAD_LOCAL = new ThreadLocal<>();

    /**
     * 获取当前请求信息
     *
     * @return 请求信息
     */
    public static ReqInfo getReqInfo() {
        return REQ_INFO_THREAD_LOCAL.get();
    }

    /**
     * 设置当前请求信息
     *
     * @param reqInfo 请求信息
     */
    public static void setReqInfo(ReqInfo reqInfo) {
        REQ_INFO_THREAD_LOCAL.set(reqInfo);
    }

    /**
     * 获取当前用户ID
     *
     * @return 用户ID
     */
    public static Integer getUserId() {
        ReqInfo reqInfo = getReqInfo();
        return reqInfo != null ? reqInfo.getUserId() : null;
    }

    /**
     * 清除当前请求信息
     */
    public static void clear() {
        REQ_INFO_THREAD_LOCAL.remove();
    }

    public static void addReqInfo(ReqInfo reqInfo) {
        REQ_INFO_THREAD_LOCAL.set(reqInfo);
    }

    /**
     * 请求信息
     *
     * @author: qing
     * @Date: 2025/3/11
     */
    @Data
    @Builder
    public static class ReqInfo {
        private String host;
        private String path;
        private String referer;
        private String userAgent;

        /**
         * 用户ID
         */
        private Integer userId;

        /**
         * 请求URI
         */
        private String uri;
    }
}
