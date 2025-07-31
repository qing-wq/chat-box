import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Settings,
  LogOut,
  Sun,
  Moon,
  Bot,
  Cpu,
  Home,
  MessageSquare,
  Database
} from 'lucide-react';
import { useAppSelector, useAppDispatch } from '../../hooks';
import { logout } from '../../store/userSlice';
import { setTheme } from '../../store/configSlice';
import { ThemeMode } from '../../types';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

const GlobalSidebar: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { theme } = useAppSelector(state => state.config);
  
  // 检查当前路径是否匹配指定路径
  const isActive = (path: string) => {
    // 聊天相关路径特殊处理
    if (path === '/') {
      return location.pathname === '/' || location.pathname.startsWith('/chat');
    }
    
    // 其他路径需要精确匹配，避免部分匹配导致多个按钮同时高亮
    // 例如：/settings 不应该匹配 /
    return location.pathname === path || 
           (location.pathname.startsWith(path + '/') && path !== '/');
  };

  // Handle logout
  const handleLogout = async () => {
    await dispatch(logout());
    navigate('/login');
  };

  // Handle theme toggle
  const handleThemeToggle = () => {
    const newTheme: ThemeMode = theme === 'light' ? 'dark' : 'light';
    dispatch(setTheme(newTheme));
  };

  return (
    <div className="flex flex-col h-full w-16 bg-card border-r items-center py-4 justify-between">
      {/* Top section with logo */}
      <div className="flex flex-col items-center space-y-4">
        <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10 mb-2">
          <Bot className="w-6 h-6 text-primary" />
        </div>
        
        <Separator className="w-8" />
        
        {/* Navigation icons */}

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => navigate('/')}
                className={cn(
                  "h-10 w-10 rounded-lg hover:bg-accent",
                  isActive('/') && "bg-primary/20 text-primary shadow-sm"
                )}
              >
                <MessageSquare className="w-5 h-5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right">
              <p>Chats</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => navigate('/platforms')}
                className={cn(
                  "h-10 w-10 rounded-lg hover:bg-accent",
                  isActive('/platforms') && "bg-primary/20 text-primary shadow-sm"
                )}
              >
                <Cpu className="w-5 h-5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right">
              <p>Model Management</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => navigate('/knowledge-base')}
                className={cn(
                  "h-10 w-10 rounded-lg hover:bg-accent",
                  isActive('/knowledge-base') && "bg-primary/20 text-primary shadow-sm"
                )}
              >
                <Database className="w-5 h-5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right">
              <p>Knowledge Base</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => navigate('/settings')}
                className={cn(
                  "h-10 w-10 rounded-lg hover:bg-accent",
                  isActive('/settings') && "bg-primary/20 text-primary shadow-sm"
                )}
              >
                <Settings className="w-5 h-5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right">
              <p>Settings</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
      
      {/* Bottom section with theme toggle and logout */}
      <div className="flex flex-col items-center space-y-3">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleThemeToggle}
                className="h-10 w-10 rounded-lg hover:bg-accent"
              >
                {theme === 'light' ? (
                  <Moon className="w-5 h-5" />
                ) : (
                  <Sun className="w-5 h-5" />
                )}
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right">
              <p>{theme === 'light' ? 'Dark Mode' : 'Light Mode'}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleLogout}
                className="h-10 w-10 rounded-lg hover:bg-destructive/10 hover:text-destructive"
              >
                <LogOut className="w-5 h-5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right">
              <p>Logout</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        
        {/* User avatar */}
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary via-primary/80 to-primary/60 flex items-center justify-center cursor-pointer mt-2">
                <span className="text-sm font-semibold text-white">U</span>
              </div>
            </TooltipTrigger>
            <TooltipContent side="right">
              <p>User Profile</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </div>
  );
};

export default GlobalSidebar;