import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, MessageSquare, Sparkles } from 'lucide-react';
import { useAppSelector, useAppDispatch } from '../hooks';
import { createNewChat } from '../store/chatSlice';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { isLoggedIn } = useAppSelector(state => state.user);
  const { chatList, loading } = useAppSelector(state => state.chat);
  
  // Redirect to login if not logged in
  useEffect(() => {
    if (!isLoggedIn) {
      navigate('/login');
    }
  }, [isLoggedIn, navigate]);
  
  // Handle creating a new chat
  const handleNewChat = async () => {
    const resultAction = await dispatch(createNewChat());
    if (createNewChat.fulfilled.match(resultAction)) {
      navigate(`/chat/${resultAction.payload.id}`);
    }
  };
  
  // Handle continuing the last chat
  const handleContinueChat = () => {
    if (chatList.length > 0) {
      navigate(`/chat/${chatList[0].id}`);
    } else {
      handleNewChat();
    }
  };
  
  if (!isLoggedIn) {
    return null; // Will redirect to login
  }
  
  return (
    <div className="flex flex-col items-center justify-center h-full p-6 text-center">
      <div className="max-w-2xl w-full">
        {/* Welcome Header */}
        <div className="mb-12">
          <div className="flex items-center justify-center mb-6">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center shadow-lg">
              <Sparkles className="w-8 h-8 text-white" />
            </div>
          </div>
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
            Welcome to Chat Box
          </h1>
          <p className="text-lg text-muted-foreground leading-relaxed">
            Your personal AI assistant powered by advanced language models.
            Start a new conversation or continue where you left off.
          </p>
        </div>

        {/* Action Cards */}
        <div className="grid gap-4 mb-8">
          <Card className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
            <CardContent className="p-6">
              <Button
                onClick={handleNewChat}
                disabled={loading}
                className="w-full h-14 text-lg bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary shadow-sm hover:shadow-md transition-all duration-200"
              >
                <Plus className="w-5 h-5 mr-3" />
                {loading ? 'Creating...' : 'Start New Chat'}
              </Button>
            </CardContent>
          </Card>

          {chatList.length > 0 && (
            <Card className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
              <CardContent className="p-6">
                <Button
                  variant="outline"
                  onClick={handleContinueChat}
                  className="w-full h-14 text-lg hover:bg-accent transition-all duration-200"
                >
                  <MessageSquare className="w-5 h-5 mr-3" />
                  Continue Last Chat
                </Button>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Stats */}
        <div className="flex items-center justify-center gap-6 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <MessageSquare className="w-4 h-4" />
            <span>{chatList.length} conversation{chatList.length !== 1 ? 's' : ''}</span>
          </div>
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-primary" />
            <span>AI Ready</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
