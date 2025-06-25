import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import MessageItem from '../chat/MessageItem';
import { Message } from '../../types';

const SSETest: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isStreaming, setIsStreaming] = useState(false);

  // 模拟您提供的SSE数据流
  const simulateSSEStream = () => {
    setIsStreaming(true);
    
    // 添加用户消息
    const userMessage: Message = {
      id: Date.now(),
      role: 'user',
      content: '请展示一段Markdown内容',
      createTime: new Date().toISOString()
    };
    
    setMessages([userMessage]);
    
    // 添加空的AI消息
    const aiMessage: Message = {
      id: Date.now() + 1,
      role: 'assistant',
      content: '',
      createTime: new Date().toISOString()
    };
    
    setMessages(prev => [...prev, aiMessage]);
    
    // 模拟SSE token流
    const tokens = [
      '当然', '！', '以下', '是一', '段', '使用', ' Markdown', ' ', 
      '格式', '编', '写的', '示例', '内容', '：', '\n', '\n',
      '## ', '标题', '示例', '\n', '\n',
      '这是', '一个', ' **', '粗体', '文字', '** ', '和', ' *', '斜体', '文字', '* ', '的', '示例', '。', '\n', '\n',
      '### ', '代码', '示例', '\n', '\n',
      '```', 'javascript', '\n',
      'function ', 'greet', 'User', '(name', ') {', '\n',
      '    ', 'console', '.log', '("Hello, " ', '+ name ', '+ "!");', '\n',
      '    ', 'return ', '"Welcome!";', '\n',
      '}', '\n',
      '```', '\n', '\n',
      '### ', '列表', '示例', '\n', '\n',
      '- ', '第一', '项', '\n',
      '- ', '第二', '项', '\n',
      '- ', '第三', '项', '\n', '\n',
      '这样', '的', '内容', '应该', '能够', '正确', '显示', '！'
    ];
    
    let currentContent = '';
    let tokenIndex = 0;
    
    const streamInterval = setInterval(() => {
      if (tokenIndex < tokens.length) {
        currentContent += tokens[tokenIndex];
        
        // 更新AI消息内容
        setMessages(prev => {
          const newMessages = [...prev];
          if (newMessages.length > 1) {
            newMessages[newMessages.length - 1] = {
              ...newMessages[newMessages.length - 1],
              content: currentContent
            };
          }
          return newMessages;
        });
        
        tokenIndex++;
      } else {
        clearInterval(streamInterval);
        setIsStreaming(false);
      }
    }, 100); // 每100ms发送一个token
  };

  const clearMessages = () => {
    setMessages([]);
    setIsStreaming(false);
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>SSE 流式响应测试</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-4">
            这个测试模拟了您提到的分词SSE数据流，验证换行符和Markdown格式是否正确处理。
          </p>
          <div className="flex gap-4">
            <Button 
              onClick={simulateSSEStream} 
              disabled={isStreaming}
            >
              {isStreaming ? '流式响应中...' : '开始SSE测试'}
            </Button>
            <Button 
              variant="outline" 
              onClick={clearMessages}
              disabled={isStreaming}
            >
              清除消息
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-4">
        {messages.map((message) => (
          <Card key={message.id}>
            <CardContent className="p-0">
              <MessageItem 
                message={message} 
                isStreaming={isStreaming && message.role === 'assistant'}
              />
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default SSETest;
