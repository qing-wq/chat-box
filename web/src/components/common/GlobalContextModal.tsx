import React, { useState, useEffect } from 'react';
import { useAppSelector, useAppDispatch } from '../../hooks';
import { updateChatMessages, fetchChatDetail } from '@/store/chatSlice';
import { updateGlobalSettings } from '@/store/settingsSlice';
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider,
} from '@/components/ui/tooltip';

interface Props {
  open: boolean;
  onClose: () => void;
}

const defaultSystemMessage = '这里是默认系统消息内容，可以自定义。';

const GlobalContextModal: React.FC<Props> = ({ open, onClose }) => {
  const dispatch = useAppDispatch();
  const currentChat = useAppSelector((state) => state.chat.currentChat);
  const { loading, error } = useAppSelector((state) => state.chat);
  const globalSettings = useAppSelector((state) => state.settings);

  const [temperature, setTemperature] = useState(globalSettings.temperature);
  const [contextWindow, setContextWindow] = useState(
    globalSettings.contextWindow
  );
  const [streamOutput, setStreamOutput] = useState(globalSettings.streamOutput);
  const [maxTokenEnabled, setMaxTokenEnabled] = useState(
    globalSettings.maxTokens !== null
  );
  const [maxTokens, setMaxTokens] = useState<number | null>(
    globalSettings.maxTokens
  );
  const [systemMessage, setSystemMessage] = useState<string>(
    globalSettings.systemMessage
  );
  const [isSaving, setIsSaving] = useState(false);

  // 当弹窗打开时，获取最新的对话详情（只在没有当前数据时）
  useEffect(() => {
    if (
      open &&
      currentChat?.conversation?.uuid &&
      !currentChat.conversation.systemMessage &&
      !currentChat.conversation.modelParams
    ) {
      dispatch(fetchChatDetail(currentChat.conversation.uuid));
    }
  }, [
    open,
    currentChat?.conversation?.uuid,
    currentChat?.conversation?.systemMessage,
    currentChat?.conversation?.modelParams,
    dispatch,
  ]);

  // 当获取到对话详情后，更新表单数据
  useEffect(() => {
    if (currentChat?.conversation) {
      const conversation = currentChat.conversation;

      // 设置系统消息
      const msg = conversation.systemMessage;
      setSystemMessage(msg || defaultSystemMessage);

      // 设置模型参数
      const modelParams = conversation.modelParams;
      if (modelParams) {
        if (
          modelParams.temperature !== null &&
          modelParams.temperature !== undefined
        ) {
          setTemperature(modelParams.temperature);
        }
        if (
          modelParams.contextWindow !== null &&
          modelParams.contextWindow !== undefined
        ) {
          setContextWindow(modelParams.contextWindow);
        }
        if (
          modelParams.maxTokens !== null &&
          modelParams.maxTokens !== undefined
        ) {
          setMaxTokens(modelParams.maxTokens);
          setMaxTokenEnabled(true);
        } else {
          setMaxTokens(null);
          setMaxTokenEnabled(false);
        }
      }
    }
  }, [currentChat]);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      // 更新全局设置
      dispatch(
        updateGlobalSettings({
          temperature,
          contextWindow,
          maxTokens: maxTokenEnabled ? maxTokens : null,
          systemMessage,
          streamOutput,
        })
      );

      // 如果有当前对话，也更新对话设置
      if (currentChat?.conversation?.uuid) {
        const result = await dispatch(
          updateChatMessages({
            uuid: currentChat.conversation.uuid,
            title: currentChat.conversation.title,
            systemMessage: systemMessage,
            temperature,
            contextWindow,
            maxTokens:
              maxTokenEnabled && maxTokens !== null ? maxTokens : undefined,
          })
        );

        if (updateChatMessages.fulfilled.match(result)) {
          console.log('Settings saved successfully');
        } else {
          console.error('Failed to save settings:', result.payload);
        }
      }

      onClose();
    } catch (error) {
      console.error('Error saving settings:', error);
    } finally {
      setIsSaving(false);
    }
  };

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/30"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-lg shadow-lg w-[400px] max-h-[90vh] p-6 relative flex flex-col"
        style={{ borderTop: '4px solid rgb(134,74,239)' }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-4 flex-shrink-0">
          <h2
            className="text-lg font-bold"
            style={{ color: 'rgb(134,74,239)' }}
          >
            助手设置
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-[rgb(134,74,239)] text-2xl"
          >
            ×
          </button>
        </div>

        {/* 错误提示 */}
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
            <div className="text-sm text-red-700">加载失败: {error}</div>
          </div>
        )}

        {/* 可滚动的内容区域 */}
        <div className="flex-1 overflow-y-auto pr-2">
          {/* 模型温度设置 */}
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1 flex items-center">
              模型温度
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <span
                      className="ml-1 cursor-pointer text-gray-400 flex items-center"
                      style={{ lineHeight: 0 }}
                    >
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 16 16"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <circle
                          cx="8"
                          cy="8"
                          r="7"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          fill="none"
                        />
                        <text
                          x="8"
                          y="12"
                          textAnchor="middle"
                          fontSize="10"
                          fill="currentColor"
                          fontFamily="Arial, sans-serif"
                        >
                          ?
                        </text>
                      </svg>
                    </span>
                  </TooltipTrigger>
                  <TooltipContent side="top">
                    控制生成内容的随机性，值越高越随机
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </label>
            <input
              type="range"
              min={0}
              max={2}
              step={0.1}
              value={temperature}
              onChange={(e) => setTemperature(Number(e.target.value))}
              style={{
                accentColor: 'rgb(134,74,239)',
                width: '220px',
                maxWidth: '100%',
              }}
              className="align-middle"
            />
            <span className="ml-2 text-xs text-gray-500 align-middle">
              {temperature}
            </span>
          </div>
          {/* 上下文数设置 */}
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1 flex items-center">
              上下文数
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <span
                      className="ml-1 cursor-pointer text-gray-400 flex items-center"
                      style={{ lineHeight: 0 }}
                    >
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 16 16"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <circle
                          cx="8"
                          cy="8"
                          r="7"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          fill="none"
                        />
                        <text
                          x="8"
                          y="12"
                          textAnchor="middle"
                          fontSize="10"
                          fill="currentColor"
                          fontFamily="Arial, sans-serif"
                        >
                          ?
                        </text>
                      </svg>
                    </span>
                  </TooltipTrigger>
                  <TooltipContent side="top">
                    影响模型能记住多少轮对话，数值越大消耗越多资源
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </label>
            <input
              type="range"
              min={1}
              max={32}
              step={1}
              value={contextWindow}
              onChange={(e) => setContextWindow(Number(e.target.value))}
              style={{
                accentColor: 'rgb(134,74,239)',
                width: '220px',
                maxWidth: '100%',
              }}
              className="align-middle"
            />
            <span className="ml-2 text-xs text-gray-500 align-middle">
              {contextWindow}
            </span>
          </div>
          {/* 流式输出开关 */}
          <div className="mb-4 flex items-center justify-between">
            <span className="text-sm">流式输出</span>
            <input
              type="checkbox"
              checked={streamOutput}
              onChange={(e) => setStreamOutput(e.target.checked)}
              style={{ accentColor: 'rgb(134,74,239)' }}
            />
          </div>
          {/* 最大Token数设置 */}
          <div className="mb-4 flex items-center justify-between">
            <span className="text-sm flex items-center">
              最大 Token 数
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <span
                      className="ml-1 cursor-pointer text-gray-400 flex items-center"
                      style={{ lineHeight: 0 }}
                    >
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 16 16"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <circle
                          cx="8"
                          cy="8"
                          r="7"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          fill="none"
                        />
                        <text
                          x="8"
                          y="12"
                          textAnchor="middle"
                          fontSize="10"
                          fill="currentColor"
                          fontFamily="Arial, sans-serif"
                        >
                          ?
                        </text>
                      </svg>
                    </span>
                  </TooltipTrigger>
                  <TooltipContent side="top">
                    单次交互所用的最大 Token
                    数，会影响返回结果的长度。要根据模型上下文限制来设置，否则会报错
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </span>
            <input
              type="checkbox"
              checked={maxTokenEnabled}
              onChange={(e) => setMaxTokenEnabled(e.target.checked)}
              style={{ accentColor: 'rgb(134,74,239)' }}
            />
          </div>
          {maxTokenEnabled && (
            <div className="mb-4 flex items-center justify-between pl-2">
              <input
                type="number"
                min={1}
                max={32768}
                value={maxTokens || ''}
                onChange={(e) =>
                  setMaxTokens(e.target.value ? Number(e.target.value) : null)
                }
                className="border rounded px-2 py-1 w-28 text-sm"
                style={{ borderColor: 'rgb(134,74,239)' }}
              />
              <span className="ml-2 text-xs text-gray-500">Token</span>
            </div>
          )}
          {/* 默认系统消息区块 - 改为可编辑文本框 */}
          <div className="mt-6">
            <div
              className="font-semibold mb-2"
              style={{ color: 'rgb(134,74,239)' }}
            >
              默认系统消息
            </div>
            <div className="relative">
              <textarea
                value={systemMessage}
                onChange={(e) => setSystemMessage(e.target.value)}
                placeholder="请输入系统消息内容..."
                className="w-full min-h-[120px] max-h-[200px] p-3 text-sm border rounded resize-none focus:outline-none focus:ring-2 focus:ring-opacity-50"
                style={{
                  borderColor: 'rgb(134,74,239)',
                  backgroundColor: 'rgba(134,74,239,0.02)',
                  color: '#374151',
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = 'rgb(134,74,239)';
                  e.target.style.boxShadow = '0 0 0 2px rgba(134,74,239,0.2)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = 'rgb(134,74,239)';
                  e.target.style.boxShadow = 'none';
                }}
              />
              <div className="text-xs text-gray-500 mt-1 text-right">
                {systemMessage.length} 字符
              </div>
            </div>
          </div>
        </div>

        {/* 保存按钮 - 固定在底部 */}
        <div className="mt-6 flex justify-end flex-shrink-0">
          <button
            className={`px-4 py-2 rounded text-white transition-opacity ${
              isSaving || loading || !currentChat?.conversation?.uuid
                ? 'opacity-50 cursor-not-allowed'
                : 'hover:opacity-90'
            }`}
            style={{ backgroundColor: 'rgb(134,74,239)' }}
            onClick={handleSave}
            disabled={isSaving || loading || !currentChat?.conversation?.uuid}
          >
            {isSaving
              ? '保存中...'
              : !currentChat?.conversation?.uuid
              ? '无对话'
              : '保存'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default GlobalContextModal;
