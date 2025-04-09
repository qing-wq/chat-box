package ink.whi.backend.agent.tool;

/**
 * 工具接口
 * 定义Agent可调用的工具规范
 */
public interface Tool {
    /**
     * 获取工具名称
     * @return 工具名称
     */
    String getName();
    
    /**
     * 执行工具
     * @param params 工具参数
     * @return 执行结果
     */
    String execute(String params);
}
