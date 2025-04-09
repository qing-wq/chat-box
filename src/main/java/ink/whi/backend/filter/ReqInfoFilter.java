package ink.whi.chatboxbackend.filter;

import ink.whi.chatboxbackend.context.ReqInfoContext;
import jakarta.servlet.Filter;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.ServletRequest;
import jakarta.servlet.ServletResponse;
import jakarta.servlet.http.HttpServletRequest;
import lombok.extern.slf4j.Slf4j;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;

import java.io.IOException;

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

    @Override
    public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain)
            throws IOException, ServletException {
        HttpServletRequest httpRequest = (HttpServletRequest) request;
        
        try {
            initRequestInfo(httpRequest);
            chain.doFilter(request, response);
        } finally {
            ReqInfoContext.clear();
        }
    }

    private void initRequestInfo(HttpServletRequest request) {
        String uri = request.getRequestURI();

        ReqInfoContext.ReqInfo reqInfo = ReqInfoContext.ReqInfo.builder()
                .uri(uri)
                .userId(1) // 先临时设置userId为1
                .build();

        ReqInfoContext.setReqInfo(reqInfo);
    }
}
