import React, { useState, useEffect, useRef } from 'react';
import { Outlet } from 'react-router-dom';
import { Menu, Bot } from 'lucide-react';
import { useAppSelector, useAppDispatch } from '../../hooks';
import Sidebar from './Sidebar';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import { fetchModelList } from '@/store/modelSlice';
import { setModelConfig } from '@/store/configSlice';
import { setCurrentModel } from '@/store/chatSlice';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { ScrollArea } from '@/components/ui/scroll-area';

const MainLayout: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [modelListOpen, setModelListOpen] = useState(false);
  const { theme, modelConfig } = useAppSelector(state => state.config);
  const { modelList, loading } = useAppSelector(state => state.model);
  const { currentChat } = useAppSelector(state => state.chat);
  const currentModel = currentChat?.currentModel || null;
  const dispatch = useAppDispatch();
  
  // Apply theme class to document
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  // Handle responsive behavior
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setCollapsed(true);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  // 获取模型列表
  const handleFetchModelList = () => {
    setModelListOpen(true);
    dispatch(fetchModelList());
  };
  
  // 选择模型
  const handleSelectModel = (modelId: number, modelName: string) => {
    // 更新模型配置
    const newModelConfig = {
      ...modelConfig,
      modelName: modelName
    };
    
    // 更新configSlice中的modelConfig
    dispatch(setModelConfig(newModelConfig));
    
    // 更新chatSlice中的currentModel
    dispatch(setCurrentModel({
      id: modelId,
      name: modelName
    }));
    
    setModelListOpen(false);
  };

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <div
        className={cn(
          "relative transition-all duration-300 ease-in-out h-full bg-card shadow-sm",
          collapsed ? "w-0" : "w-64 md:w-80"
        )}
      >
        <div className={cn("h-full", collapsed ? "invisible" : "visible")}>
          <Sidebar />
        </div>
      </div>

      {/* Mobile overlay */}
      {!collapsed && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-10 md:hidden animate-fadeIn"
          onClick={() => setCollapsed(true)}
        />
      )}

      {/* Main content */}
      <div className="flex flex-col flex-1 h-full">
        {/* Header */}
        <header className="flex-shrink-0 h-16 flex items-center justify-between px-4 sm:px-6 border-b bg-card">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setCollapsed(!collapsed)}
              className="h-8 w-8"
            >
              {collapsed ? <Menu className="w-4 h-4" /> : 
              <svg xmlns="http://www.w3.org/2000/svg" width="1rem" height="1rem" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-arrow-left-to-line-icon lucide-arrow-left-to-line"><path d="M3 19V5"/><path d="m13 6-6 6 6 6"/><path d="M7 12h14"/></svg>
              }
            </Button>

            <Separator orientation="vertical" className="h-6" />

            <Popover open={modelListOpen} onOpenChange={setModelListOpen}>
              <PopoverTrigger asChild>
                <div 
                  className="flex items-center gap-2 cursor-pointer hover:bg-accent hover:text-accent-foreground p-2 rounded-md transition-colors"
                  onClick={handleFetchModelList}
                >
                  <Bot className="w-5 h-5 text-primary" />
                  <span className="text-sm sm:text-base font-medium truncate">
                    {currentModel ? currentModel.name : (modelConfig.modelName || 'Chat Assistant')}
                  </span>
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                </div>
              </PopoverTrigger>
              <PopoverContent className="w-64 p-0" align="start">
                <div className="p-2">
                  <h4 className="font-medium mb-2">选择模型</h4>
                  {loading ? (
                    <div className="text-center py-2">加载中...</div>
                  ) : modelList ? (
                    <ScrollArea className="h-[300px]">
                      {Object.entries(modelList).map(([category, models]) => (
                        <div key={category} className="mb-3">
                          <h5 className="text-xs text-muted-foreground mb-1">{category}</h5>
                          {models.map(model => (
                            <div 
                              key={model.id}
                              className="py-1.5 px-2 text-sm rounded-md cursor-pointer hover:bg-accent transition-colors"
                              onClick={() => handleSelectModel(model.id, model.name)}
                            >
                              {model.name}
                            </div>
                          ))}
                        </div>
                      ))}
                    </ScrollArea>
                  ) : (
                    <div className="text-center py-2">无可用模型</div>
                  )}
                </div>
              </PopoverContent>
            </Popover>
          </div>

          {/* Right side of header */}
          <div className="flex items-center gap-2">
            <div className="hidden sm:block text-xs text-muted-foreground">
              {theme === 'dark' ? '🌙' : '☀️'}
            </div>
          </div>
        </header>

        {/* Content area */}
        <main className="flex-1 overflow-hidden bg-background px-4">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
