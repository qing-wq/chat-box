import React from 'react';
import { Avatar, Tooltip, Button } from 'antd';
import { UserOutlined, RobotOutlined, CopyOutlined } from '@ant-design/icons';
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { Message } from '../../types';
import 'katex/dist/katex.min.css';

interface MessageItemProps {
  message: Message;
  isStreaming?: boolean;
}

const MessageItem: React.FC<MessageItemProps> = ({ message, isStreaming = false }) => {
  const isUser = message.role === 'user';
  
  const copyToClipboard = () => {
    navigator.clipboard.writeText(message.content);
  };

  return (
    <div className={`py-6 px-4 ${isUser ? 'bg-light-bg dark:bg-dark-bg' : 'bg-light-surface dark:bg-dark-surface'}`}>
      <div className="max-w-3xl mx-auto">
        <div className="flex items-start gap-4">
          {/* Avatar */}
          <Avatar 
            icon={isUser ? <UserOutlined /> : <RobotOutlined />}
            className={isUser ? 'bg-blue-500' : 'bg-primary'}
          />
          
          {/* Message content */}
          <div className="flex-1 overflow-hidden">
            {/* Role label */}
            <div className="text-sm font-medium mb-2 text-light-text dark:text-dark-text">
              {isUser ? 'You' : 'Assistant'}
            </div>
            
            {/* Message content with markdown support */}
            <div className="prose dark:prose-invert max-w-none">
              {isStreaming && !isUser && (
                <div className="animate-pulse">
                  {message.content || 'Thinking...'}
                </div>
              )}
              
              {(!isStreaming || isUser) && (
                <ReactMarkdown
                  remarkPlugins={[remarkMath]}
                  rehypePlugins={[rehypeKatex]}
                  components={{
                    code({ node, inline, className, children, ...props }) {
                      const match = /language-(\w+)/.exec(className || '');
                      return !inline && match ? (
                        <SyntaxHighlighter
                          style={vscDarkPlus}
                          language={match[1]}
                          PreTag="div"
                          {...props}
                        >
                          {String(children).replace(/\n$/, '')}
                        </SyntaxHighlighter>
                      ) : (
                        <code className={className} {...props}>
                          {children}
                        </code>
                      );
                    }
                  }}
                >
                  {message.content}
                </ReactMarkdown>
              )}
            </div>
          </div>
          
          {/* Actions */}
          {!isUser && !isStreaming && (
            <div>
              <Tooltip title="Copy to clipboard">
                <Button 
                  icon={<CopyOutlined />} 
                  type="text"
                  onClick={copyToClipboard}
                  className="text-gray-500 hover:text-primary"
                />
              </Tooltip>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MessageItem;
