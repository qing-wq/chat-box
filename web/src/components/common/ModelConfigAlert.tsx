import React from 'react';
import { Alert, Button } from 'antd';
import { useNavigate } from 'react-router-dom';
import { useAppSelector } from '../../hooks';
import { store } from '../../store';

const ModelConfigAlert: React.FC = () => {
  const navigate = useNavigate();
  const { currentChat } = useAppSelector((state) => state.chat);

  // 检查当前是否有选中的聊天
  if (currentChat) {
    return null;
  }

  return (
    <Alert
      message="未选择模型"
      description={
        <div>
          <p>请先创建或选择一个模型以开始聊天。</p>
          <Button
            type="primary"
            onClick={() => navigate('/platforms')}
            className="mt-2"
          >
            前往创建模型
          </Button>
        </div>
      }
      type="info"
      showIcon
      className="mb-4"
    />
  );
};

export default ModelConfigAlert;