import React, { useRef, useEffect, useState } from 'react';
import { ChevronDown, MessageSquare, Sparkles, Code, Calculator } from 'lucide-react';
import { Message } from '../../types';
import MessageItem from './MessageItem';
import { useAppSelector } from '../../hooks';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface MessageListProps {
  messages: Message[];
}

const MessageList: React.FC<MessageListProps> = ({ messages }) => {
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const { streaming } = useAppSelector(state => state.chat);
  const [showScrollButton, setShowScrollButton] = useState(false);
  const [isUserScrolling, setIsUserScrolling] = useState(false);

  // Scroll to bottom when new messages are added or when streaming
  useEffect(() => {
    if (!isUserScrolling && scrollAreaRef.current) {
      const scrollContainer = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (scrollContainer) {
        scrollContainer.scrollTop = scrollContainer.scrollHeight;
        setShowScrollButton(false);
      }
    }
  }, [messages, streaming, isUserScrolling]);

  // Handle scroll events to show/hide the scroll button
  const handleScroll = (event: React.UIEvent<HTMLDivElement>) => {
    const target = event.target as HTMLDivElement;
    const { scrollTop, scrollHeight, clientHeight } = target;
    const distanceFromBottom = scrollHeight - scrollTop - clientHeight;

    // Show button if we're not at the bottom (with some tolerance)
    setShowScrollButton(distanceFromBottom > 100);

    // Track if user is manually scrolling
    setIsUserScrolling(distanceFromBottom > 50);
  };

  // Scroll to bottom when the button is clicked
  const scrollToBottom = () => {
    if (scrollAreaRef.current) {
      const scrollContainer = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (scrollContainer) {
        scrollContainer.scrollTop = scrollContainer.scrollHeight;
        setShowScrollButton(false);
        setIsUserScrolling(false);
      }
    }
  };

  if (messages.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-8 text-center">
        <div className="max-w-4xl w-full">
          {/* Welcome Header */}
          <div className="mb-12">
            <div className="flex items-center justify-center mb-6">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center shadow-lg">
                <MessageSquare className="w-8 h-8 text-white" />
              </div>
            </div>
            <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
              欢迎使用 AI 聊天助手
            </h2>
            <p className="text-lg text-muted-foreground leading-relaxed max-w-2xl mx-auto">
              我可以帮助您解答问题、编写代码、解释概念、创作内容等等。让我们开始对话吧！
            </p>
          </div>

          {/* Feature Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            <Card className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center mr-3">
                    <MessageSquare className="w-5 h-5 text-blue-500" />
                  </div>
                  <h3 className="font-semibold">智能对话</h3>
                </div>
                <ul className="text-sm text-muted-foreground space-y-2">
                  <li>"解释React Hooks的工作原理"</li>
                  <li>"什么是机器学习？"</li>
                  <li>"如何提高代码质量？"</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  <div className="w-10 h-10 rounded-lg bg-green-500/10 flex items-center justify-center mr-3">
                    <Code className="w-5 h-5 text-green-500" />
                  </div>
                  <h3 className="font-semibold">代码助手</h3>
                </div>
                <ul className="text-sm text-muted-foreground space-y-2">
                  <li>"用Python写一个排序算法"</li>
                  <li>"调试这段JavaScript代码"</li>
                  <li>"优化SQL查询性能"</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  <div className="w-10 h-10 rounded-lg bg-purple-500/10 flex items-center justify-center mr-3">
                    <Calculator className="w-5 h-5 text-purple-500" />
                  </div>
                  <h3 className="font-semibold">数学计算</h3>
                </div>
                <ul className="text-sm text-muted-foreground space-y-2">
                  <li>"计算复合利率"</li>
                  <li>"解这个微分方程"</li>
                  <li>"统计数据分析"</li>
                </ul>
              </CardContent>
            </Card>
          </div>

          {/* Getting Started */}
          <div className="flex items-center justify-center">
            <div className="flex items-center gap-2 px-6 py-3 bg-muted/50 rounded-full">
              <Sparkles className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium">在下方输入框中开始对话</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full relative">
      <ScrollArea
        ref={scrollAreaRef}
        className="h-full"
        onScrollCapture={handleScroll}
      >
        <div className="pb-4">
          {messages.map((message, index) => {
            const isStreaming = streaming && index === messages.length - 1;

            return (
              <div
                key={`${message.id}-${index}`}
                className={cn(
                  "animate-slideIn",
                  index === messages.length - 1 && "animate-fadeIn"
                )}
                style={{ animationDelay: `${Math.min(index * 50, 500)}ms` }}
              >
                <MessageItem
                  message={message}
                  isStreaming={isStreaming && message.role === 'assistant'}
                />
              </div>
            );
          })}

          {/* Streaming indicator */}
          {streaming && (
            <div className="flex items-center gap-2 px-6 py-4 text-sm text-muted-foreground">
              <div className="flex gap-1">
                <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
              </div>
              <span>AI 正在思考...</span>
            </div>
          )}
        </div>
      </ScrollArea>

      {/* Back to bottom button */}
      {showScrollButton && messages.length > 0 && (
        <Button
          variant="outline"
          size="icon"
          onClick={scrollToBottom}
          className={cn(
            "absolute bottom-6 right-6 w-12 h-12 rounded-full shadow-lg",
            "bg-background/80 backdrop-blur-sm border-border/50",
            "hover:bg-accent hover:scale-110 transition-all duration-200",
            "animate-fadeIn"
          )}
          title="回到底部"
        >
          <ChevronDown className="w-5 h-5" />
        </Button>
      )}
    </div>
  );
};

export default MessageList;
