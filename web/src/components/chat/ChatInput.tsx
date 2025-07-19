import React, { useState, useRef, useEffect } from 'react';
import { Send, Loader2, X, Plus, File, Globe } from 'lucide-react';
import { useChat, useAppSelector } from '../../hooks';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';

interface FileItem {
  uid: string;
  name: string;
  status?: string;
}

const ChatInput: React.FC = () => {
  const [messageText, setMessageText] = useState('');
  const [fileList, setFileList] = useState<FileItem[]>([]);
  const [webSearchEnabled, setWebSearchEnabled] = useState(false);
  const textAreaRef = useRef<HTMLTextAreaElement>(null);
  const { sendMessage } = useChat();
  const { streaming } = useAppSelector((state) => state.chat);

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
        const fileNames = fileList.map((file) => file.name).join(', ');
        if (content) {
          content += `\n\n附件文件：${fileNames}`;
        } else {
          content = `附件文件：${fileNames}`;
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
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    // Limit to 5 files
    if (files.length > 5) {
      alert('最多只能上传5个文件');
      return;
    }

    const newFileList: FileItem[] = Array.from(files).map((file, index) => ({
      uid: `${Date.now()}-${index}`,
      name: file.name,
      status: 'done',
    }));

    setFileList((prev) => [...prev, ...newFileList]);
  };

  // Handle removing all files
  const handleRemoveAllFiles = () => {
    setFileList([]);
  };

  return (
    <div className="p-4 sm:p-6">
      {/* File list display */}
      {fileList.length > 0 && (
        <div className="mb-4 p-3 bg-muted rounded-lg border">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">
              附件文件 ({fileList.length})
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleRemoveAllFiles}
              className="h-6 text-xs text-muted-foreground hover:text-destructive"
            >
              清除全部
            </Button>
          </div>
          <div className="flex flex-wrap gap-2">
            {fileList.map((file) => (
              <div
                key={file.uid}
                className="flex items-center bg-background rounded-md px-3 py-2 border shadow-sm"
              >
                <File className="w-4 h-4 mr-2 text-blue-500" />
                <span className="text-sm truncate max-w-[120px]">
                  {file.name}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="flex items-end gap-3">
        {/* 输入框区域 */}
        <div className="flex-1">
          <Textarea
            ref={textAreaRef}
            value={messageText}
            onChange={(e) => setMessageText(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={streaming ? '正在生成回复...' : '输入消息...'}
            disabled={streaming}
            className="min-h-[40px] max-h-[200px] resize-none rounded-xl transition-all duration-200"
            rows={1}
          />
        </div>

        {/* 按钮组 */}
        <div className="flex items-center gap-2">
          {/* File upload button */}
          <div className="relative">
            <input
              type="file"
              accept=".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png"
              multiple
              onChange={handleFileChange}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              disabled={streaming}
            />
            <Button
              variant="ghost"
              size="icon"
              disabled={streaming}
              className="h-10 w-10 text-muted-foreground hover:text-primary"
              title="添加文件"
            >
              <Plus className="w-4 h-4" />
            </Button>
          </div>

          {/* Web search toggle */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setWebSearchEnabled(!webSearchEnabled)}
            disabled={streaming}
            className={cn(
              'h-10 w-10 transition-all duration-200',
              webSearchEnabled
                ? 'text-primary bg-primary/10'
                : 'text-muted-foreground hover:text-primary',
            )}
            title={webSearchEnabled ? '已启用网络搜索' : '启用网络搜索'}
          >
            <Globe className="w-4 h-4" />
          </Button>

          {/* Clear button */}
          {messageText.trim() && (
            <Button
              variant="ghost"
              size="icon"
              onClick={handleClear}
              className="h-10 w-10 text-muted-foreground hover:text-orange-500"
              title="清除"
            >
              <X className="w-4 h-4" />
            </Button>
          )}

          {/* Send button */}
          <Button
            onClick={handleSend}
            disabled={
              (!messageText.trim() && fileList.length === 0) || streaming
            }
            className="h-10 w-10 rounded-xl transition-all duration-200 hover:scale-105"
            size="icon"
            title={streaming ? '正在生成回复...' : '发送消息'}
          >
            {streaming ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Send className="w-4 h-4" />
            )}
          </Button>
        </div>
      </div>

      {/* 提示文本 */}
      <div className="mt-3 text-center">
        <span className="text-xs text-muted-foreground">
          按 Enter 发送，Shift+Enter 换行
        </span>
        {webSearchEnabled && (
          <span className="ml-3 text-xs text-primary bg-primary/10 px-2 py-1 rounded-full">
            🌐 网络搜索已启用
          </span>
        )}
      </div>
    </div>
  );
};

export default ChatInput;
