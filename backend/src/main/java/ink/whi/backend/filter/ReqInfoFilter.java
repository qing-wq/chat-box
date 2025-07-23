package ink.whi.backend.filter;

import ink.whi.backend.common.context.ReqInfoContext;
import ink.whi.backend.common.utils.CrossUtil;
import jakarta.servlet.*;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang3.StringUtils;
import org.slf4j.ILoggerFactory;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.net.URLDecoder;

/**
 * 初始化请求上下文
 *
 * @author: qing
 * @Date: 2025/3/11
 */
@Slf4j
@Component
@Order(1)
public class ReqInfoFilter implements Filter {

    private static final Logger logger = LoggerFactory.getLogger(ReqInfoFilter.class);

    @Override
    public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain)
            throws IOException, ServletException {
        long start = System.currentTimeMillis();
        HttpServletRequest req = null;
        try {
            req = initRequestInfo((HttpServletRequest) request);
            CrossUtil.buildCors(req, (HttpServletResponse) response);
            chain.doFilter(req, response);
        } finally {
            buildRequestLog(ReqInfoContext.getReqInfo(), req, System.currentTimeMillis() - start);
            ReqInfoContext.clear();
        }
    }

    private HttpServletRequest initRequestInfo(HttpServletRequest request) {
        if (staticURI(request)) {
            // 静态资源直接放行
            return request;
        }

        try {
            ReqInfoContext.ReqInfo reqInfo = new ReqInfoContext.ReqInfo();
            reqInfo.setHost(request.getHeader("host"));
            reqInfo.setPath(request.getPathInfo());
            reqInfo.setReferer(request.getHeader("referer"));
            reqInfo.setUserAgent(request.getHeader("User-Agent"));
            request = this.wrapperRequest(request, reqInfo);
            // 校验token
            reqInfo.setUserId(1);  // TODO 先临时设置userId为1
            ReqInfoContext.addReqInfo(reqInfo);
        } catch (Exception e) {
            log.info("init reqInfo error: " + e.getMessage());
        }
        return request;
    }

    private HttpServletRequest wrapperRequest(HttpServletRequest request, ReqInfoContext.ReqInfo reqInfo) {
        BodyReaderHttpServletRequestWrapper requestWrapper = new BodyReaderHttpServletRequestWrapper(request);
        reqInfo.setPayload(requestWrapper.getBodyString());
        return requestWrapper;
    }

    /**
     * 日志输出
     *
     * @param req
     * @param request
     * @param costTime
     */
    private void buildRequestLog(ReqInfoContext.ReqInfo req, HttpServletRequest request, long costTime) {
        if (req == null || staticURI(request)) {
            return;
        }

        StringBuilder msg = new StringBuilder();
        msg.append("method=").append(request.getMethod()).append("; ");
        msg.append("uri=").append(request.getRequestURI()).append("; ");
        msg.append("payload=").append(req.getPayload()).append("; ");
        if (req.getUserId() != null) {
            // 打印用户信息
            msg.append("user=").append(req.getUserId()).append("; ");
        }
        msg.append("cost=").append(costTime).append("; ");

        if (StringUtils.isNotBlank(req.getReferer())) {
            msg.append("referer=").append(URLDecoder.decode(req.getReferer())).append("; ");
        }
        msg.append("agent=").append(req.getUserAgent());

        logger.info("{}", msg);
    }

    private boolean staticURI(HttpServletRequest request) {
        return request == null
                || request.getRequestURI().endsWith("css")
                || request.getRequestURI().endsWith("js")
                || request.getRequestURI().endsWith("png")
                || request.getRequestURI().endsWith("ico")
                || request.getRequestURI().endsWith("svg")
                // 忽略actuator端点
                || request.getRequestURI().equalsIgnoreCase("/actuator/prometheus");
    }
}
