package ink.whi.backend.agent.tool.impl;

import ink.whi.backend.agent.tool.Tool;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.URL;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;

/**
 * 必应搜索插件
 * 用于Agent获取互联网信息
 */
@Slf4j
@Component
public class BingSearchTool implements Tool {
    
    private static final String SEARCH_API_URL = "https://api.bing.microsoft.com/v7.0/search";
    private static final String API_KEY_ENV = "BING_API_KEY";
    
    @Override
    public String getName() {
        return "bing_search";
    }
    
    @Override
    public String execute(String params) {
        try {
            // 获取API Key（实际应用中应从配置或环境变量获取）
            String apiKey = System.getenv(API_KEY_ENV);
            if (apiKey == null || apiKey.isEmpty()) {
                return "错误：未配置Bing搜索API Key，请设置" + API_KEY_ENV + "环境变量";
            }
            
            // 编码查询参数
            String encodedQuery = URLEncoder.encode(params, StandardCharsets.UTF_8);
            String requestUrl = SEARCH_API_URL + "?q=" + encodedQuery + "&count=5";
            
            // 创建HTTP连接
            URL url = new URL(requestUrl);
            HttpURLConnection connection = (HttpURLConnection) url.openConnection();
            
            // 设置请求头
            connection.setRequestMethod("GET");
            connection.setRequestProperty("Ocp-Apim-Subscription-Key", apiKey);
            connection.setRequestProperty("Accept", "application/json");
            
            // 获取响应
            int responseCode = connection.getResponseCode();
            if (responseCode == 200) {
                // 读取响应内容
                BufferedReader reader = new BufferedReader(
                        new InputStreamReader(connection.getInputStream()));
                StringBuilder response = new StringBuilder();
                String line;
                
                while ((line = reader.readLine()) != null) {
                    response.append(line);
                }
                reader.close();
                
                // 这里简化处理，实际应用中应解析JSON并提取有用信息
                log.info("Bing搜索成功：{}", params);
                return response.toString();
            } else {
                log.error("Bing搜索失败，状态码：{}", responseCode);
                return "搜索失败，HTTP状态码：" + responseCode;
            }
        } catch (Exception e) {
            log.error("执行Bing搜索时出错", e);
            return "搜索错误：" + e.getMessage();
        }
    }
}
