import React from 'react';
import {
  Form,
  Button,
  Card,
  Select,
  message,
} from 'antd';
import { useAppSelector, useAppDispatch } from '../hooks';
import {
  setTheme,
} from '../store/configSlice';
import { ThemeMode } from '../types';

const { Option } = Select;

const SettingsPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const { theme } = useAppSelector((state) => state.config);
  const [form] = Form.useForm();

  // Initialize form with current values
  React.useEffect(() => {
    form.setFieldsValue({
      theme,
    });
  }, [form, theme]);

  // Handle form submission
  const handleSubmit = (values: Record<string, unknown>) => {
    // Update theme
    if (values.theme !== theme) {
      dispatch(setTheme(values.theme as ThemeMode));
    }

    message.success('Settings saved successfully');
  };

  return (
    <div className="p-6 max-w-3xl mx-auto min-h-full">
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
          }}
        >
          {/* Theme Settings */}
          <div className="mb-6">
            <h3 className="text-lg font-medium mb-4 text-light-text dark:text-dark-text">
              Appearance
            </h3>

            <Form.Item name="theme" label="Theme">
              <Select
                onChange={(value) => dispatch(setTheme(value as ThemeMode))}
              >
                <Option value="light">Light</Option>
                <Option value="dark">Dark</Option>
              </Select>
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
