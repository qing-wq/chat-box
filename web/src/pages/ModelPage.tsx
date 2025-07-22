import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '@/hooks';
import { fetchPlatformDetail } from '@/store/platformSlice';
import { fetchModelDetail, updateModel, deleteModel, ModelType } from '@/store/modelSlice';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Edit, Trash2, Settings } from 'lucide-react';
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
  const { platforms, currentPlatform } = useAppSelector(state => state.platform);
  const { models, loading, error } = useAppSelector(state => state.model);
  
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
      case PlatformType["openai-response"]:
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
    const currentModel = models.find(m => m.id === Number(modelId));
    
    if (currentModel && currentModel.platformId) {
      // 如果当前平台不存在或与模型的平台不同，则获取平台详情
      if (!currentPlatform || Number(currentPlatform.id) !== currentModel.platformId) {
        dispatch(fetchPlatformDetail(currentModel.platformId));
      }
      
      // 设置表单字段值
      form.setFieldsValue(currentModel);
    }
  }, [modelId, models, currentPlatform, dispatch, form]);

  // 返回平台详情页面
  const handleBackToPlatforms = () => {
    // 获取当前模型
    const currentModel = models.find(m => m.id === Number(modelId));
    
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
    const currentModel = models.find(m => m.id === Number(modelId));
    if (currentModel) {
      form.setFieldsValue(currentModel);
      setIsEditModalVisible(true);
    }
  };

  // 删除确认状态
  const [deleteConfirmVisible, setDeleteConfirmVisible] = useState(false);

  // 删除模型
  const handleDeleteModel = () => {
    const currentModel = models.find(m => m.id === Number(modelId));
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
      const currentModel = models.find(m => m.id === Number(modelId));
      
      if (currentModel) {
        // 调用更新模型的API
        await dispatch(updateModel({
          id: Number(modelId),
          name: values.name,
          type: values.type,
          description: values.description // 添加description字段
        })).unwrap();
        
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
  const currentModel = models.find(m => m.id === Number(modelId));

  if (loading || !currentModel) {
    return (
      <div className="p-6 flex justify-center items-center">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }
  
  // 如果有错误，显示错误信息
  if (error) {
    return (
      <div className="p-6 flex justify-center items-center">
        <div className="text-destructive">{error}</div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl">
      {/* 返回按钮和标题 */}
      <div className="flex items-center mb-6">
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={handleBackToPlatforms}
          className="mr-2"
        >
          <ArrowLeft size={20} />
        </Button>
        <h1 className="text-2xl font-bold">{currentModel.name}</h1>
      </div>

      {/* 模型详情卡片 */}
      <Card className="shadow-md mb-6">
        <CardHeader>
          <CardTitle className="flex justify-between items-center">
            <span>模型详情</span>
            <div className="flex gap-2">
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={handleEditModel}
                disabled={loading}
              >
                <Edit size={18} />
              </Button>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={handleDeleteModel}
                className="text-destructive hover:text-destructive hover:bg-destructive/10"
                disabled={loading}
              >
                <Trash2 size={18} />
              </Button>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-1">模型名称</h3>
              <p>{currentModel.name}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-1">模型类型</h3>
              <p>{currentModel.type}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-1">平台类型</h3>
              <p>{getPlatformTypeName(currentPlatform?.platformType)}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-1">所属平台</h3>
              <p>{currentPlatform?.name || '未知平台'}</p>
            </div>
            <div className="col-span-2">
              <h3 className="text-sm font-medium text-muted-foreground mb-1">模型描述</h3>
              <p>{currentModel.description || '暂无描述'}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-1">创建时间</h3>
              <p>{currentModel.createTime ? new Date(currentModel.createTime).toLocaleString() : '未知'}</p>
            </div>
          </div>
        </CardContent>
      </Card>

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
        <Form
          form={form}
          layout="vertical"
          name="model_form"
        >
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
              <Select.Option value={ModelType.EMBEDDING}>嵌入向量</Select.Option>
              <Select.Option value={ModelType.RERANK}>重排序</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item
            name="description"
            label="模型描述"
          >
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
          className: "bg-gradient-to-r from-primary to-primary/90",
          style: {
            background: 'linear-gradient(to right, hsl(262, 83%, 58%), hsla(262, 83%, 58%, 0.9))',
            borderColor: 'hsl(262, 83%, 58%)',
            color: '#fff'
          }
        }}
        cancelButtonProps={{
          className: "",
          style: {
            borderColor: '#d9d9d9',
            color: 'rgba(0, 0, 0, 0.88)'
          }
        }}
      >
        <p>确定要删除模型 "{currentModel?.name}" 吗？此操作不可恢复。</p>
      </Modal>
    </div>
  );
};

export default ModelPage;