import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { Menu, Bot } from 'lucide-react';
import { useAppSelector, useAppDispatch } from '../../hooks';
import Sidebar from './Sidebar';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import { fetchModelList, ModelType } from '@/store/modelSlice';
import { setModelConfig } from '@/store/configSlice';
import { setCurrentModel } from '@/store/chatSlice';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { ScrollArea } from '@/components/ui/scroll-area';
import GlobalSidebar from './GlobalSidebar';
import MoreButton from '../common/MoreButton';

const ChatMainLayout: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [modelListOpen, setModelListOpen] = useState(false);
  const { modelConfig } = useAppSelector((state) => state.config);
  const { modelList, loading } = useAppSelector((state) => state.model);
  const { currentChat } = useAppSelector((state) => state.chat);
  const currentModel = currentChat?.currentModel || null;
  const dispatch = useAppDispatch();

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
  const handleFetchModelList = async () => {
    setModelListOpen(true);
    // 同时获取文本和图像模型
    await Promise.all([
      dispatch(fetchModelList(ModelType.TEXT)),
      dispatch(fetchModelList(ModelType.IMAGE))
    ]);
  };

  // 选择模型
  const handleSelectModel = (modelId: number, modelName: string) => {
    // 更新模型配置
    const newModelConfig = {
      ...modelConfig,
      modelName: modelName,
    };

    // 更新configSlice中的modelConfig
    dispatch(setModelConfig(newModelConfig));

    // 更新chatSlice中的currentModel
    dispatch(
      setCurrentModel({
        id: modelId,
        name: modelName,
      })
    );

    setModelListOpen(false);
  };

  return (
    <div className="flex h-screen bg-background">
      <GlobalSidebar />
      {/* Chat Sidebar */}
      <div
        className={cn(
          'relative transition-all duration-300 ease-in-out h-full bg-card shadow-sm animate-slideIn',
          collapsed ? 'w-0' : 'w-64 md:w-80'
        )}
      >
        <div className={cn('h-full', collapsed ? 'invisible' : 'visible')}>
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
              {collapsed ? (
                <Menu className="w-4 h-4" />
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="1rem"
                  height="1rem"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="lucide lucide-arrow-left-to-line-icon lucide-arrow-left-to-line"
                >
                  <path d="M3 19V5" />
                  <path d="m13 6-6 6 6 6" />
                  <path d="M7 12h14" />
                </svg>
              )}
            </Button>
              <>
                <Separator orientation="vertical" className="h-6" />

                <Popover open={modelListOpen} onOpenChange={setModelListOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="flex items-center gap-2 h-9 px-3 border-dashed hover:border-solid transition-all duration-200 hover:shadow-sm"
                      onClick={handleFetchModelList}
                    >
                      <Bot className="w-4 h-4 text-primary" />
                      <span className="text-sm font-medium truncate max-w-[120px] sm:max-w-[160px]">
                        {currentModel ? currentModel.name : '选择模型'}
                      </span>
                      {currentModel && (
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse flex-shrink-0"></div>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-80 p-0" align="start" sideOffset={8}>
                    <div className="p-4">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-semibold text-base">选择模型</h4>
                        {loading && (
                          <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                        )}
                      </div>
                      
                      {loading ? (
                        <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
                          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mb-3"></div>
                          <p className="text-sm">正在加载模型列表...</p>
                        </div>
                      ) : modelList ? (
                        <ScrollArea className="h-[320px] pr-2">
                          {Array.isArray(modelList) ? (
                            // 如果 modelList 是数组，直接渲染模型列表
                            <div className="space-y-1">
                              <div className="flex items-center gap-2 mb-3">
                                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                                <h5 className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                                  模型列表 ({modelList.length})
                                </h5>
                              </div>
                              {modelList.map((model) => (
                                <div
                                  key={model.id}
                                  className={cn(
                                    "group relative flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all duration-200",
                                    "hover:bg-accent hover:shadow-sm border border-transparent hover:border-border",
                                    currentModel?.id === model.id && "bg-primary/10 border-primary/20 shadow-sm"
                                  )}
                                  onClick={() => handleSelectModel(model.id, model.name)}
                                >
                                  <div className="flex-shrink-0">
                                    <Bot className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium truncate">{model.name}</p>
                                  </div>
                                  {currentModel?.id === model.id && (
                                    <div className="flex-shrink-0 w-2 h-2 bg-primary rounded-full"></div>
                                  )}
                                </div>
                              ))}
                            </div>
                          ) : (
                            // 如果 modelList 是对象，只展示 TEXT 和 IMAGE 类型的模型
                            <div className="space-y-4">
                              {/* 文本模型 */}
                              {modelList[ModelType.TEXT] && modelList[ModelType.TEXT].length > 0 && (
                                <div>
                                  <div className="flex items-center gap-2 mb-3">
                                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                                    <h5 className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                                      文本模型 ({modelList[ModelType.TEXT].length})
                                    </h5>
                                  </div>
                                  <div className="space-y-1">
                                    {modelList[ModelType.TEXT].map((model) => (
                                      <div
                                        key={model.id}
                                        className={cn(
                                          "group relative flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all duration-200",
                                          "hover:bg-accent hover:shadow-sm border border-transparent hover:border-border",
                                          currentModel?.id === model.id && "bg-primary/10 border-primary/20 shadow-sm"
                                        )}
                                        onClick={() => handleSelectModel(model.id, model.name)}
                                      >
                                        <div className="flex-shrink-0">
                                          <Bot className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                          <p className="text-sm font-medium truncate">{model.name}</p>
                                        </div>
                                        {currentModel?.id === model.id && (
                                          <div className="flex-shrink-0 w-2 h-2 bg-primary rounded-full"></div>
                                        )}
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              )}
                              
                              {/* 图像模型 */}
                              {modelList[ModelType.IMAGE] && modelList[ModelType.IMAGE].length > 0 && (
                                <div>
                                  <div className="flex items-center gap-2 mb-3">
                                    <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                                    <h5 className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                                      图像模型 ({modelList[ModelType.IMAGE].length})
                                    </h5>
                                  </div>
                                  <div className="space-y-1">
                                    {modelList[ModelType.IMAGE].map((model) => (
                                      <div
                                        key={model.id}
                                        className={cn(
                                          "group relative flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all duration-200",
                                          "hover:bg-accent hover:shadow-sm border border-transparent hover:border-border",
                                          currentModel?.id === model.id && "bg-primary/10 border-primary/20 shadow-sm"
                                        )}
                                        onClick={() => handleSelectModel(model.id, model.name)}
                                      >
                                        <div className="flex-shrink-0">
                                          <Bot className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                          <p className="text-sm font-medium truncate">{model.name}</p>
                                        </div>
                                        {currentModel?.id === model.id && (
                                          <div className="flex-shrink-0 w-2 h-2 bg-primary rounded-full"></div>
                                        )}
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              )}
                              
                              {/* 无模型提示 */}
                              {(!modelList[ModelType.TEXT] || modelList[ModelType.TEXT].length === 0) &&
                               (!modelList[ModelType.IMAGE] || modelList[ModelType.IMAGE].length === 0) && (
                                <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
                                  <Bot className="w-12 h-12 mb-3 opacity-50" />
                                  <p className="text-sm font-medium mb-1">暂无可用模型</p>
                                  <p className="text-xs text-center">请先在平台管理中配置模型</p>
                                </div>
                              )}
                            </div>
                          )}
                        </ScrollArea>
                      ) : (
                        <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
                          <Bot className="w-12 h-12 mb-3 opacity-50" />
                          <p className="text-sm font-medium mb-1">无可用模型</p>
                          <p className="text-xs text-center">请先在平台管理中配置模型</p>
                        </div>
                      )}
                    </div>
                  </PopoverContent>
                </Popover>
              </>
            
          </div>

          {/* Right side of header */}
          <div className="flex items-center gap-2">
            <div className="hidden sm:block text-xs text-muted-foreground">
              {/* 可以添加其他头部右侧内容 */}
            </div>
            <MoreButton />
          </div>
        </header>

        {/* Content area */}
        <main className="flex-1 overflow-y-auto bg-background px-4">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default ChatMainLayout;
