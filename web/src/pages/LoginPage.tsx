import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Card, Tabs, Alert } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../hooks';
import { login, register, clearError } from '../store/userSlice';

const { TabPane } = Tabs;

const LoginPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('login');
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { loading, error, isLoggedIn } = useAppSelector(state => state.user);
  
  // Redirect to home if already logged in
  useEffect(() => {
    if (isLoggedIn) {
      navigate('/');
    }
  }, [isLoggedIn, navigate]);
  
  // Clear error when switching tabs
  useEffect(() => {
    dispatch(clearError());
  }, [activeTab, dispatch]);
  
  // Handle login form submission
  const handleLogin = async (values: { username: string; password: string }) => {
    try {
      const result = await dispatch(login(values));
      // Redux Toolkit 的 unwrapResult 可以将 fulfilled action 的 payload 提取出来
      // 如果是 rejected action，则会抛出异常
      console.log('Login result:', result);
      
      // 登录成功，手动触发导航跳转
      console.log('Login successful, navigating to home');
      navigate('/');
    } catch (error) {
      // 登录失败，错误已经被 Redux 处理，这里只需要记录日志
      console.log('Login failed:', error);
    }
  };
  
  // Handle register form submission
  const handleRegister = async (values: { username: string; password: string; confirm: string }) => {
    if (values.password !== values.confirm) {
      return;
    }
    
    try {
      const result = await dispatch(register({
        username: values.username,
        password: values.password
      }));
      
      console.log('Register result:', result);
      
      // 注册成功，手动触发导航跳转
      console.log('Registration successful, navigating to home');
      navigate('/');
    } catch (error) {
      // 注册失败，错误已经被 Redux 处理，这里只需要记录日志
      console.log('Registration failed:', error);
    }
  };
  
  return (
    <div className="flex items-center justify-center min-h-screen bg-light-bg dark:bg-dark-bg p-4">
      <Card 
        className="w-full max-w-md bg-light-surface dark:bg-dark-surface shadow-lg"
        bordered={false}
      >
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-primary">Chat Box</h1>
          <p className="text-gray-500">Your AI Chat Assistant</p>
        </div>
        
        {error && (
          <Alert
            message={error}
            type="error"
            showIcon
            className="mb-4"
            closable
            onClose={() => dispatch(clearError())}
          />
        )}
        
        <Tabs activeKey={activeTab} onChange={setActiveTab} centered>
          <TabPane tab="Login" key="login">
            <Form
              name="login"
              initialValues={{ remember: true }}
              onFinish={handleLogin}
              layout="vertical"
            >
              <Form.Item
                name="username"
                rules={[{ required: true, message: 'Please input your username!' }]}
              >
                <Input 
                  prefix={<UserOutlined />} 
                  placeholder="Username" 
                  size="large" 
                  className="bg-light-bg dark:bg-dark-bg text-light-text dark:text-dark-text"
                />
              </Form.Item>
              
              <Form.Item
                name="password"
                rules={[{ required: true, message: 'Please input your password!' }]}
              >
                <Input.Password 
                  prefix={<LockOutlined />} 
                  placeholder="Password" 
                  size="large"
                  className="bg-light-bg dark:bg-dark-bg text-light-text dark:text-dark-text"
                />
              </Form.Item>
              
              <Form.Item>
                <Button 
                  type="primary" 
                  htmlType="submit" 
                  size="large" 
                  block 
                  loading={loading}
                  className="bg-primary hover:bg-primary-dark"
                >
                  Log in
                </Button>
              </Form.Item>
            </Form>
          </TabPane>
          
          <TabPane tab="Register" key="register">
            <Form
              name="register"
              onFinish={handleRegister}
              layout="vertical"
            >
              <Form.Item
                name="username"
                rules={[
                  { required: true, message: 'Please input your username!' },
                  { min: 3, message: 'Username must be at least 3 characters!' }
                ]}
              >
                <Input 
                  prefix={<UserOutlined />} 
                  placeholder="Username" 
                  size="large"
                  className="bg-light-bg dark:bg-dark-bg text-light-text dark:text-dark-text"
                />
              </Form.Item>
              
              <Form.Item
                name="password"
                rules={[
                  { required: true, message: 'Please input your password!' },
                  { min: 6, message: 'Password must be at least 6 characters!' }
                ]}
              >
                <Input.Password 
                  prefix={<LockOutlined />} 
                  placeholder="Password" 
                  size="large"
                  className="bg-light-bg dark:bg-dark-bg text-light-text dark:text-dark-text"
                />
              </Form.Item>
              
              <Form.Item
                name="confirm"
                dependencies={['password']}
                rules={[
                  { required: true, message: 'Please confirm your password!' },
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      if (!value || getFieldValue('password') === value) {
                        return Promise.resolve();
                      }
                      return Promise.reject(new Error('The two passwords do not match!'));
                    },
                  }),
                ]}
              >
                <Input.Password 
                  prefix={<LockOutlined />} 
                  placeholder="Confirm Password" 
                  size="large"
                  className="bg-light-bg dark:bg-dark-bg text-light-text dark:text-dark-text"
                />
              </Form.Item>
              
              <Form.Item>
                <Button 
                  type="primary" 
                  htmlType="submit" 
                  size="large" 
                  block 
                  loading={loading}
                  className="bg-primary hover:bg-primary-dark"
                >
                  Register
                </Button>
              </Form.Item>
            </Form>
          </TabPane>
        </Tabs>
      </Card>
    </div>
  );
};

export default LoginPage;
