package ink.whi.backend.agent.workflow;

import lombok.Builder;
import lombok.Getter;
import lombok.extern.slf4j.Slf4j;

import java.util.ArrayList;
import java.util.List;
import java.util.function.Function;

/**
 * 工作流引擎
 * 用于定义和执行Agent的处理步骤
 */
@Slf4j
@Getter
@Builder
public class Workflow {
    /**
     * 工作流名称
     */
    private String name;
    
    /**
     * 工作流步骤
     */
    @Builder.Default
    private List<WorkflowStep> steps = new ArrayList<>();
    
    /**
     * 添加步骤
     * @param name 步骤名称
     * @param processor 处理函数
     * @return 当前工作流
     */
    public Workflow addStep(String name, Function<String, String> processor) {
        steps.add(new WorkflowStep(name, processor));
        return this;
    }
    
    /**
     * 执行工作流
     * @param input 输入内容
     * @return 处理结果
     */
    public String execute(String input) {
        String currentResult = input;
        
        for (WorkflowStep step : steps) {
            try {
                log.info("执行工作流步骤: {}", step.getName());
                currentResult = step.getProcessor().apply(currentResult);
            } catch (Exception e) {
                log.error("工作流步骤执行失败: {}", step.getName(), e);
                return "工作流执行错误: " + e.getMessage();
            }
        }
        
        return currentResult;
    }
    
    /**
     * 工作流步骤类
     */
    @Getter
    public static class WorkflowStep {
        /**
         * 步骤名称
         */
        private final String name;
        
        /**
         * 处理函数
         */
        private final Function<String, String> processor;
        
        public WorkflowStep(String name, Function<String, String> processor) {
            this.name = name;
            this.processor = processor;
        }
    }
}
