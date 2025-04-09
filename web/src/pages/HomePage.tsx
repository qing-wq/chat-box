import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Typography, Space } from 'antd';
import { MessageOutlined, PlusOutlined } from '@ant-design/icons';
import { useAppSelector, useAppDispatch } from '../hooks';
import { createNewChat } from '../store/chatSlice';

const { Title, Paragraph } = Typography;

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
      <div className="max-w-xl">
        <Title level={1} className="text-primary mb-6">Welcome to Chat Box</Title>
        
        <Paragraph className="text-lg mb-8 text-light-text dark:text-dark-text">
          Your personal AI assistant powered by advanced language models.
          Start a new conversation or continue where you left off.
        </Paragraph>
        
        <Space direction="vertical" size="large" className="w-full">
          <Button
            type="primary"
            size="large"
            icon={<PlusOutlined />}
            onClick={handleNewChat}
            loading={loading}
            className="h-12 text-lg bg-primary hover:bg-primary-dark"
            block
          >
            Start New Chat
          </Button>
          
          {chatList.length > 0 && (
            <Button
              size="large"
              icon={<MessageOutlined />}
              onClick={handleContinueChat}
              className="h-12 text-lg"
              block
            >
              Continue Last Chat
            </Button>
          )}
        </Space>
      </div>
    </div>
  );
};

export default HomePage;
