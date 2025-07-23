import React from 'react';

interface Props {
  open: boolean;
  onClose: () => void;
}

const defaultSystemMessage = '这里是默认系统消息内容，可以自定义。';

const GlobalContextModal: React.FC<Props> = ({ open, onClose }) => {
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
          <label className="block text-sm font-medium mb-1">模型温度</label>
          <input
            type="range"
            min={0}
            max={2}
            step={0.1}
            defaultValue={1}
            style={{ accentColor: 'rgb(134,74,239)' }}
          />
        </div>
        {/* 上下文数设置 */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">上下文数</label>
          <input
            type="range"
            min={1}
            max={32}
            step={1}
            defaultValue={8}
            style={{ accentColor: 'rgb(134,74,239)' }}
          />
        </div>
        {/* 流式输出开关 */}
        <div className="mb-4 flex items-center justify-between">
          <span className="text-sm">流式输出</span>
          <input
            type="checkbox"
            defaultChecked
            style={{ accentColor: 'rgb(134,74,239)' }}
          />
        </div>
        {/* 默认系统消息区块 */}
        <div className="mt-6 p-3 bg-[rgba(134,74,239,0.08)] rounded">
          <div
            className="font-semibold mb-1"
            style={{ color: 'rgb(134,74,239)' }}
          >
            默认系统消息
          </div>
          <div className="text-sm text-gray-700">{defaultSystemMessage}</div>
        </div>
      </div>
    </div>
  );
};

export default GlobalContextModal;
