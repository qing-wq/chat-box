package ink.whi.backend.controller;

import ink.whi.backend.agent.DailyReportAgent;
import ink.whi.backend.common.dto.agent.AgentRequestDTO;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * Agent控制器
 * 处理Agent相关请求
 */
// @Slf4j
// @RestController
// @RequestMapping("/api/agent/daily")
// @RequiredArgsConstructor
// public class DailyReportController {
    
//     private final DailyReportAgent dailyReportAgent;
    
//     /**
//      * 日报生成接口
//      * @param request 请求参数
//      * @return 生成的日报内容
//      */
//     @PostMapping("/daily-report")
//     public ResponseEntity<String> generateDailyReport(@RequestBody AgentRequestDTO request) {
//         log.info("接收到日报生成请求: {}", request.getMessage());
        
//         String report = dailyReportAgent.generateDailyReport(
//                 request.getMessage(),
//                 request.getApiKey()
//         );
        
//         return ResponseEntity.ok(report);
//     }
// }
