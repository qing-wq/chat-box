package ink.whi.backend.agent;

import dev.langchain4j.data.message.AiMessage;
import dev.langchain4j.data.message.ChatMessage;
import dev.langchain4j.data.message.SystemMessage;
import dev.langchain4j.data.message.UserMessage;
import dev.langchain4j.model.output.Response;
import dev.langchain4j.model.openai.OpenAiChatModel;
import ink.whi.backend.agent.tool.Tool;
import ink.whi.backend.agent.tool.impl.BingSearchTool;
import ink.whi.backend.agent.tool.impl.DateTool;
import ink.whi.backend.agent.workflow.Workflow;
import lombok.Getter;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

/**
 * 日报助手Agent
 * 用于生成结构化日报内容
 */
@Slf4j
@Component
public class DailyReportAgent {
    
    /**
     * 系统提示词
     */
    private final String SYSTEM_PROMPT = """
# 角色：**专业日报撰写助手**  
**负责整理分析用户的工作内容，结合行业数据生成结构化专业日报**

## 目标：  
1. 高效整合碎片化工作信息  
2. 输出符合企业规范的结构化日报  

## 技能：  
1. **语义解析**：从对话记录中提取项目、任务、进度等关键信息  
2. **动态检索**：调用必应搜索获取行业最新数据支撑日报内容  
3. **自动标准化**：生成带时间戳的Markdown格式文档   
""";
    
    /**
     * 工具函数调用格式
     */
    private static final Pattern TOOL_PATTERN = Pattern.compile("\\{\\{([a-zA-Z_]+)\\(([^)]*)\\)\\}\\}");
    
    /**
     * 工具集合
     */
    @Getter
    private final List<Tool> tools;
    
    /**
     * 工作流引擎
     */
    @Getter
    private final Workflow workflow;
    
    @Autowired
    public DailyReportAgent(BingSearchTool bingSearchTool, DateTool dateTool) {
        // 初始化工具集合
        this.tools = Arrays.asList(bingSearchTool, dateTool);
        
        // 初始化工作流
        this.workflow = Workflow.builder()
                .name("日报生成工作流")
                .build()
                .addStep("提取工作内容", this::extractWorkContent)
                .addStep("格式化日报", this::formatDailyReport);
    }
    
    /**
     * 生成日报
     * @param userInput 用户输入
     * @param apiKey API密钥
     * @return 生成的日报内容
     */
    public String generateDailyReport(String userInput, String apiKey) {
        try {
            log.info("开始生成日报");
            return workflow.execute(userInput);
        } catch (Exception e) {
            log.error("日报生成失败", e);
            return "生成日报时发生错误: " + e.getMessage();
        }
    }
    
    /**
     * 提取工作内容
     * @param userInput 用户输入
     * @return 提取的工作内容
     */
    private String extractWorkContent(String userInput) {
        // 构建消息列表
        List<ChatMessage> messages = new ArrayList<>();
        messages.add(new SystemMessage(SYSTEM_PROMPT + "\n\n现在你需要从用户输入中提取关键的工作内容，包括项目名称、任务描述和完成进度"));
        messages.add(new UserMessage(userInput));
        
        // 构建模型
        OpenAiChatModel model = OpenAiChatModel.builder()
                .apiKey(System.getenv("OPENAI_API_KEY"))
                .modelName("gpt-3.5-turbo")
                .build();
        
        // 获取回复
        Response<AiMessage> response = model.generate(messages);
        return response.content().text();
    }
    
    /**
     * 格式化日报
     * @param extractedContent 提取的内容
     * @return 格式化的日报
     */
    private String formatDailyReport(String extractedContent) {
        // 处理可能的工具调用
        String processedContent = processToolCalls(extractedContent);
        
        // 构建消息列表
        List<ChatMessage> messages = new ArrayList<>();
        messages.add(new SystemMessage(SYSTEM_PROMPT + "\n\n现在你需要将提取的工作内容转换为规范的Markdown格式日报"));
        messages.add(new UserMessage(processedContent));
        
        // 构建模型
        OpenAiChatModel model = OpenAiChatModel.builder()
                .apiKey(System.getenv("OPENAI_API_KEY"))
                .modelName("gpt-3.5-turbo")
                .build();
        
        // 获取回复
        Response<AiMessage> response = model.generate(messages);
        return response.content().text();
    }
    
    /**
     * 处理工具调用
     * @param content 包含工具调用的内容
     * @return 处理后的内容
     */
    private String processToolCalls(String content) {
        StringBuffer result = new StringBuffer();
        Matcher matcher = TOOL_PATTERN.matcher(content);
        
        while (matcher.find()) {
            String toolName = matcher.group(1);
            String params = matcher.group(2);
            
            // 查找匹配的工具
            Tool matchingTool = tools.stream()
                    .filter(tool -> tool.getName().equals(toolName))
                    .findFirst()
                    .orElse(null);
            
            if (matchingTool != null) {
                // 执行工具并替换结果
                String toolResult = matchingTool.execute(params);
                matcher.appendReplacement(result, toolResult);
            } else {
                // 工具未找到，保留原文
                matcher.appendReplacement(result, matcher.group(0));
            }
        }
        
        matcher.appendTail(result);
        return result.toString();
    }
}
