import React, { useState, useRef, useEffect } from 'react';
import { Input, Button, Tooltip, Upload, message } from 'antd';
import { SendOutlined, LoadingOutlined, ClearOutlined, PlusOutlined, FileOutlined, GlobalOutlined } from '@ant-design/icons';
import type { UploadFile, UploadProps } from 'antd';
import { useChat, useAppSelector } from '../../hooks';

const { TextArea } = Input;

const ChatInput: React.FC = () => {
  const [messageText, setMessageText] = useState('');
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [webSearchEnabled, setWebSearchEnabled] = useState(false);
  const textAreaRef = useRef<any>(null);
  const { sendMessage } = useChat();
  const { streaming } = useAppSelector(state => state.chat);
  
  // Auto focus the textarea when component mounts
  useEffect(() => {
    if (textAreaRef.current) {
      textAreaRef.current.focus();
    }
  }, []);

  // Handle sending a message
  const handleSend = () => {
    console.log('handleSend called, streaming state:', streaming);
    console.log('Message text:', messageText);
    console.log('File list:', fileList);
    
    if ((messageText.trim() || fileList.length > 0) && !streaming) {
      console.log('Conditions met for sending message');
      
      // Create message content with file attachments if present
      let content = messageText.trim();
      console.log('Trimmed content:', content);
      
      // If there are files, add them to the message
      if (fileList.length > 0) {
        // In a real implementation, you would upload the files to a server
        // and include the file URLs in the message
        const fileNames = fileList.map(file => file.name).join(', ');
        if (content) {
          content += `\n\nAttached files: ${fileNames}`;
        } else {
          content = `Attached files: ${fileNames}`;
        }
        console.log('Content with files:', content);
      }
      
      // Pass web search flag to sendMessage
      const useTools = webSearchEnabled ? ['web_search'] : [];
      console.log('Using tools:', useTools);
      console.log('About to call sendMessage function');
      
      try {
        sendMessage(content, useTools);
        console.log('sendMessage called successfully');
      } catch (error) {
        console.error('Error calling sendMessage:', error);
      }
      
      setMessageText('');
      setFileList([]);
    } else {
      console.log('Conditions not met for sending message');
      if (streaming) {
        console.log('Cannot send: streaming is in progress');
      }
      if (!messageText.trim() && fileList.length === 0) {
        console.log('Cannot send: no message content or files');
      }
    }
  };

  // Handle pressing Enter to send
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // Handle clearing the input
  const handleClear = () => {
    setMessageText('');
    if (textAreaRef.current) {
      textAreaRef.current.focus();
    }
  };
  
  // Handle file upload
  const handleFileChange: UploadProps['onChange'] = ({ fileList: newFileList }) => {
    // Limit to 5 files
    if (newFileList.length > 5) {
      message.warning('You can only upload up to 5 files');
      return;
    }
    setFileList(newFileList);
  };
  
  // Handle removing all files
  const handleRemoveAllFiles = () => {
    setFileList([]);
  };

  return (
    <div className="p-4 border-t border-light-border dark:border-dark-border bg-light-surface dark:bg-dark-surface">
      <div className="max-w-3xl mx-auto">
        {/* File list display */}
        {fileList.length > 0 && (
          <div className="mb-2 flex flex-wrap gap-2">
            {fileList.map(file => (
              <div key={file.uid} className="flex items-center bg-gray-100 dark:bg-gray-700 rounded-lg px-2 py-1">
                <FileOutlined className="mr-1 text-gray-600 dark:text-gray-300" />
                <span className="text-xs truncate max-w-[150px]">{file.name}</span>
              </div>
            ))}
            {fileList.length > 0 && (
              <Button 
                size="small" 
                type="text" 
                onClick={handleRemoveAllFiles}
                className="text-xs text-gray-500 hover:text-red-500"
              >
                Clear all
              </Button>
            )}
          </div>
        )}
        
        <div className="flex items-end gap-2">
          <TextArea
            ref={textAreaRef}
            value={messageText}
            onChange={(e) => setMessageText(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type a message..."
            autoSize={{ minRows: 1, maxRows: 6 }}
            disabled={streaming}
            className="rounded-lg resize-none bg-light-bg dark:bg-dark-bg text-light-text dark:text-dark-text"
          />
          
          <div className="flex gap-2">
            {/* File upload button */}
            <Tooltip title="Add files">
              <Upload
                accept=".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png"
                fileList={fileList}
                onChange={handleFileChange}
                showUploadList={false}
                multiple={true}
                beforeUpload={() => false} // Prevent auto upload
              >
                <Button
                  type="text"
                  icon={<PlusOutlined />}
                  disabled={streaming}
                  className="text-gray-500 hover:text-primary"
                />
              </Upload>
            </Tooltip>
            
            {/* Web search toggle */}
            <Tooltip title={webSearchEnabled ? "Web search enabled" : "Enable web search"}>
              <Button
                type="text"
                icon={<GlobalOutlined className={webSearchEnabled ? "text-primary" : "text-gray-500"} />}
                onClick={() => setWebSearchEnabled(!webSearchEnabled)}
                disabled={streaming}
                className={webSearchEnabled ? "text-primary" : "text-gray-500 hover:text-primary"}
              />
            </Tooltip>
            
            {messageText.trim() && (
              <Tooltip title="Clear">
                <Button
                  type="text"
                  icon={<ClearOutlined />}
                  onClick={handleClear}
                  className="text-gray-500 hover:text-primary"
                />
              </Tooltip>
            )}
            
            <Tooltip title={streaming ? 'Generating response...' : 'Send message'}>
              <Button
                type="primary"
                icon={streaming ? <LoadingOutlined /> : <SendOutlined />}
                onClick={handleSend}
                disabled={(!messageText.trim() && fileList.length === 0) || streaming}
                className="bg-primary hover:bg-primary-dark"
              />
            </Tooltip>
          </div>
        </div>
        
        <div className="mt-2 text-xs text-gray-500 text-center">
          Press Enter to send, Shift+Enter for new line
        </div>
      </div>
    </div>
  );
};

export default ChatInput;
