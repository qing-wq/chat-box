import React, { useState } from 'react';
import { useAppSelector, useAppDispatch } from '../../hooks';
import { updateChatMessages } from '@/store/chatSlice';
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider,
} from '@/components/ui/tooltip';
import axios from 'axios';

interface Props {
  open: boolean;
  onClose: () => void;
}

const defaultSystemMessage = '这里是默认系统消息内容，可以自定义。';

const GlobalContextModal: React.FC<Props> = ({ open, onClose }) => {
  const [temperature, setTemperature] = useState(1);
  const [contextWindow, setContextWindow] = useState(8);
  const [streamOutput, setStreamOutput] = useState(true);
  const [maxTokenEnabled, setMaxTokenEnabled] = useState(false);
  const [maxTokens, setMaxTokens] = useState(2048);
  const [systemMessage, setSystemMessage] =
    useState<string>(defaultSystemMessage);

  const dispatch = useAppDispatch();
  const currentChat = useAppSelector((state) => state.chat.currentChat);

  React.useEffect(() => {
    const fetchSystemMessage = async () => {
      if (open && currentChat?.conversation?.uuid) {
        try {
          const res = await axios.get(
            `/api/conversation/detail/${currentChat.conversation.uuid}`
          );
          const msg = res?.data?.data?.conversation?.systemMessage;
          setSystemMessage(msg || defaultSystemMessage);
        } catch (e) {
          setSystemMessage(defaultSystemMessage);
        }
      }
    };
    fetchSystemMessage();
  }, [open, currentChat]);

  const handleSave = () => {
    if (!currentChat) return;
    dispatch(
      updateChatMessages({
        uuid: currentChat.conversation.uuid,
        title: currentChat.conversation.title,
        systemMessage: currentChat.conversation.systemMessage,
        temperature,
        contextWindow,
        maxTokens: maxTokenEnabled ? maxTokens : undefined,
      })
    );
    onClose();
  };

  if (!open) return null;
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/30"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-lg shadow-lg w-[400px] p-6 relative"
        style={{ borderTop: '4px solid rgb(134,74,239)' }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-4">
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
              value={maxTokens}
              onChange={(e) => setMaxTokens(Number(e.target.value))}
              className="border rounded px-2 py-1 w-28 text-sm"
              style={{ borderColor: 'rgb(134,74,239)' }}
            />
            <span className="ml-2 text-xs text-gray-500">Token</span>
          </div>
        )}
        {/* 默认系统消息区块 */}
        <div className="mt-6 p-3 bg-[rgba(134,74,239,0.08)] rounded">
          <div
            className="font-semibold mb-1"
            style={{ color: 'rgb(134,74,239)' }}
          >
            默认系统消息
          </div>
          <div className="text-sm text-gray-700">{systemMessage}</div>
        </div>
        {/* 预留保存按钮 */}
        <div className="mt-6 flex justify-end">
          <button
            className="px-4 py-2 rounded text-white"
            style={{ backgroundColor: 'rgb(134,74,239)' }}
            onClick={handleSave}
          >
            保存
          </button>
        </div>
      </div>
    </div>
  );
};

export default GlobalContextModal;
