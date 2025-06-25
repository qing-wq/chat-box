import React from 'react';
import { Form, Input, Button, Card, Slider, Select, InputNumber, Divider, message } from 'antd';
import { useAppSelector, useAppDispatch } from '../hooks';
import { setTheme, setModelConfig, updateModelParam } from '../store/configSlice';
import { ThemeMode, ModelConfig, ModelParams } from '../types';

const { Option } = Select;

const SettingsPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const { theme, modelConfig } = useAppSelector(state => state.config);
  const [form] = Form.useForm();
  
  // Initialize form with current values
  React.useEffect(() => {
    form.setFieldsValue({
      theme,
      apiUrl: modelConfig.apiUrl,
      apiKey: modelConfig.apiKey,
      modelName: modelConfig.modelName,
      temperature: modelConfig.modelParams?.temperature || 0.7,
      topP: modelConfig.modelParams?.topP || 0.9,
      maxTokens: modelConfig.modelParams?.maxTokens || 2000
    });
  }, [form, theme, modelConfig]);
  
  // Handle form submission
  const handleSubmit = (values: any) => {
    // Update theme
    if (values.theme !== theme) {
      dispatch(setTheme(values.theme as ThemeMode));
    }
    
    // Update model config
    const newModelConfig: ModelConfig = {
      apiUrl: values.apiUrl,
      apiKey: values.apiKey,
      modelName: values.modelName,
      modelParams: {
        temperature: values.temperature,
        topP: values.topP,
        maxTokens: values.maxTokens
      }
    };
    
    dispatch(setModelConfig(newModelConfig));
    message.success('Settings saved successfully');
  };
  
  // Handle individual parameter changes
  const handleParamChange = (key: keyof ModelParams, value: any) => {
    dispatch(updateModelParam({ key, value }));
  };
  
  return (
    <div className="p-6 max-w-3xl mx-auto">
      <Card 
        title="Settings" 
        bordered={false}
        className="bg-light-surface dark:bg-dark-surface shadow-md"
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          initialValues={{
            theme,
            apiUrl: modelConfig.apiUrl,
            apiKey: modelConfig.apiKey,
            modelName: modelConfig.modelName,
            temperature: modelConfig.modelParams?.temperature || 0.7,
            topP: modelConfig.modelParams?.topP || 0.9,
            maxTokens: modelConfig.modelParams?.maxTokens || 2000
          }}
        >
          {/* Theme Settings */}
          <div className="mb-6">
            <h3 className="text-lg font-medium mb-4 text-light-text dark:text-dark-text">Appearance</h3>
            
            <Form.Item
              name="theme"
              label="Theme"
            >
              <Select onChange={(value) => dispatch(setTheme(value as ThemeMode))}>
                <Option value="light">Light</Option>
                <Option value="dark">Dark</Option>
              </Select>
            </Form.Item>
          </div>
          
          <Divider />
          
          {/* Model Settings */}
          <div className="mb-6">
            <h3 className="text-lg font-medium mb-4 text-light-text dark:text-dark-text">Model Configuration</h3>
            
            <Form.Item
              name="apiUrl"
              label="API URL"
              rules={[{ required: true, message: 'Please input API URL!' }]}
            >
              <Input placeholder="https://api.example.com" />
            </Form.Item>
            
            <Form.Item
              name="apiKey"
              label="API Key"
              rules={[{ required: true, message: 'Please input API Key!' }]}
            >
              <Input.Password placeholder="Your API Key" />
            </Form.Item>
            
            <Form.Item
              name="modelName"
              label="Model"
              rules={[{ required: true, message: 'Please select a model!' }]}
            >
              <Select>
                <Option value="grok-3-beta">Grok-3-beta</Option>
                <Option value="gpt-4o">GPT-4o</Option>
                <Option value="gpt-4-turbo">GPT-4 Turbo</Option>
                <Option value="gpt-3.5-turbo">GPT-3.5 Turbo</Option>
                <Option value="claude-3-opus">Claude 3 Opus</Option>
                <Option value="claude-3-sonnet">Claude 3 Sonnet</Option>
                <Option value="claude-3-haiku">Claude 3 Haiku</Option>
              </Select>
            </Form.Item>
          </div>
          
          <Divider />
          
          {/* Model Parameters */}
          <div>
            <h3 className="text-lg font-medium mb-4 text-light-text dark:text-dark-text">Model Parameters</h3>
            
            <Form.Item
              name="temperature"
              label={
                <div className="flex justify-between w-full">
                  <span>Temperature</span>
                  <span className="text-gray-500">{modelConfig.modelParams?.temperature || 0.7}</span>
                </div>
              }
            >
              <Slider
                min={0}
                max={2}
                step={0.1}
                onChange={(value) => handleParamChange('temperature', value)}
              />
            </Form.Item>
            
            <Form.Item
              name="topP"
              label={
                <div className="flex justify-between w-full">
                  <span>Top P</span>
                  <span className="text-gray-500">{modelConfig.modelParams?.topP || 0.9}</span>
                </div>
              }
            >
              <Slider
                min={0}
                max={1}
                step={0.05}
                onChange={(value) => handleParamChange('topP', value)}
              />
            </Form.Item>
            
            <Form.Item
              name="maxTokens"
              label="Max Tokens"
            >
              <InputNumber
                min={100}
                max={8000}
                step={100}
                onChange={(value) => handleParamChange('maxTokens', value)}
                className="w-full"
              />
            </Form.Item>
          </div>
          
          <Form.Item className="mt-6">
            <Button
              type="primary"
              htmlType="submit"
              size="large"
              className="bg-primary hover:bg-primary-dark"
            >
              Save Settings
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default SettingsPage;
