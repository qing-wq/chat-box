import { useState, useCallback } from 'react';
import { useAppSelector } from './useAppSelector';
import { useAppDispatch } from './useAppDispatch';
import { addMessage, updateLastMessage, setStreaming, updateChatMessages } from '../store/chatSlice';
import { Message, ChatRequest } from '../types';
import { streamChat } from '../utils/api';

export const useChat = () => {
  const dispatch = useAppDispatch();
  const { modelConfig } = useAppSelector((state: any) => state.config);
  const [error, setError] = useState<string | null>(null);
  const currentChat = useAppSelector((state) => state.chat.currentChat);
  let messageList = [...currentChat?.messageList || []];
  const chatId = currentChat?.id;


  const sendMessage = useCallback((content: string, useTools: string[] = []) => {
    console.log('sendMessage called with content:', content, 'and tools:', useTools);

    if (!chatId) {
      console.error('No current chat available');
      return;
    }

    // Add user message to the chat
    const userMessage: Message = {
      role: 'user',
      content
    };
    console.log('Adding user message:', userMessage);
    messageList.push(userMessage);
    console.log('current messageList:', messageList);
    dispatch(addMessage(userMessage));

    // Add empty assistant message that will be updated with streaming content
    const assistantMessage: Message = {
      role: 'assistant',
      content: ''
    };

    dispatch(addMessage(assistantMessage));
    dispatch(setStreaming(true));

    // 获取最新的消息列表
    console.log('All messages for request:', messageList);

    // Create chat request
    const chatRequest: ChatRequest = {
      chatId,
      messageList,
      modelConfig,
      toolList: useTools.length > 0 ? useTools : undefined
    };

    console.log('Created chat request:', JSON.stringify(chatRequest, null, 2));
    console.log('Model config:', JSON.stringify(modelConfig, null, 2));

    // Start streaming
    console.log('Calling streamChat function');
    let assistantResponse = '';
    const cleanup = streamChat(
      chatRequest,
      (content) => {
        // 更新最后一条消息的内容
        dispatch(updateLastMessage({ content }));
        // 将内容设置为助手回复的内容
        assistantResponse = content;
      },
      (error) => {
        console.error('Stream error received:', error);
        setError(error);
        dispatch(setStreaming(false));
      },
      // complete
      () => {
        console.log('Stream completed');
        dispatch(setStreaming(false));

        console.log('Final assistant response:', assistantResponse);
        messageList.push(assistantMessage);

        // Save the updated messages to the backend
        const messagesToSave: Message[] = [];

        // 获取最新的用户消息（倒数第二条）
        const userMessageIndex = messageList.length - 2;
        const userMessage = messageList[userMessageIndex];

        // 添加用户消息
        messagesToSave.push({
          role: 'user',
          content: userMessage.content,
          chatId
        });

        // 添加助手消息
        messagesToSave.push({
          role: 'assistant',
          content: assistantResponse,
          chatId
        });
        
        console.log('Saving updated messages to backend:', JSON.stringify(messagesToSave));
        dispatch(updateChatMessages({
          chatId,
          newMessageList: messagesToSave
        }));
      }
    );

    return cleanup;
  }, [modelConfig, dispatch, currentChat]);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    sendMessage,
    error,
    clearError
  };
};

export default useChat;
