import axios, {
  AxiosError,
  InternalAxiosRequestConfig,
  AxiosResponse,
} from 'axios';
import { ChatRequest, MemoryChatRequest } from '../types';

// Configure axios defaults
axios.defaults.baseURL = import.meta.env.VITE_HTTP_URL; // Assuming API is served from the same domain

axios.defaults.timeout = 30000;
// 不设置全局 Content-Type，让 axios 根据数据类型自动设置

// Add request interceptor to handle auth
axios.interceptors.request.use(
  (config: InternalAxiosRequestConfig): InternalAxiosRequestConfig => {
    // You can add auth token here if needed
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  },
);

// Add response interceptor to handle common errors
axios.interceptors.response.use(
  (response: AxiosResponse): AxiosResponse => {
    return response;
  },
  (error: AxiosError) => {
    if (error.response && error.response.status === 401) {
      // Handle unauthorized access
      window.location.href = '/login';
    }
    return Promise.reject(error);
  },
);

// Function to handle chat with SSE (Server-Sent Events)
export const streamChat = async (
  request: ChatRequest,
  onMessage: (content: string) => void,
  onError: (error: string) => void,
  onComplete: () => void,
) => {
  let fullContent = '';
  let buffer = ''; // 用于处理跨块的不完整数据

  console.log('Starting chat request with:', JSON.stringify(request, null, 2));

  // 检查是否设置API URL和API Key
  if (!request.modelConfig.apiUrl || request.modelConfig.apiUrl.trim() === '') {
    console.error('API URL未设置:', request.modelConfig);
    onError('请在设置页面配置API URL后再尝试发送消息。');
    return () => {};
  }

  if (!request.modelConfig.apiKey || request.modelConfig.apiKey.trim() === '') {
    console.error('API Key未设置:', request.modelConfig);
    onError('请在设置页面配置API Key后再尝试发送消息。');
    return () => {};
  }

  // 创建AbortController用于取消请求
  const controller = new AbortController();
  const signal = controller.signal;

  try {
    // 发送POST请求并处理响应
    console.log('Starting POST request to chat API');

    // 处理请求的消息列表，仅保留role和content字段
    const processedRequest = {
      ...request,
      messageList: request.messageList.map((msg) => ({
        role: msg.role,
        content: msg.content,
      })),
    };

    // 确保messageList不为空，至少包含当前用户消息
    if (processedRequest.messageList.length === 0) {
      console.warn('消息列表为空，这可能是一个新聊天。添加当前用户消息。');
      const lastUserMessage =
        processedRequest.messageList[processedRequest.messageList.length - 1];
      if (!lastUserMessage) {
        console.error('没有找到用户消息');
        onError('发送消息失败：消息列表为空');
        return () => {};
      }
    }

    console.log(
      'Processed request:',
      JSON.stringify(processedRequest, null, 2),
    );
    let chatMessage = {

      "conversationUuId": processedRequest.conversationUuId,
      "userMessage": processedRequest.messageList[processedRequest.messageList.length - 1].content,
      "modelId": 1,
      "toolList": processedRequest.toolList
    } 

    const response = await fetch('/api/chat/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(chatMessage),
      signal: signal,
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `HTTP error! Status: ${response.status}, Data: ${errorText}`,
      );
    }

    if (!response.body) {
      throw new Error('Response body is null');
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();

    const processStream = async (): Promise<void> => {
      try {
        const { done, value } = await reader.read();

        if (done) {
          if (buffer.trim()) {
            processBufferLines(buffer);
          }
          onComplete();
          return;
        }

        const chunk = decoder.decode(value, { stream: true });
        buffer += chunk;

        const lines = buffer.split('\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          processBufferLines(line);
        }

        await processStream();
      } catch (error) {
        if (axios.isAxiosError(error)) {
          const axiosError = error as AxiosError;
          if (axiosError.response) {
            // 服务器返回了非 2xx 状态码
            const errorData = axiosError.response.data;
            console.error('Axios error response:', errorData);
            onError(
              `请求错误: HTTP error! Status: ${axiosError.response.status}, Data: ${JSON.stringify(errorData)}`,
            );
          } else if (axiosError.request) {
            // 请求已发出但没有收到响应
            console.error('Axios error request:', axiosError.request);
            onError('请求错误: 未收到服务器响应');
          } else {
            // 在设置请求时发生了一些事情，触发了错误
            console.error('Axios error message:', axiosError.message);
            onError(`请求错误: ${axiosError.message}`);
          }
        } else {
          // 其他未知错误
          const err = error as Error;
          console.error('Error reading stream:', err);
          onError(`读取响应流时出错: ${err.message}`);
        }
      }
    };

    // 处理单行数据的函数
    const processBufferLines = (line: string): void => {
      // 跳过空行和注释行
      if (!line.trim() || line.startsWith(':')) {
        return;
      }

      // 处理SSE格式的数据行: data:{"v":"token"}
      if (line.startsWith('data:')) {
        const jsonStr = line.substring(5).trim(); // 移除 'data:' 前缀并去除首尾空格

        if (!jsonStr) {
          return; // 跳过空的data行
        }

        try {
          const jsonData = JSON.parse(jsonStr);
          console.log('Parsed SSE JSON:', jsonData);

          // 处理token数据 - 根据后端格式 {"v":"token"}
          if (jsonData.v !== undefined) {
            console.log('Token received:', JSON.stringify(jsonData.v));
            fullContent += jsonData.v;
            onMessage(fullContent);
          }
          // 处理完成事件
          else if (jsonData.type === 'complete') {
            console.log('Stream complete event received');
            onComplete();
            return;
          }
          // 处理错误事件
          else if (jsonData.type === 'error') {
            console.error('Stream error received:', jsonData.message);
            onError(jsonData.message || 'Unknown error occurred');
            return;
          }
        } catch {
          // JSON解析失败时的处理，去掉未使用的parseError变量
          console.warn(
            'Failed to parse SSE JSON, treating as plain text:',
            jsonStr,
          );
          // 如果JSON解析失败，可能是纯文本，直接添加
          fullContent += jsonStr;
          onMessage(fullContent);
        }
      }
      // 处理非SSE格式的JSON数据（兼容性处理）
      else {
        try {
          const jsonData = JSON.parse(line);
          console.log('Parsed non-SSE JSON:', jsonData);

          if (jsonData.v !== undefined) {
            fullContent += jsonData.v;
            onMessage(fullContent);
          } else if (jsonData.type === 'complete') {
            onComplete();
            return;
          } else if (jsonData.type === 'error') {
            onError(jsonData.message || 'Unknown error occurred');
            return;
          }
        } catch {
          // 不是JSON格式，可能是纯文本，去掉未使用的parseError变量
          if (line.trim()) {
            console.log('Plain text line:', JSON.stringify(line));
            fullContent += line;
            onMessage(fullContent);
          }
        }
      }
    };

    // 开始处理流
    await processStream();
  } catch (error) {
    const err = error as Error;
    console.error('Fetch error:', err);
    if (err.name === 'AbortError') {
      console.log('Fetch aborted');
    } else {
      onError(`请求错误: ${err.message}`);
    }
    onComplete();
  }

  // 返回清理函数
  return () => {
    console.log('Aborting axios request');
    controller.abort();
  };
};

// Function to handle memory chat with SSE (Server-Sent Events)
export const streamChatWithMemory = (
  request: MemoryChatRequest,
  onMessage: (content: string) => void,
  onError: (error: string) => void,
  onComplete: () => void,
) => {
  let fullContent = '';

  console.log(
    'Starting memory chat request with:',
    JSON.stringify(request, null, 2),
  );

  // 检查是否设置API URL和API Key
  if (!request.modelConfig.apiUrl || request.modelConfig.apiUrl.trim() === '') {
    console.error('API URL未设置:', request.modelConfig);
    onError('请在设置页面配置API URL后再尝试发送消息。');
    return () => {};
  }

  if (!request.modelConfig.apiKey || request.modelConfig.apiKey.trim() === '') {
    console.error('API Key未设置:', request.modelConfig);
    onError('请在设置页面配置API Key后再尝试发送消息。');
    return () => {};
  }

  // 首先发送初始化请求
  console.log('Sending POST request to initialize memory chat');
  console.log('Memory chat request payload:', JSON.stringify(request, null, 2));

  axios
    .post(`/api/agent/chat/memory/${request.sessionId}`, request, {
      headers: {
        'Content-Type': 'application/json',
      },
    })
    .then((response) => {
      console.log('Memory chat initialization response:', response);
      console.log(
        'Memory chat response data:',
        JSON.stringify(response.data, null, 2),
      );

      // 检查初始化响应
      if (
        response.data &&
        response.data.status &&
        response.data.status.code === 0
      ) {
        // 初始化成功，创建EventSource接收流式响应
        console.log('Creating EventSource for memory chat streaming');
        const eventSourceUrl = `/api/agent/chat/memory/${request.sessionId}?chatId=${request.chatId}`;
        const eventSource = new EventSource(eventSourceUrl);

        eventSource.onmessage = (event) => {
          try {
            // 处理SSE消息
            const data = event.data;
            console.log(
              'Received memory chat SSE message:',
              JSON.stringify(data),
            );

            // 处理data:开头的SSE格式
            if (data.startsWith('data:')) {
              const content = data.substring(5); // 不trim，保持空格和换行
              console.log('Memory chat data content:', JSON.stringify(content));
              fullContent += content;
              onMessage(fullContent);
            } else {
              // 尝试解析JSON格式
              try {
                const jsonData = JSON.parse(data);
                if (jsonData.content !== undefined) {
                  console.log(
                    'Memory chat JSON content:',
                    JSON.stringify(jsonData.content),
                  );
                  fullContent += jsonData.content;
                  onMessage(fullContent);
                }

                // 检查是否完成
                if (jsonData.event === 'complete') {
                  console.log('Memory chat stream complete event received');
                  eventSource.close();
                  onComplete();
                }
              } catch {
                // 不是JSON格式，直接添加内容，保持原始格式
                console.log('Memory chat plain text:', JSON.stringify(data));
                fullContent += data;
                onMessage(fullContent);
              }
            }
          } catch (error) {
            console.error('Error processing memory chat SSE message:', error);
          }
        };

        eventSource.onerror = (error) => {
          console.error('Memory chat SSE error:', error);
          eventSource.close();
          onError('连接错误，请重试。');
        };

        // 返回清理函数
        return () => {
          console.log('Cleaning up memory chat EventSource');
          eventSource.close();
        };
      } else {
        // 初始化失败
        const errorMsg = response.data?.status?.msg || '未知错误';
        console.error('Memory chat initialization failed:', errorMsg);
        throw new Error(errorMsg);
      }
    })
    .catch((error) => {
      console.error('Memory chat request error:', error);
      if (axios.isAxiosError(error)) {
        console.error('Axios error details:', error.response);
        console.error('Response data:', error.response?.data);
        console.error('Error message:', error.message);
        console.error('Error code:', error.code);
        console.error('Error config:', error.config);

        // 尝试获取更详细的错误信息
        let errorMsg = '连接错误，请重试。';

        if (error.response) {
          // 服务器响应了错误状态码
          errorMsg = `服务器错误 (${error.response.status}): `;

          if (error.response.data) {
            if (error.response.data.status && error.response.data.status.msg) {
              errorMsg += error.response.data.status.msg;
            } else if (typeof error.response.data === 'string') {
              errorMsg += error.response.data;
            } else {
              errorMsg += JSON.stringify(error.response.data);
            }
          } else {
            errorMsg += error.message;
          }
        } else if (error.request) {
          // 请求已发送但没有收到响应
          errorMsg = '服务器没有响应，请检查后端服务是否运行。';
        } else {
          // 设置请求时发生错误
          errorMsg = `请求错误: ${error.message}`;
        }

        onError(errorMsg);
      } else {
        // 非Axios错误
        console.error('Non-Axios error:', error);
        onError(error.message || '发生未知错误');
      }
    });

  // 返回一个空的清理函数
  return () => {
    console.log('Memory chat cleanup called');
  };
};

/**
 * 流式响应处理说明：
 *
 * 后端SSE响应格式：
 * data:{"v":"有"}
 * data:{"v":"关于"}
 * data:{"v":" Markdown"}
 *
 * 处理逻辑：
 * 1. 使用fetch API接收SSE流
 * 2. 使用缓冲区处理跨块的不完整数据
 * 3. 按行分割并处理每行数据
 * 4. 提取data:后的JSON，获取v字段的token值
 * 5. 累加token到fullContent并回调onMessage
 * 6. 错误处理：JSON解析失败时作为纯文本处理
 */
