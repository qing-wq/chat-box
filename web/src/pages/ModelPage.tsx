import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '@/hooks';
import { fetchPlatformDetail } from '@/store/platformSlice';
import {
  fetchModelDetail,
  updateModel,
  deleteModel,
  ModelType,
} from '@/store/modelSlice';
import { Button } from '@/components/ui/button';
import {
  ArrowLeft,
  Edit,
  Trash2,
  Settings,
  Bot,
  Calendar,
  Tag,
  Info,
  Database,
} from 'lucide-react';
import { message, Modal, Form, Input, Select } from 'antd';
import { Model, PlatformType } from '@/types';
import { cn } from '@/lib/utils';

interface ModelPageParams {
  modelId: string;
}

const ModelPage: React.FC = () => {
  const { modelId } = useParams<ModelPageParams>();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { platforms, currentPlatform } = useAppSelector(
    (state) => state.platform
  );
  const { models, loading, error } = useAppSelector((state) => state.model);

  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [form] = Form.useForm();

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

  // 根据modelId获取模型详情
  useEffect(() => {
    if (!modelId) {
      message.error('模型ID不存在');
      navigate('/platforms');
      return;
    }

    // 使用modelSlice中的fetchModelDetail获取模型详情
    dispatch(fetchModelDetail(Number(modelId)));
  }, [modelId, dispatch, navigate]);

  // 获取模型详情后，如果需要，获取对应的平台详情
  useEffect(() => {
    // 从models中查找当前模型
    const currentModel = models.find((m) => m.id === Number(modelId));

    if (currentModel && currentModel.platformId) {
      // 如果当前平台不存在或与模型的平台不同，则获取平台详情
      if (
        !currentPlatform ||
        Number(currentPlatform.id) !== currentModel.platformId
      ) {
        dispatch(fetchPlatformDetail(currentModel.platformId));
      }

      // 设置表单字段值
      form.setFieldsValue(currentModel);
    }
  }, [modelId, models, currentPlatform, dispatch, form]);

  // 返回平台详情页面
  const handleBackToPlatforms = () => {
    // 获取当前模型
    const currentModel = models.find((m) => m.id === Number(modelId));

    // 如果有当前模型信息，则返回到该平台的详情页面
    if (currentModel && currentModel.platformId) {
      navigate(`/platforms?platformId=${currentModel.platformId}`);
    } else {
      // 如果没有平台信息，则返回平台列表页面
      navigate('/platforms');
    }
  };

  // 编辑模型
  const handleEditModel = () => {
    const currentModel = models.find((m) => m.id === Number(modelId));
    if (currentModel) {
      form.setFieldsValue(currentModel);
      setIsEditModalVisible(true);
    }
  };

  // 删除确认状态
  const [deleteConfirmVisible, setDeleteConfirmVisible] = useState(false);

  // 删除模型
  const handleDeleteModel = () => {
    const currentModel = models.find((m) => m.id === Number(modelId));
    console.log(currentModel);
    if (!currentModel) return;

    // 显示确认对话框
    setDeleteConfirmVisible(true);
  };

  // 确认删除模型
  const confirmDeleteModel = async () => {
    try {
      // 调用删除模型的API
      await dispatch(deleteModel(Number(modelId))).unwrap();
      message.success('模型删除成功');
      navigate('/platforms');
    } catch (error) {
      message.error('删除模型失败');
    } finally {
      setDeleteConfirmVisible(false);
    }
  };

  // 取消删除模型
  const cancelDeleteModel = () => {
    setDeleteConfirmVisible(false);
  };

  // 处理编辑模型表单提交
  const handleEditModalOk = async () => {
    try {
      const values = await form.validateFields();
      const currentModel = models.find((m) => m.id === Number(modelId));

      if (currentModel) {
        // 调用更新模型的API
        await dispatch(
          updateModel({
            id: Number(modelId),
            name: values.name,
            type: values.type,
            description: values.description, // 添加description字段
          })
        ).unwrap();

        message.success('模型更新成功');
        setIsEditModalVisible(false);
      }
    } catch (error) {
      console.error('验证失败:', error);
      message.error('更新模型失败');
    }
  };

  // 取消编辑模型
  const handleEditModalCancel = () => {
    setIsEditModalVisible(false);
  };

  // 获取当前模型
  const currentModel = models.find((m) => m.id === Number(modelId));

  if (loading || !currentModel) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 flex justify-center items-center">
        <div className="w-8 h-8 border-4 border-[rgb(135,75,238)] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  // 如果有错误，显示错误信息
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 flex justify-center items-center">
        <div className="text-red-500 bg-white dark:bg-slate-800 p-6 rounded-lg shadow-lg">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <div className="max-w-6xl mx-auto p-6">
        {/* 顶部导航栏 */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={handleBackToPlatforms}
              className="h-10 w-10 rounded-full bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm hover:bg-white dark:hover:bg-slate-800 shadow-sm"
            >
              <ArrowLeft size={20} />
            </Button>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-[rgb(135,75,238)] to-[rgb(135,75,238)]/80 bg-clip-text text-transparent">
                {currentModel.name}
              </h1>
              <p className="text-slate-600 dark:text-slate-400 text-sm mt-1">
                模型详情 · {getPlatformTypeName(currentPlatform?.platformType)}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <Button
              variant="outline"
              onClick={handleEditModel}
              disabled={loading}
              className="h-10 px-4 border-[rgb(135,75,238)]/30 text-[rgb(135,75,238)] hover:bg-[rgb(135,75,238)]/10 hover:border-[rgb(135,75,238)]/50"
            >
              <Edit size={16} className="mr-2" />
              编辑
            </Button>
            <Button
              variant="outline"
              onClick={handleDeleteModel}
              className="h-10 px-4 border-red-300 text-red-600 hover:bg-red-50 hover:border-red-400 dark:border-red-700 dark:text-red-400 dark:hover:bg-red-900/20"
              disabled={loading}
            >
              <Trash2 size={16} className="mr-2" />
              删除
            </Button>
          </div>
        </div>

        {/* 主要内容区域 */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* 左侧：模型基本信息 */}
          <div className="lg:col-span-2 space-y-6">
            {/* 模型概览 */}
            <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl p-6 shadow-sm border border-white/20 dark:border-slate-700/50">
              <div className="flex items-center space-x-4 mb-6">
                <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-[rgb(135,75,238)] to-[rgb(135,75,238)]/80 flex items-center justify-center">
                  <Bot size={24} className="text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-slate-900 dark:text-white">
                    模型概览
                  </h2>
                  <p className="text-slate-600 dark:text-slate-400 text-sm">
                    基本信息与配置
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <Tag size={16} className="text-[rgb(135,75,238)]" />
                    <div>
                      <p className="text-sm text-slate-500 dark:text-slate-400">
                        模型类型
                      </p>
                      <p className="font-medium text-slate-900 dark:text-white">
                        {currentModel.type}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <Database size={16} className="text-[rgb(135,75,238)]" />
                    <div>
                      <p className="text-sm text-slate-500 dark:text-slate-400">
                        所属平台
                      </p>
                      <p className="font-medium text-slate-900 dark:text-white">
                        {currentPlatform?.name || '未知平台'}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <Calendar size={16} className="text-[rgb(135,75,238)]" />
                    <div>
                      <p className="text-sm text-slate-500 dark:text-slate-400">
                        创建时间
                      </p>
                      <p className="font-medium text-slate-900 dark:text-white">
                        {currentModel.createTime
                          ? new Date(currentModel.createTime).toLocaleString()
                          : '未知'}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <Info size={16} className="text-[rgb(135,75,238)]" />
                    <div>
                      <p className="text-sm text-slate-500 dark:text-slate-400">
                        平台类型
                      </p>
                      <p className="font-medium text-slate-900 dark:text-white">
                        {getPlatformTypeName(currentPlatform?.platformType)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* 模型描述 */}
            <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl p-6 shadow-sm border border-white/20 dark:border-slate-700/50">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
                模型描述
              </h3>
              <div className="bg-slate-50 dark:bg-slate-700/50 rounded-xl p-4">
                <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                  {currentModel.description || '暂无描述信息'}
                </p>
              </div>
            </div>
          </div>

          {/* 右侧：快速操作和状态 */}
          <div className="flex flex-col space-y-6">
            {/* 模型状态 - 与左侧模型概览对齐 */}
            <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl p-6 shadow-sm border border-white/20 dark:border-slate-700/50 flex-1">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
                模型状态
              </h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-600 dark:text-slate-400">
                    运行状态
                  </span>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                    正常
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-600 dark:text-slate-400">
                    模型ID
                  </span>
                  <span className="text-sm font-mono text-slate-900 dark:text-white bg-slate-100 dark:bg-slate-700 px-2 py-1 rounded">
                    {currentModel.id}
                  </span>
                </div>
              </div>
            </div>

            {/* 快速操作 - 与左侧模型描述对齐 */}
            <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl p-6 shadow-sm border border-white/20 dark:border-slate-700/50 flex-1">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
                快速操作
              </h3>
              <div className="space-y-3">
                <Button className="w-full h-10 bg-gradient-to-r from-[rgb(135,75,238)] to-[rgb(135,75,238)]/90 hover:from-[rgb(135,75,238)]/90 hover:to-[rgb(135,75,238)]/80 text-white shadow-sm">
                  <Settings size={16} className="mr-2" />
                  配置参数
                </Button>
                <Button
                  variant="outline"
                  className="w-full h-10 border-[rgb(135,75,238)]/30 text-[rgb(135,75,238)] hover:bg-[rgb(135,75,238)]/10"
                >
                  查看日志
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 编辑模型表单模态框 */}
      <Modal
        title="编辑模型"
        open={isEditModalVisible}
        onOk={handleEditModalOk}
        onCancel={handleEditModalCancel}
        okText="更新"
        cancelText="取消"
        confirmLoading={loading}
        className="modal-theme-adaptive"
        overlayClassName="modal-overlay-theme-adaptive"
      >
        <Form form={form} layout="vertical" name="model_form">
          <Form.Item
            name="name"
            label="模型名称"
            rules={[{ required: true, message: '请输入模型名称!' }]}
          >
            <Input placeholder="例如：GPT-4, Claude-3" />
          </Form.Item>
          <Form.Item
            name="type"
            label="模型类型"
            rules={[{ required: true, message: '请选择模型类型!' }]}
          >
            <Select placeholder="选择模型类型">
              <Select.Option value={ModelType.TEXT}>文本生成</Select.Option>
              <Select.Option value={ModelType.IMAGE}>图像生成</Select.Option>
              <Select.Option value={ModelType.EMBEDDING}>
                嵌入向量
              </Select.Option>
              <Select.Option value={ModelType.RERANK}>重排序</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item name="description" label="模型描述">
            <Input.TextArea rows={4} placeholder="请输入模型描述" />
          </Form.Item>
        </Form>
      </Modal>

      {/* 删除确认对话框 */}
      <Modal
        title="确认删除"
        open={deleteConfirmVisible}
        onOk={confirmDeleteModel}
        onCancel={cancelDeleteModel}
        okText="删除"
        cancelText="取消"
        className="modal-theme-adaptive"
        overlayClassName="modal-overlay-theme-adaptive"
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
        <p>确定要删除模型 "{currentModel?.name}" 吗？此操作不可恢复。</p>
      </Modal>
    </div>
  );
};

export default ModelPage;
