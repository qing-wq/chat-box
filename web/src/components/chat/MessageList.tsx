import React, { useRef, useEffect, useState } from 'react';
import { FixedSizeList as List } from 'react-window';
import AutoSizer from 'react-virtualized-auto-sizer';
import { Button, Tooltip } from 'antd';
import { DownOutlined } from '@ant-design/icons';
import { Message } from '../../types';
import MessageItem from './MessageItem';
import { useAppSelector } from '../../hooks';

interface MessageListProps {
  messages: Message[];
}

const MessageList: React.FC<MessageListProps> = ({ messages }) => {
  const listRef = useRef<List>(null);
  const { streaming } = useAppSelector(state => state.chat);
  const [showScrollButton, setShowScrollButton] = useState(false);

  // Scroll to bottom when new messages are added or when streaming
  useEffect(() => {
    if (listRef.current && messages.length > 0) {
      listRef.current.scrollToItem(messages.length - 1, 'end');
      setShowScrollButton(false);
    }
  }, [messages, streaming]);
  
  // Handle scroll events to show/hide the scroll button
  const handleScroll = ({ scrollOffset, scrollUpdateWasRequested }: { scrollOffset: number, scrollUpdateWasRequested: boolean }) => {
    if (!scrollUpdateWasRequested && listRef.current) {
      const listHeight = (listRef.current as any)._outerRef.clientHeight;
      const totalHeight = messages.length * 150; // Approximate total height
      const distanceFromBottom = totalHeight - scrollOffset - listHeight;
      
      // Show button if we're not at the bottom
      setShowScrollButton(distanceFromBottom > 100);
    }
  };
  
  // Scroll to bottom when the button is clicked
  const scrollToBottom = () => {
    if (listRef.current && messages.length > 0) {
      listRef.current.scrollToItem(messages.length - 1, 'end');
      setShowScrollButton(false);
    }
  };

  if (messages.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-8 text-center">
        <div className="max-w-2xl">
          <h2 className="text-2xl font-bold mb-4 text-light-text dark:text-dark-text">Welcome to Chat Box</h2>
          <p className="text-lg mb-6 text-gray-600 dark:text-gray-300">
            Ask me anything! I can help with coding questions, explain concepts, write content, and much more.  
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            <div className="p-4 border border-light-border dark:border-dark-border rounded-lg bg-light-surface dark:bg-dark-surface">
              <h3 className="font-medium mb-2 text-light-text dark:text-dark-text">Examples</h3>
              <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-2">
                <li>"Explain how React hooks work"</li>
                <li>"Write a function to find prime numbers in Python"</li>
                <li>"What are the best practices for API design?"</li>
              </ul>
            </div>
            
            <div className="p-4 border border-light-border dark:border-dark-border rounded-lg bg-light-surface dark:bg-dark-surface">
              <h3 className="font-medium mb-2 text-light-text dark:text-dark-text">Capabilities</h3>
              <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-2">
                <li>Remembers previous messages in the conversation</li>
                <li>Supports code syntax highlighting</li>
                <li>Renders Markdown and LaTeX formulas</li>
              </ul>
            </div>
          </div>
          
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Type a message below to start chatting!  
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full relative">
      <AutoSizer>
        {({ height, width }) => (
          <List
            ref={listRef}
            height={height}
            width={width}
            itemCount={messages.length}
            itemSize={150} // Approximate height, will adjust based on content
            overscanCount={5} // Number of items to render above/below the visible area
            onScroll={handleScroll}
            itemData={{
              messages,
              streaming
            }}
          >
            {({ index, style, data }) => {
              const message = data.messages[index];
              const isStreaming = data.streaming && index === data.messages.length - 1;
              
              return (
                <div style={style}>
                  <MessageItem 
                    message={message} 
                    isStreaming={isStreaming && message.role === 'assistant'} 
                  />
                </div>
              );
            }}
          </List>
        )}
      </AutoSizer>
      
      {/* Back to bottom button */}
      {showScrollButton && messages.length > 0 && (
        <Tooltip title="Back to bottom">
          <Button
            type="primary"
            shape="circle"
            icon={<DownOutlined />}
            onClick={scrollToBottom}
            className="absolute bottom-4 right-4 shadow-md bg-primary hover:bg-primary-dark"
            size="large"
          />
        </Tooltip>
      )}
    </div>
  );
};

export default MessageList;
