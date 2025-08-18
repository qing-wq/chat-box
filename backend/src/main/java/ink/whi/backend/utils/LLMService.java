package ink.whi.backend.utils;

import dev.langchain4j.data.message.AiMessage;
import dev.langchain4j.data.message.ChatMessage;
import dev.langchain4j.model.output.TokenUsage;
import dev.langchain4j.service.TokenStream;
import ink.whi.backend.cache.SseEmitterCache;
import ink.whi.backend.common.enums.MsgRoleEnum;
import ink.whi.backend.common.exception.BusinessException;
import ink.whi.backend.common.status.StatusEnum;
import ink.whi.backend.common.dto.message.MessageDTO;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.util.CollectionUtils;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import java.util.ArrayList;
import java.util.List;
import java.util.HashMap;
import java.util.Map;
import java.util.concurrent.atomic.AtomicBoolean;
import java.util.function.BiConsumer;

import static dev.langchain4j.data.message.SystemMessage.systemMessage;

/**
 * @author: qing
 * @Date: 2025/3/30
 */
@Slf4j
@Component
public class LLMService {

    @Autowired
    private SseEmitterCache cache;

    /**
     * 构建工具列表（预留方法）
     * @param toolList 工具名称列表
     */
    public void buildTools(List<String> toolList) {
        if (CollectionUtils.isEmpty(toolList)) {
            return;
        }
        // TODO: 实现工具构建逻辑
        for (String toolName : toolList) {
            // 预留：根据工具名称构建具体工具
        }
    }

    /**
     * 构建聊天消息列表
     * @param messages 历史消息列表
     * @param systemMessage 系统提示词
     * @return 构建好的聊天消息列表
     */
    public List<ChatMessage> buildChatMessages(List<MessageDTO> messages, String systemMessage) {
        List<ChatMessage> chatMessages = new ArrayList<>();

        // 添加系统消息
        chatMessages.add(systemMessage(systemMessage));

        if (messages != null) {
            for (MessageDTO msgDTO : messages) {
                MsgRoleEnum role = MsgRoleEnum.formRole(msgDTO.getRole());
                if (role == null) {
                    throw BusinessException.newInstance(StatusEnum.ILLEGAL_ARGUMENTS_MIXED,
                            "不支持的消息角色: " + msgDTO.getRole());
                }
                ChatMessage chatMessage = role.createMessage(msgDTO.getContent());
                chatMessages.add(chatMessage);
            }
        }
        return chatMessages;
    }

    /**
     * 注册TokenStream处理器
     *
     * @param tokenStream Token流
     * @param emitter SSE连接
     * @param uuid 会话UUID
     * @param consumer 请求完成后回调
     */
    public void registerStreamingHandler(TokenStream tokenStream, SseEmitter emitter, String uuid, BiConsumer<AiMessage, TokenUsage> consumer) {
        StringBuilder curContent = new StringBuilder();
        AtomicBoolean stopHandled = new AtomicBoolean(false);

        // fixme 目前停止只是表面停止，即不再处理大模型的返回值，但是大模型的输出并没有停止
        tokenStream.onPartialResponse(token -> {
                    curContent.append(token);

                    // 检查session是否存在
                    if (!cache.exist(uuid)) {
                        return;
                    }

                    // 检查停止状态，并防止重复处理
                    if (cache.isStop(uuid)) {
                        if (stopHandled.compareAndSet(false, true)) {
                            handleStopRequest(emitter, uuid, curContent.toString(), consumer);
                        }
                        return;
                    }

                    try {
                        // 将token封装为JSON格式 {v: token}
                        Map<String, String> tokenData = new HashMap<>();
                        tokenData.put("v", token);
                        emitter.send(SseEmitter.event().data(tokenData));
                    } catch (Exception e) {
                        // 吞掉异常，否则会被onError捕获
                        log.error("发送SSE数据失败", e);
                    }
                })
                .onCompleteResponse((response) -> {
                    // 检查session是否存在
                    if (!cache.exist(uuid)) {
                        log.warn("sse被提前关闭，uuid: {}", uuid);
                        return;
                    }

                    try {
                        emitter.complete();
                        AiMessage aiMessage = response.aiMessage();
                        log.info("流式响应完成, response:{}", response.metadata());

                        consumer.accept(aiMessage, response.tokenUsage());
                    } catch (Exception e) {
                        // 吞掉异常，否则会被onError捕获
                        log.error("SSE complete失败", e);
                    }
                })
                .onToolExecuted(toolExecution -> log.info("toolExecution:{}", toolExecution))
                .onError(e -> log.error("handle sse error", e))
                .start();
    }

    /**
     * 处理停止请求 - 优雅停止流式响应（防重复执行）
     *
     * @param emitter SSE连接
     * @param uuid 会话UUID
     * @param currentContent 当前已生成的内容
     * @param consumer 保存内容的回调函数
     */
    private void handleStopRequest(SseEmitter emitter, String uuid, String currentContent, BiConsumer<AiMessage, TokenUsage> consumer) {
        try {
            log.info("处理停止请求, uuid: {}, 当前内容长度: {}", uuid, currentContent.length());

            // 先检查session是否还存在，防止重复处理
            if (cache.getSessionInfo(uuid) == null) {
                log.warn("Session已被清理, uuid: {}, 跳过处理", uuid);
                return;
            }

            // 1. 发送停止事件给前端
            emitter.send(SseEmitter.event()
                    .name("stop")
                    .data("响应已停止"));

            // 2. 保存当前已生成的内容
            if (!currentContent.trim().isEmpty()) {
                consumer.accept(AiMessage.aiMessage(currentContent), null);
            }

            // 3. 完成SSE连接
            emitter.complete();
            log.info("sse响已停止, uuid: {}", uuid);

        } catch (Exception e) {
            log.error("处理停止请求失败, uuid: {}", uuid, e);
            // 发生异常时也要确保SSE连接关闭和缓存清理
            try {
                emitter.complete();
            } catch (Exception ignored) {
                // 忽略关闭时的异常
            }
        }
    }
}
