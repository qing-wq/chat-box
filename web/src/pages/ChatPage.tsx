import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Loader2, MessageSquare } from 'lucide-react';
import { useAppSelector, useAppDispatch } from '../hooks';
import { fetchChatDetail } from '../store/chatSlice';
import MessageList from '../components/chat/MessageList';
import ChatInput from '../components/chat/ChatInput';
import ModelConfigAlert from '../components/common/ModelConfigAlert';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

const ChatPage: React.FC = () => {
  const { chatId } = useParams<{ chatId: string }>();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { currentChat, loading, error } = useAppSelector((state) => state.chat);
  const { isLoggedIn } = useAppSelector((state) => state.user);

  // Redirect to login if not logged in
  useEffect(() => {
    if (!isLoggedIn) {
      navigate('/login');
    }
  }, [isLoggedIn, navigate]);

  // Fetch chat details when chat ID changes
  useEffect(() => {
    if (chatId && isLoggedIn) {
      dispatch(fetchChatDetail(chatId));
    }
  }, [chatId, dispatch, isLoggedIn]);

  if (!isLoggedIn) {
    return null; // Will redirect to login
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
          <span className="text-sm text-muted-foreground">Loading chat...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <Card className="max-w-2xl mx-auto">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 text-destructive">
              <div className="w-5 h-5 rounded-full bg-destructive/10 flex items-center justify-center">
                <span className="text-xs">!</span>
              </div>
              <div>
                <h3 className="font-semibold">Error</h3>
                <p className="text-sm text-muted-foreground mt-1">{error}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!currentChat) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-6 text-center">
        <div className="max-w-lg">
          <MessageSquare className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
          <h2 className="text-2xl font-semibold mb-3">选择一个对话</h2>
          <p className="text-muted-foreground mb-6">
            从侧边栏选择一个对话或创建新对话开始聊天。
          </p>
          <ModelConfigAlert />
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-background">
      {/* Chat header */}
      <div className="flex-shrink-0 px-4 py-3 sm:px-6 border-b bg-card shadow-sm z-10">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <h1 className="text-lg sm:text-xl font-medium truncate">
            {currentChat.title || '新对话'}
          </h1>
          <div className="text-sm text-muted-foreground ml-4">
            {currentChat.messageList?.length || 0} 条消息
          </div>
        </div>
      </div>

      {/* 模型配置提醒 */}
      <div className="flex-shrink-0 px-4 sm:px-6 py-2">
        <div className="max-w-4xl mx-auto">
          <ModelConfigAlert />
        </div>
      </div>

      {/* Message list */}
      <div className="flex-1 min-h-0">
        <div className="h-full w-full max-w-[800px] mx-auto">
          <MessageList messages={currentChat.messageList || []} />
        </div>
      </div>

      <Separator />

      {/* Chat input */}
      <div className="flex-shrink-0 bg-card">
        <div className="max-w-4xl mx-auto">
          <ChatInput />
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
