import React from 'react';
import { Alert, Button } from 'antd';
import { useNavigate } from 'react-router-dom';
import { useAppSelector } from '../../hooks';

const ApiConfigAlert: React.FC = () => {
  const navigate = useNavigate();
  const { modelConfig } = useAppSelector(state => state.config);
  
  // 检查API配置是否完整
  const isConfigIncomplete = !modelConfig.apiUrl || !modelConfig.apiKey;
  
  if (!isConfigIncomplete) {
    return null;
  }
  
  return (
    <Alert
      message="API配置不完整"
      description={
        <div>
          <p>请在设置页面配置API URL和API Key以使用聊天功能。</p>
          <Button 
            type="primary" 
            onClick={() => navigate('/settings')}
            className="mt-2"
          >
            前往设置
          </Button>
        </div>
      }
      type="warning"
      showIcon
      className="mb-4"
    />
  );
};

export default ApiConfigAlert;
