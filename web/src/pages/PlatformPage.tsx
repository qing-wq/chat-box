import React, { useState, useEffect } from 'react';
import { Form, Input, Select, message, Modal } from 'antd';
import { useAppSelector, useAppDispatch } from '@/hooks';
import {
  fetchPlatformList,
  createPlatform,
  updatePlatformApi,
  deletePlatformApi,
  fetchPlatformDetail,
  clearError,
  setCurrentPlatform,
} from '@/store/platformSlice';
import { createModel, ModelType } from '@/store/modelSlice';
import { Platform, PlatformType } from '@/types';
import { Plus, Edit, Trash2, Bot } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useNavigate, useLocation } from 'react-router-dom';

const { Option } = Select;

const PlatformPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { platforms, loading, error, currentPlatform } = useAppSelector(
    (state) => state.platform
  );
  const [isPlatformModalVisible, setIsPlatformModalVisible] = useState(false);
  const [isModelModalVisible, setIsModelModalVisible] = useState(false);
  const [editingPlatform, setEditingPlatform] = useState<Platform | null>(null);
  const [platformForm] = Form.useForm();
  const [modelForm] = Form.useForm();

  // 获取平台类型的友好名称
  const getPlatformTypeName = (type: string | undefined): string => {
    if (!type) return '未知类型';

    const typeNumber = Number(type);
    if (isNaN(typeNumber)) return type;

    switch (typeNumber) {
      case PlatformType.openai:
        return 'OpenAI';
      case PlatformType['openai-response']:
        return 'OpenAI Response';
      case PlatformType.gemini:
        return 'Gemini';
      case PlatformType.anthropic:
        return 'Anthropic';
      case PlatformType.azure_openai:
        return 'Azure OpenAI';
      default:
        return `未知类型(${type})`;
    }
  };

  // 组件挂载时获取平台列表，卸载时清除当前平台
  useEffect(() => {
    dispatch(fetchPlatformList());

    return () => {
      dispatch(setCurrentPlatform(null));
    };
  }, [dispatch]);

  // 处理URL中的platformId参数
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const platformId = searchParams.get('platformId');

    if (platformId) {
      dispatch(fetchPlatformDetail(Number(platformId)));
    }
  }, [location.search, dispatch]);

  // 处理错误信息
  useEffect(() => {
    if (error) {
      message.error(error);
      dispatch(clearError());
    }
  }, [error, dispatch]);

  // Reset form when editing platform changes
  useEffect(() => {
    if (editingPlatform) {
      platformForm.setFieldsValue(editingPlatform);
    } else {
      platformForm.resetFields();
    }
  }, [editingPlatform, platformForm]);

  // Handle creating a new platform
  const handleCreatePlatform = () => {
    setEditingPlatform(null);
    platformForm.resetFields();
    setIsPlatformModalVisible(true);
  };

  // Handle creating a new model
  const handleCreateModel = () => {
    if (!currentPlatform) {
      message.error('请先选择一个平台');
      return;
    }
    modelForm.resetFields();
    modelForm.setFieldsValue({ platformId: currentPlatform.id });
    setIsModelModalVisible(true);
  };

  // Handle editing a platform
  const handleEditPlatform = (platform: Platform) => {
    // 获取最新的平台详情
    if (platform.id) {
      dispatch(fetchPlatformDetail(Number(platform.id)));
    }
    setEditingPlatform(platform);
    setIsPlatformModalVisible(true);

    // 确保在编辑模式下，平台名称和平台类型字段被禁用
    platformForm.setFieldsValue({
      ...platform,
      name: platform.name,
      platformType: platform.platformType,
    });
  };

  // Handle selecting a platform to view details
  const handleSelectPlatform = (platform: Platform) => {
    if (platform.id) {
      // 获取平台详情
      dispatch(fetchPlatformDetail(Number(platform.id)));
      // 然后更新URL，但不触发页面跳转
      window.history.replaceState(
        null,
        '',
        `/platforms?platformId=${platform.id}`
      );
    }
  };

  // Handle navigating to model details
  const handleModelClick = (modelId: number) => {
    navigate(`/models/${modelId}`);
  };

  // 删除确认状态
  const [deleteConfirmVisible, setDeleteConfirmVisible] = useState(false);
  const [deletingPlatformId, setDeletingPlatformId] = useState<string | null>(
    null
  );

  // Handle deleting a platform
  const handleDeletePlatform = (id: string) => {
    // 设置要删除的平台ID并显示确认对话框
    setDeletingPlatformId(id);
    setDeleteConfirmVisible(true);
  };

  // 确认删除平台
  const confirmDeletePlatform = async () => {
    if (!deletingPlatformId) return;

    try {
      console.log('确认删除，调用API');
      await dispatch(deletePlatformApi(Number(deletingPlatformId))).unwrap();
      // 如果删除的是当前选中的平台，则清除当前平台
      if (currentPlatform && currentPlatform.id === deletingPlatformId) {
        dispatch(setCurrentPlatform(null));
      }
      message.success('平台删除成功');
    } catch (error) {
      console.error('删除平台失败:', error);
      // 错误已在 useEffect 中处理
    } finally {
      setDeleteConfirmVisible(false);
      setDeletingPlatformId(null);
    }
  };

  // 取消删除平台
  const cancelDeletePlatform = () => {
    setDeleteConfirmVisible(false);
    setDeletingPlatformId(null);
  };

  // Handle platform modal OK button
  const handlePlatformModalOk = async () => {
    try {
      const values = await platformForm.validateFields();

      if (editingPlatform) {
        // 更新平台 - 只更新API密钥和基础URL，保留原有的平台名称和类型
        await dispatch(
          updatePlatformApi({
            id: Number(editingPlatform.id),
            apiKey: values.apiKey,
            baseUrl: values.baseUrl,
            // 确保不会修改平台名称和类型
            name: editingPlatform.name,
            platformType: editingPlatform.platformType,
          })
        ).unwrap();
        message.success('平台更新成功');
      } else {
        // 创建平台
        await dispatch(
          createPlatform({
            name: values.name,
            platformType: values.platformType,
            apiKey: values.apiKey,
            baseUrl: values.baseUrl,
          })
        ).unwrap();
        message.success('平台创建成功');
      }

      setIsPlatformModalVisible(false);
      platformForm.resetFields();
    } catch (error) {
      if (error instanceof Error) {
        console.log('Validate Failed:', error);
      }
      // API 错误已在 useEffect 中处理
    }
  };

  // Handle platform modal cancel button
  const handlePlatformModalCancel = () => {
    setIsPlatformModalVisible(false);
    setEditingPlatform(null);
    platformForm.resetFields();
  };

  // Handle model modal OK button
  const handleModelModalOk = async () => {
    try {
      const values = await modelForm.validateFields();

      // 创建模型
      await dispatch(
        createModel({
          modelId: values.modelId,
          name: values.name,
          platformId: values.platformId,
          modelType: values.modelType,
        })
      ).unwrap();

      message.success('模型创建成功');
      setIsModelModalVisible(false);
      modelForm.resetFields();

      // 刷新当前平台详情，以获取最新的模型列表
      if (currentPlatform && currentPlatform.id) {
        dispatch(fetchPlatformDetail(Number(currentPlatform.id)));
      }
    } catch (error) {
      if (error instanceof Error) {
        console.log('Validate Failed:', error);
      }
      // API 错误已在 useEffect 中处理
    }
  };

  // Handle model modal cancel button
  const handleModelModalCancel = () => {
    setIsModelModalVisible(false);
    modelForm.resetFields();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <div className="flex h-full">
        {/* Left Sidebar for Platform List */}
        <div className="w-80 flex-shrink-0 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-r border-slate-200/50 dark:border-slate-700/50">
          <div className="p-6">
            <div className="mb-6">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
                模型平台管理
              </h2>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                管理您的AI模型平台
              </p>
            </div>

            <Button
              onClick={handleCreatePlatform}
              className="w-full h-12 bg-gradient-to-r from-[rgb(135,75,238)] to-[rgb(135,75,238)]/90 hover:from-[rgb(135,75,238)]/90 hover:to-[rgb(135,75,238)]/80 text-white shadow-sm rounded-xl font-medium transition-all duration-200 hover:shadow-md"
              disabled={loading}
            >
              <Plus size={18} className="mr-2" />
              创建新平台
            </Button>

            <div className="mt-6 space-y-1">
              {platforms.length === 0 && !loading ? (
                <div className="text-center py-8">
                  <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center">
                    <Bot size={20} className="text-slate-400" />
                  </div>
                  <p className="text-slate-500 dark:text-slate-400 text-sm">
                    暂无平台
                  </p>
                  <p className="text-slate-400 dark:text-slate-500 text-xs mt-1">
                    点击上方按钮创建第一个平台
                  </p>
                </div>
              ) : (
                platforms.map((platform) => (
                  <div
                    key={platform.id}
                    className={cn(
                      'group relative flex items-center justify-between p-4 rounded-xl transition-all duration-200 cursor-pointer',
                      'hover:bg-slate-50 dark:hover:bg-slate-700/50',
                      currentPlatform?.id === platform.id
                        ? 'bg-gradient-to-r from-[rgb(135,75,238)]/10 to-[rgb(135,75,238)]/5 border border-[rgb(135,75,238)]/20'
                        : 'hover:border-slate-200 dark:hover:border-slate-600'
                    )}
                    onClick={() => handleSelectPlatform(platform)}
                  >
                    <div className="flex items-center space-x-3">
                      <div
                        className={cn(
                          'w-10 h-10 rounded-lg flex items-center justify-center transition-colors',
                          currentPlatform?.id === platform.id
                            ? 'bg-[rgb(135,75,238)] text-white'
                            : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400'
                        )}
                      >
                        <Bot size={18} />
                      </div>
                      <div>
                        <span
                          className={cn(
                            'font-medium transition-colors',
                            currentPlatform?.id === platform.id
                              ? 'text-[rgb(135,75,238)]'
                              : 'text-slate-900 dark:text-white'
                          )}
                        >
                          {platform.name}
                        </span>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                          {getPlatformTypeName(platform.platformType)}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEditPlatform(platform);
                        }}
                        className="h-8 w-8 hover:bg-slate-200 dark:hover:bg-slate-600"
                        disabled={loading}
                      >
                        <Edit size={14} />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeletePlatform(platform.id);
                        }}
                        className="h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                        disabled={loading}
                      >
                        <Trash2 size={14} />
                      </Button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Right Content Area */}
        <div className="flex-1 p-6">
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="w-8 h-8 border-4 border-[rgb(135,75,238)] border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : !currentPlatform ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[rgb(135,75,238)]/10 to-[rgb(135,75,238)]/5 flex items-center justify-center mb-6">
                <Bot size={32} className="text-[rgb(135,75,238)]" />
              </div>
              <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
                选择平台
              </h3>
              <p className="text-slate-600 dark:text-slate-400 max-w-md">
                从左侧选择一个平台查看详情或管理模型
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {/* 平台头部信息 */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[rgb(135,75,238)] to-[rgb(135,75,238)]/80 flex items-center justify-center">
                    <Bot size={24} className="text-white" />
                  </div>
                  <div>
                    <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
                      {currentPlatform.name}
                    </h1>
                    <p className="text-slate-600 dark:text-slate-400">
                      {getPlatformTypeName(currentPlatform.platformType)}
                    </p>
                  </div>
                </div>

                <Button
                  onClick={handleCreateModel}
                  className="h-11 px-6 bg-gradient-to-r from-[rgb(135,75,238)] to-[rgb(135,75,238)]/90 hover:from-[rgb(135,75,238)]/90 hover:to-[rgb(135,75,238)]/80 text-white shadow-sm rounded-xl font-medium"
                  disabled={loading}
                >
                  <Plus size={18} className="mr-2" />
                  创建模型
                </Button>
              </div>

              {/* 模型列表 */}
              <div>
                {!currentPlatform.modelList ||
                currentPlatform.modelList.length === 0 ? (
                  <div className="text-center py-16">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center">
                      <Bot size={24} className="text-slate-400" />
                    </div>
                    <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-2">
                      暂无模型
                    </h3>
                    <p className="text-slate-600 dark:text-slate-400 mb-6">
                      当前平台还没有模型，点击上方按钮创建第一个模型
                    </p>
                    <Button
                      onClick={handleCreateModel}
                      variant="outline"
                      className="border-[rgb(135,75,238)]/30 text-[rgb(135,75,238)] hover:bg-[rgb(135,75,238)]/10"
                    >
                      <Plus size={16} className="mr-2" />
                      创建模型
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between mb-4">
                      <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
                        模型列表
                      </h2>
                      <span className="text-sm text-slate-500 dark:text-slate-400">
                        {currentPlatform.modelList.length} 个模型
                      </span>
                    </div>

                    <div className="space-y-2">
                      {currentPlatform.modelList.map((model) => (
                        <div
                          key={model.id}
                          className="group relative bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-xl p-4 border border-slate-200/50 dark:border-slate-700/50 hover:border-[rgb(135,75,238)]/30 hover:shadow-sm transition-all duration-200 cursor-pointer"
                          onClick={() => handleModelClick(model.id)}
                        >
                          <div className="flex items-center space-x-4">
                            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[rgb(135,75,238)]/10 to-[rgb(135,75,238)]/5 flex items-center justify-center">
                              <Bot
                                size={18}
                                className="text-[rgb(135,75,238)]"
                              />
                            </div>
                            <div className="flex-1 min-w-0">
                              <h3 className="font-medium text-slate-900 dark:text-white truncate">
                                {model.name}
                              </h3>
                              <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-1">
                                {'暂无描述'}
                              </p>
                            </div>
                            <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                              <span className="text-xs text-slate-500 dark:text-slate-400">
                                正常
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Platform Form Modal */}
      <Modal
        title={editingPlatform ? '编辑平台' : '创建新平台'}
        open={isPlatformModalVisible}
        onOk={handlePlatformModalOk}
        onCancel={handlePlatformModalCancel}
        okText={editingPlatform ? '更新' : '创建'}
        cancelText="取消"
        confirmLoading={loading}
        className="modal-theme-adaptive"
        okButtonProps={{
          className:
            'bg-gradient-to-r from-[rgb(135,75,238)] to-[rgb(135,75,238)]/90',
          style: {
            background:
              'linear-gradient(to right, rgb(135,75,238), rgba(135,75,238,0.9))',
            borderColor: 'rgb(135,75,238)',
            color: '#fff',
          },
        }}
        cancelButtonProps={{
          className: '',
          style: {
            borderColor: '#d9d9d9',
            color: 'black',
          },
        }}
      >
        <Form
          form={platformForm}
          layout="vertical"
          name="platform_form"
          initialValues={{ type: 'openai' }}
        >
          <Form.Item
            name="name"
            label={<span>平台名称</span>}
            rules={[{ required: true, message: '请输入平台名称!' }]}
          >
            <Input
              placeholder="例如：OpenAI, 智谱AI"
              disabled={!!editingPlatform}
              className={editingPlatform ? 'bg-muted cursor-not-allowed' : ''}
            />
          </Form.Item>
          <Form.Item
            name="platformType"
            label={<span>平台类型</span>}
            rules={[{ required: true, message: '请选择平台类型!' }]}
          >
            <Select
              placeholder="选择平台类型"
              disabled={!!editingPlatform}
              className={editingPlatform ? 'bg-muted cursor-not-allowed' : ''}
            >
              <Option value="openai">OpenAI</Option>
              <Option value="openai-response">OpenAI Response</Option>
              <Option value="gemini">Gemini</Option>
              <Option value="anthropic">Anthropic</Option>
              <Option value="azure_openai">Azure OpenAI</Option>
              {/* Add more platform types as needed */}
            </Select>
          </Form.Item>
          <Form.Item
            name="apiKey"
            label="API密钥"
            rules={[{ required: true, message: '请输入API密钥!' }]}
          >
            <Input.Password placeholder="您的API密钥" />
          </Form.Item>
          <Form.Item
            name="baseUrl"
            label="基础URL"
            rules={[{ required: true, message: '请输入基础URL!' }]}
          >
            <Input placeholder="例如：https://api.openai.com/v1" />
          </Form.Item>
        </Form>
      </Modal>

      {/* Model Form Modal */}
      <Modal
        title="创建新模型"
        open={isModelModalVisible}
        onOk={handleModelModalOk}
        onCancel={handleModelModalCancel}
        okText="创建"
        cancelText="取消"
        confirmLoading={loading}
        className="modal-theme-adaptive"
        okButtonProps={{
          className:
            'bg-gradient-to-r from-[rgb(135,75,238)] to-[rgb(135,75,238)]/90',
          style: {
            background:
              'linear-gradient(to right, rgb(135,75,238), rgba(135,75,238,0.9))',
            borderColor: 'rgb(135,75,238)',
            color: '#fff',
          },
        }}
        cancelButtonProps={{
          className: '',
          style: {
            borderColor: '#d9d9d9',
            color: 'rgba(0, 0, 0, 0.88)',
          },
        }}
      >
        <Form
          form={modelForm}
          layout="vertical"
          name="model_form"
          initialValues={{ modelType: ModelType.TEXT }}
        >
          <Form.Item name="platformId" hidden>
            <Input type="hidden" />
          </Form.Item>

          <Form.Item
            name="modelId"
            label="模型ID"
            rules={[{ required: true, message: '请输入模型ID!' }]}
          >
            <Input placeholder="例如：gpt-3.5-turbo, gpt-4" />
          </Form.Item>

          <Form.Item
            name="name"
            label="模型名称"
            rules={[{ required: true, message: '请输入模型名称!' }]}
          >
            <Input placeholder="例如：GPT-3.5, GPT-4" />
          </Form.Item>

          <Form.Item
            name="modelType"
            label="模型类型"
            rules={[{ required: true, message: '请选择模型类型!' }]}
          >
            <Select placeholder="选择模型类型">
              <Option value={ModelType.TEXT}>文本 (Text)</Option>
              <Option value={ModelType.IMAGE}>图像 (Image)</Option>
              <Option value={ModelType.EMBEDDING}>嵌入 (Embedding)</Option>
              <Option value={ModelType.RERANK}>重排 (Rerank)</Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>

      {/* 删除确认对话框 */}
      <Modal
        title="确认删除"
        open={deleteConfirmVisible}
        onOk={confirmDeletePlatform}
        onCancel={cancelDeletePlatform}
        okText="删除"
        cancelText="取消"
        className="modal-theme-adaptive"
        okButtonProps={{
          className: 'bg-gradient-to-r from-red-500 to-red-600',
          style: {
            background: 'linear-gradient(to right, #ef4444, #dc2626)',
            borderColor: '#ef4444',
            color: '#fff',
          },
        }}
        cancelButtonProps={{
          className: '',
          style: {
            borderColor: '#d9d9d9',
            color: 'rgba(0, 0, 0, 0.88)',
          },
        }}
      >
        <p>确定要删除这个平台吗？此操作不可恢复。</p>
      </Modal>
    </div>
  );
};

export default PlatformPage;
