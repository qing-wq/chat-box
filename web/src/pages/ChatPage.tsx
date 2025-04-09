import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Spin, Alert } from 'antd';
import { useAppSelector, useAppDispatch } from '../hooks';
import { fetchChatDetail } from '../store/chatSlice';
import MessageList from '../components/chat/MessageList';
import ChatInput from '../components/chat/ChatInput';
import ApiConfigAlert from '../components/common/ApiConfigAlert';

const ChatPage: React.FC = () => {
  const { chatId } = useParams<{ chatId: string }>();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { currentChat, loading, error } = useAppSelector(state => state.chat);
  const { isLoggedIn } = useAppSelector(state => state.user);

  // Redirect to login if not logged in
  useEffect(() => {
    if (!isLoggedIn) {
      navigate('/login');
    }
  }, [isLoggedIn, navigate]);

  // Fetch chat details when chat ID changes
  useEffect(() => {
    if (chatId && isLoggedIn) {
      dispatch(fetchChatDetail(Number(chatId)));
    }
  }, [chatId, dispatch, isLoggedIn]);

  if (!isLoggedIn) {
    return null; // Will redirect to login
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Spin size="large" tip="Loading chat..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4">
        <Alert
          message="Error"
          description={error}
          type="error"
          showIcon
        />
      </div>
    );
  }

  if (!currentChat) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-4 text-center">
        <h2 className="text-xl font-medium mb-2 text-light-text dark:text-dark-text">No chat selected</h2>
        <p className="text-gray-500 mb-4">Select a chat from the sidebar or create a new one to get started.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      {/* 显示API配置提醒 */}
      <div className="p-4">
        <ApiConfigAlert />
      </div>
      
      {currentChat ? (
        <>
          {/* Chat header */}
          <div className="p-4 border-b border-light-border dark:border-dark-border bg-light-surface dark:bg-dark-surface">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-xl font-medium text-light-text dark:text-dark-text truncate">
                {currentChat.title || 'New Chat'}
              </h2>
            </div>
          </div>
          
          {/* Message list */}
          <div className="flex-1 overflow-y-auto p-4">
            <MessageList messages={currentChat.messageList} />
          </div>
          
          {/* Chat input */}
          <div className="p-4 border-t border-gray-200 dark:border-gray-700">
            <ChatInput />
          </div>
        </>
      ) : (
        <div className="flex items-center justify-center h-full">
          <p className="text-lg text-gray-500">Select a chat or create a new one</p>
        </div>
      )}
    </div>
  );
};

export default ChatPage;
