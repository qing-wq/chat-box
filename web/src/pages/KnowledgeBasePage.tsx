import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../hooks';
import { fetchKnowledgeBaseList, createKnowledgeBase, deleteKnowledgeBase } from '../store/knowledgeBaseSlice';
import { fetchModelList, ModelType } from '../store/modelSlice';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input as ShadcnInput } from '@/components/ui/input';
import { Database, Plus, Trash2, Search } from 'lucide-react';
import { Form, Input, Select, message, Modal } from 'antd';

const { Option } = Select;

const KnowledgeBasePage: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { knowledgeBases, loading, error } = useAppSelector(state => state.knowledgeBase);
  const { modelList, loading: modelLoading } = useAppSelector(state => state.model);
  
  // 创建知识库对话框状态
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  
  // 删除确认状态
  const [deleteConfirmVisible, setDeleteConfirmVisible] = useState(false);
  const [deletingKnowledgeBaseId, setDeletingKnowledgeBaseId] = useState<string | null>(null);
  
  // 搜索状态
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
  
  // 自定义防抖 Hook
  const useDebounce = (value: string, delay: number) => {
    const [debouncedValue, setDebouncedValue] = useState(value);
    
    useEffect(() => {
      const handler = setTimeout(() => {
        setDebouncedValue(value);
      }, delay);
      
      return () => {
        clearTimeout(handler);
      };
    }, [value, delay]);
    
    return debouncedValue;
  };
  
  // 使用防抖
  const debouncedSearch = useDebounce(searchTerm, 500);
  
  useEffect(() => {
    setDebouncedSearchTerm(debouncedSearch);
  }, [debouncedSearch]);
  
  // 过滤知识库列表
  const filteredKnowledgeBases = useMemo(() => {
    if (!debouncedSearchTerm.trim()) {
      return knowledgeBases;
    }
    return knowledgeBases.filter(kb => 
      kb.title.toLowerCase().includes(debouncedSearchTerm.toLowerCase())
    );
  }, [knowledgeBases, debouncedSearchTerm]);

  useEffect(() => {
    // 组件挂载时获取知识库列表
    dispatch(fetchKnowledgeBaseList());
  }, [dispatch]);
  
  // 跳转到知识库详情页面
  const handleKnowledgeBaseClick = (kbId: string) => {
    navigate(`/knowledge-base/${kbId}`);
  };

  // 打开创建知识库对话框时获取模型列表
  const handleCreateKnowledgeBase = () => {
    setIsModalVisible(true);
    // 获取嵌入模型列表
    dispatch(fetchModelList(ModelType.EMBEDDING));
    form.resetFields();
  };
  
  // 处理对话框确认
  const handleModalOk = async () => {
    try {
      const values = await form.validateFields();
      
      // 创建知识库
      await dispatch(createKnowledgeBase({
        title: values.title,
        remark: values.remark,
        embeddingModelId: values.embeddingModelId,
        qaModelId: values.qaModelId
      })).unwrap();
      
      message.success('知识库创建成功');
      setIsModalVisible(false);
      form.resetFields();
    } catch (error) {
      console.error('验证失败:', error);
      // API 错误已在 useEffect 中处理
    }
  };
  
  // 处理对话框取消
  const handleModalCancel = () => {
    setIsModalVisible(false);
    form.resetFields();
  };
  
  // 删除知识库
  const handleDeleteKnowledgeBase = (e: React.MouseEvent, kbId: string) => {
    e.stopPropagation(); // 阻止事件冒泡，避免触发卡片点击
    setDeletingKnowledgeBaseId(kbId);
    setDeleteConfirmVisible(true);
  };
  
  // 确认删除知识库
  const confirmDeleteKnowledgeBase = async () => {
    if (!deletingKnowledgeBaseId) return;
    
    try {
      await dispatch(deleteKnowledgeBase(Number(deletingKnowledgeBaseId))).unwrap();
      message.success('知识库删除成功');
    } catch (error) {
      message.error('删除知识库失败');
    } finally {
      setDeleteConfirmVisible(false);
      setDeletingKnowledgeBaseId(null);
    }
  };
  
  // 取消删除知识库
  const cancelDeleteKnowledgeBase = () => {
    setDeleteConfirmVisible(false);
    setDeletingKnowledgeBaseId(null);
  };

  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">知识库管理</h1>
        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <ShadcnInput
              placeholder="搜索知识库..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-64"
            />
          </div>
          <Button className="flex items-center gap-2" onClick={handleCreateKnowledgeBase}>
            <Plus className="w-4 h-4" />
            创建知识库
          </Button>
        </div>
      </div>

      {loading && <p className="text-center py-4">加载中...</p>}
      {error && <p className="text-center py-4 text-destructive">{error}</p>}

      {!loading && knowledgeBases.length === 0 && (
        <div className="text-center py-12">
          <Database className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
          <h2 className="text-xl font-semibold mb-2">暂无知识库</h2>
          <p className="text-muted-foreground mb-4">创建一个知识库开始使用</p>
        </div>
      )}
      
      {!loading && knowledgeBases.length > 0 && filteredKnowledgeBases.length === 0 && debouncedSearchTerm && (
        <div className="text-center py-12">
          <Search className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
          <h2 className="text-xl font-semibold mb-2">未找到匹配的知识库</h2>
          <p className="text-muted-foreground mb-4">尝试使用其他关键词搜索</p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredKnowledgeBases.map(kb => (
          <Card 
            key={kb.id} 
            className="cursor-pointer hover:shadow-md hover:border-primary/50 transition-all relative"
            onClick={() => handleKnowledgeBaseClick(kb.id)}
          >
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="w-4 h-4" />
                {kb.title}
              </CardTitle>
              <CardDescription>{kb.remark || '无描述'}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>{kb.isPublic ? '公开' : '私有'}</span>
              </div>
            </CardContent>
            {/* 删除按钮 */}
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={(e) => handleDeleteKnowledgeBase(e, kb.id)}
              className="absolute bottom-2 right-2 text-destructive hover:text-destructive hover:bg-destructive/10 w-8 h-8"
            >
              <Trash2 size={16} />
            </Button>
          </Card>
        ))}
      </div>
      
      {/* 创建知识库对话框 */}
      <Modal
        title="创建新知识库"
        open={isModalVisible}
        onOk={handleModalOk}
        onCancel={handleModalCancel}
        okText="创建"
        cancelText="取消"
        confirmLoading={loading}
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
        <Form
          form={form}
          layout="vertical"
          name="knowledge_base_form"
        >
          <Form.Item
            name="title"
            label="知识库标题"
            rules={[{ required: true, message: '请输入知识库标题!' }]}
          >
            <Input placeholder="请输入知识库标题" />
          </Form.Item>
          
          <Form.Item
            name="remark"
            label="知识库描述"
          >
            <Input.TextArea rows={4} placeholder="请输入知识库描述" />
          </Form.Item>
          
          <Form.Item
            name="embeddingModelId"
            label="嵌入模型"
          >
            <Select 
              placeholder="选择嵌入模型"
              onClick={() => dispatch(fetchModelList(ModelType.EMBEDDING))}
              loading={modelLoading}
            >
              {modelList && (
                Array.isArray(modelList) 
                ? modelList.map(model => (
                    <Option key={model.id} value={model.id}>{model.name}</Option>
                  ))
                : modelList[ModelType.EMBEDDING] 
                  ? modelList[ModelType.EMBEDDING].map(model => (
                      <Option key={model.id} value={model.id}>{model.name}</Option>
                    ))
                  : null
              )}
            </Select>
          </Form.Item>
          
          <Form.Item
            name="qaModelId"
            label="问答模型"
          >
            <Select 
              placeholder="选择问答模型"
              onClick={() => dispatch(fetchModelList(ModelType.TEXT))}
              loading={modelLoading}
            >
              {modelList && (
                Array.isArray(modelList) 
                ? modelList.map(model => (
                    <Option key={model.id} value={model.id}>{model.name}</Option>
                  ))
                : modelList[ModelType.TEXT] 
                  ? modelList[ModelType.TEXT].map(model => (
                      <Option key={model.id} value={model.id}>{model.name}</Option>
                    ))
                  : null
              )}
            </Select>
          </Form.Item>
        </Form>
      </Modal>
      
      {/* 删除确认对话框 */}
      <Modal
        title="确认删除"
        open={deleteConfirmVisible}
        onOk={confirmDeleteKnowledgeBase}
        onCancel={cancelDeleteKnowledgeBase}
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
        <p>确定要删除知识库 "{knowledgeBases.find(kb => kb.id === deletingKnowledgeBaseId)?.title}" 吗？此操作不可恢复。</p>
      </Modal>
    </div>
  );
};

export default KnowledgeBasePage;