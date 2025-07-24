import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Plus,
  Trash2,
  Edit3,
  MoreHorizontal,
  MessageSquare,
  Clock,
  Sparkles,
} from 'lucide-react';
import { useAppSelector, useAppDispatch } from '../../hooks';

import {
  fetchChatList,
  deleteChat,
  updateChatMessages,
  setPendingChat, // 新增
} from '../../store/chatSlice';

import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

const Sidebar: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const { chatId } = useParams<{ chatId: string }>(); //当前的路由上的uuid
  const { chatList, loading } = useAppSelector((state) => state.chat);

  const [editingChatUuid, setEditingChatUuid] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState('');

  // Fetch chat list on component mount
  useEffect(() => {
    dispatch(fetchChatList());
  }, [dispatch]);

  // Handle creating a new chat
  const handleNewChat = () => {
    navigate('/'); // 只跳转到首页
  };

  // Handle selecting a chat
  const handleSelectChat = (uuid: string) => {
    navigate(`/chat/${uuid}`);
  };

  // Handle deleting a chat
  const handleDeleteChat = async (uuid: string, e: React.MouseEvent) => {
    e.stopPropagation();
    await dispatch(deleteChat(uuid));

    // If the deleted chat is the current one, navigate to the first available chat or home
    if (chatId === uuid) {
      if (chatList.length > 1) {
        const nextChat = chatList.find((chat) => chat.uuid !== uuid);
        if (nextChat) {
          navigate(`/chat/${nextChat.uuid}`);
        } else {
          navigate('/');
        }
      } else {
        navigate('/');
      }
    }
  };

  // Handle editing a chat title
  const handleEditClick = (uuid: string, title: string) => {
    setEditingChatUuid(uuid);
    setEditTitle(title);
  };

  const handleEditSubmit = async (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && editingChatUuid && editTitle.trim()) {
      await dispatch(
        updateChatMessages({
          uuid: editingChatUuid,
          title: editTitle.trim(),
        })
      );

      setEditingChatUuid(null);
      setEditTitle('');
    }
  };

  const handleEditCancel = () => {
    setEditingChatUuid(null);
    setEditTitle('');
  };

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  return (
    <div className="flex flex-col h-full bg-card border-r">
      {/* Header with Brand */}
      <div className="p-4 space-y-4">
        <div className="flex items-center gap-2 px-2">
          <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary/10">
            <MessageSquare className="w-5 h-5 text-primary" />
          </div>
          <div className="flex flex-col">
            <h1 className="text-sm font-semibold">Chats</h1>
            <p className="text-xs text-muted-foreground">Your conversations</p>
          </div>
        </div>

        <Button
          onClick={handleNewChat}
          className={cn(
            'w-full h-10 bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary shadow-sm',
            'hover:shadow-md hover:scale-[1.02] transition-all duration-200',
            'disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100'
          )}
          disabled={loading}
        >
          <Plus
            className={cn(
              'w-4 h-4 mr-2 transition-transform duration-200',
              loading && 'animate-spin'
            )}
          />
          {loading ? 'Creating...' : 'New Chat'}
        </Button>
      </div>

      <Separator className="mx-4" />

      {/* Chat list */}
      <ScrollArea className="flex-1 px-3">
        <div className="space-y-2 py-3">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-12 space-y-3">
              <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
              <div className="text-sm text-muted-foreground">
                Loading chats...
              </div>
            </div>
          ) : chatList.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-muted/50 flex items-center justify-center">
                <MessageSquare className="w-6 h-6 text-muted-foreground" />
              </div>
              <div className="space-y-1">
                <div className="text-sm font-medium">No chats yet</div>
                <div className="text-xs text-muted-foreground">
                  Start a conversation to see it here
                </div>
              </div>
            </div>
          ) : (
            <>
              <div className="text-xs font-medium text-muted-foreground px-2 py-1">
                Recent Chats
              </div>
              {chatList.map((chat, index) => (
                <div
                  key={chat.uuid}
                  className={cn(
                    'group relative flex items-start gap-3 rounded-xl px-3 py-3 cursor-pointer transition-all duration-200 animate-slideIn',
                    'hover:bg-accent/50 hover:shadow-sm hover:scale-[1.02]',
                    chatId === chat.uuid &&
                      'bg-primary/10 border border-primary/20 shadow-sm scale-[1.02]'
                  )}
                  style={{ animationDelay: `${index * 50}ms` }}
                  onClick={() => handleSelectChat(chat.uuid)}
                >
                  {/* Chat Icon */}
                  <div
                    className={cn(
                      'flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center mt-0.5',
                      chatId === chat.uuid
                        ? 'bg-primary/20 text-primary'
                        : 'bg-muted text-muted-foreground'
                    )}
                  >
                    <MessageSquare className="w-4 h-4" />
                  </div>

                  <div className="flex-1 min-w-0">
                    {editingChatUuid === chat.uuid ? (
                      <Input
                        value={editTitle}
                        onChange={(e) => setEditTitle(e.target.value)}
                        onKeyDown={handleEditSubmit}
                        onBlur={handleEditCancel}
                        className="h-7 text-sm border-primary/50"
                        autoFocus
                      />
                    ) : (
                      <div className="space-y-1">
                        <div className="font-medium text-sm leading-tight truncate">
                          {chat.title || 'New Chat'}
                        </div>
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Clock className="w-3 h-3" />
                          {formatDate(chat.updateTime || chat.createTime)}
                        </div>
                      </div>
                    )}
                  </div>

                  {editingChatUuid !== chat.uuid && (
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 opacity-0 group-hover:opacity-100 transition-all duration-200 hover:bg-accent"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <MoreHorizontal className="w-3.5 h-3.5" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-40">
                        <DropdownMenuItem
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEditClick(chat.uuid, chat.title);
                          }}
                          className="text-sm"
                        >
                          <Edit3 className="w-4 h-4 mr-2" />
                          Rename
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteChat(chat.uuid, e);
                          }}
                          className="text-destructive text-sm"
                        >
                          <Trash2 className="w-4 h-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  )}
                </div>
              ))}
            </>
          )}
        </div>
      </ScrollArea>

      {/* Stats */}
      <div className="p-4">
        <div className="flex items-center justify-between text-xs px-3 py-2 rounded-lg bg-muted/20">
          <div className="flex items-center gap-1.5 text-muted-foreground">
            <MessageSquare className="w-3 h-3" />
            <span className="font-medium">{chatList.length}</span>
            <span>chat{chatList.length !== 1 ? 's' : ''}</span>
          </div>
          <div className="flex items-center gap-1.5 text-primary">
            <Sparkles className="w-3 h-3 animate-pulse" />
            <span className="font-medium">AI Ready</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
