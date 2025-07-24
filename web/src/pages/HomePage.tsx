import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, MessageSquare, Sparkles } from 'lucide-react';
import { useAppSelector, useAppDispatch } from '../hooks';
import { createNewChat } from '../store/chatSlice';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import ChatInput from '../components/chat/ChatInput';

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { isLoggedIn } = useAppSelector((state) => state.user);
  const { loading } = useAppSelector((state) => state.chat);

  // 只在用户发送第一条消息时新建对话
  const handleSendFirstMessage = async (
    content: string,
    useTools: string[] = []
  ) => {
    const resultAction = await dispatch(createNewChat());
    if (createNewChat.fulfilled.match(resultAction)) {
      const chatId = resultAction.payload.uuid;
      // 跳转到新对话页面
      navigate(`/chat/${chatId}`);
      // 这里可以通过全局事件或 context 通知 ChatPage 自动发送第一条消息
      // 或者在 ChatPage 监听 location state 进行自动发送
      // 这里建议用 location state 传递
      navigate(`/chat/${chatId}`, {
        state: { firstMessage: content, useTools },
      });
    }
  };

  if (!isLoggedIn) {
    return null; // Will redirect to login
  }

  return (
    <div className="flex flex-col h-full bg-background">
      <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
        <div className="max-w-2xl w-full">
          {/* Welcome Header */}
          <div className="mb-12">
            <div className="flex items-center justify-center mb-6">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center shadow-lg">
                <Sparkles className="w-8 h-8 text-white" />
              </div>
            </div>
            <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
              欢迎使用 AI 聊天助手
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed">
              我可以帮助您解答问题、编写代码、解释概念、创作内容等。让我们开始对话吧！
            </p>
          </div>

          {/* 示例卡片 横向排列 */}
          <div className="grid grid-cols-3 gap-4 mb-8 items-stretch">
            <Card className="flex flex-col justify-between group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 h-full">
              <CardContent className="p-6 flex flex-col items-center">
                <div className="flex items-center mb-4">
                  <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center mr-3">
                    <MessageSquare className="w-5 h-5 text-blue-500" />
                  </div>
                  <h3 className="font-semibold">智能对话</h3>
                </div>
                <ul className="text-sm text-muted-foreground space-y-2 text-center">
                  <li>"解释React Hooks的工作原理"</li>
                  <li>"什么是机器学习？"</li>
                  <li>"如何提高代码质量？"</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="flex flex-col justify-between group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 h-full">
              <CardContent className="p-6 flex flex-col items-center">
                <div className="flex items-center mb-4">
                  <div className="w-10 h-10 rounded-lg bg-green-500/10 flex items-center justify-center mr-3">
                    <Plus className="w-5 h-5 text-green-500" />
                  </div>
                  <h3 className="font-semibold">代码助手</h3>
                </div>
                <ul className="text-sm text-muted-foreground space-y-2 text-center">
                  <li>"用Python写一个排序算法"</li>
                  <li>"调试这段JavaScript代码"</li>
                  <li>"优化SQL查询性能"</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="flex flex-col justify-between group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 h-full">
              <CardContent className="p-6 flex flex-col items-center">
                <div className="flex items-center mb-4">
                  <div className="w-10 h-10 rounded-lg bg-purple-500/10 flex items-center justify-center mr-3">
                    <Sparkles className="w-5 h-5 text-purple-500" />
                  </div>
                  <h3 className="font-semibold">数学计算</h3>
                </div>
                <ul className="text-sm text-muted-foreground space-y-2 text-center">
                  <li>"计算复合利率"</li>
                  <li>"解这个微分方程"</li>
                  <li>"统计数据分析"</li>
                </ul>
              </CardContent>
            </Card>
          </div>

          {/* 提示 */}
          <div className="flex items-center justify-center gap-6 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <MessageSquare className="w-4 h-4" />
              <span>在下方输入框开始对话</span>
            </div>
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-primary" />
              <span>AI Ready</span>
            </div>
          </div>
        </div>
      </div>
      {/* Chat input 保持和旧对话一致 */}
      <div className="flex-shrink-0 bg-card">
        <div className="max-w-4xl mx-auto">
          <ChatInput onSend={handleSendFirstMessage} />
        </div>
      </div>
    </div>
  );
};

export default HomePage;
