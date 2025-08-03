import React, { useEffect, useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../hooks';
import { fetchKnowledgeBaseDetail, fetchKnowledgeBaseItems, updateKnowledgeBase, uploadDocsToKnowledgeBase, deleteKnowledgeBaseItem } from '../store/knowledgeBaseSlice';
import { fetchModelList, ModelType } from '../store/modelSlice';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { ArrowLeft, Database, Search, Upload, FileText, AlertCircle } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';


interface KnowledgeDetailPageParams {
  kbId: string;
}

const KnowledgeDetailPage: React.FC = () => {
  const { kbId } = useParams<KnowledgeDetailPageParams>();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const { currentKnowledgeBase, knowledgeBaseItems, loading, error } = useAppSelector(state => state.knowledgeBase);
  const { modelList } = useAppSelector(state => state.model);
  
  const [activeTab, setActiveTab] = useState('dataset');
  const [formData, setFormData] = useState({
    title: '',
    remark: '',
    isPublic: false,
    embeddingModelId: '',
    qaModelId: '',
    processType: '',
    blockSize: '',
    maxOverlap: '',
    qaPrompt: '',
    retrieveMaxResults: '',
    retrieveMinScore: ''
  });
  const [originalData, setOriginalData] = useState({
    title: '',
    remark: '',
    isPublic: false,
    embeddingModelId: '',
    qaModelId: '',
    processType: '',
    blockSize: '',
    maxOverlap: '',
    qaPrompt: '',
    retrieveMaxResults: '',
    retrieveMinScore: ''
  });
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    if (kbId) {
      // 获取知识库详情
      dispatch(fetchKnowledgeBaseDetail(kbId));
      // 获取知识库条目列表
      dispatch(fetchKnowledgeBaseItems(kbId));
      // 获取嵌入模型列表
      dispatch(fetchModelList(ModelType.EMBEDDING));
      // 获取文本模型列表（用于问答模型）
      dispatch(fetchModelList(ModelType.TEXT));
    }
  }, [kbId, dispatch]);

  // 当知识库详情加载完成后，初始化表单数据
  useEffect(() => {
    if (currentKnowledgeBase?.knowledgeBase) {
      const kb = currentKnowledgeBase.knowledgeBase;
      const data = {
        title: kb.title || '',
        remark: kb.remark || '',
        isPublic: kb.isPublic || false,
        embeddingModelId: kb.embeddingModelId?.toString() || '',
        qaModelId: kb.qaModelId?.toString() || '',
        processType: kb.processType || '',
        blockSize: kb.blockSize?.toString() || '',
        maxOverlap: kb.maxOverlap?.toString() || '',
        qaPrompt: kb.qaPrompt || '',
        retrieveMaxResults: kb.retrieveMaxResults?.toString() || '',
        retrieveMinScore: kb.retrieveMinScore?.toString() || ''
      };
      setFormData(data);
      setOriginalData(data);
    }
  }, [currentKnowledgeBase]);

  // 返回知识库列表
  const handleBack = () => {
    navigate('/knowledge-base');
  };

  // 处理表单输入变化
  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // 检查数据是否有变更
  const hasChanges = () => {
    return JSON.stringify(formData) !== JSON.stringify(originalData);
  };

  // 保存知识库信息
  const handleSave = async () => {
    if (!hasChanges() || !kbId) {
      return; // 没有变更或没有知识库ID，不执行保存
    }

    setIsSaving(true);
    try {
      const updateData = {
        id: kbId,
        title: formData.title,
        remark: formData.remark,
        isPublic: formData.isPublic,
        embeddingModelId: formData.embeddingModelId ? parseInt(formData.embeddingModelId) : undefined,
        qaModelId: formData.qaModelId ? parseInt(formData.qaModelId) : undefined,
        processType: formData.processType,
        blockSize: formData.blockSize ? parseInt(formData.blockSize) : undefined,
        maxOverlap: formData.maxOverlap ? parseInt(formData.maxOverlap) : undefined,
        qaPrompt: formData.qaPrompt,
        retrieveMaxResults: formData.retrieveMaxResults ? parseInt(formData.retrieveMaxResults) : undefined,
        retrieveMinScore: formData.retrieveMinScore ? parseFloat(formData.retrieveMinScore) : undefined
      };
      
      await dispatch(updateKnowledgeBase(updateData)).unwrap();
      // 更新成功后，将当前数据设为原始数据
      setOriginalData(formData);
    } catch (error) {
      console.error('保存失败:', error);
    } finally {
      setIsSaving(false);
    }
  };

  // 获取嵌入模型名称
  const embeddingModelName = useMemo(() => {
    if (!modelList?.embedding || !formData.embeddingModelId) return "选择嵌入模型";
    const model = modelList.embedding.find(m => m.id.toString() === formData.embeddingModelId.toString());
    return model?.name || formData.embeddingModelId;
  }, [modelList?.embedding, formData.embeddingModelId]);

  // 获取问答模型名称
  const qaModelName = useMemo(() => {
    if (!modelList?.text || !formData.qaModelId) return "选择问答模型";
    const model = modelList.text.find(m => m.id.toString() === formData.qaModelId.toString());
    return model?.name || formData.qaModelId;
  }, [modelList?.text, formData.qaModelId]);

  // 处理文件上传
  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0 || !kbId) return;

    setIsUploading(true);
    try {
      const fileArray = Array.from(files);
      await dispatch(uploadDocsToKnowledgeBase({ kbId, files: fileArray })).unwrap();
      // 上传成功后刷新知识库条目列表
      dispatch(fetchKnowledgeBaseItems(kbId));
    } catch (error) {
      console.error('上传文件失败:', error);
    } finally {
      setIsUploading(false);
      // 清空文件输入
      event.target.value = '';
    }
  };

  // 处理删除条目
  const handleDeleteItem = async (itemId: number) => {
    if (!itemId) return;
    
    if (window.confirm('确定要删除这个条目吗？此操作不可恢复。')) {
      try {
        await dispatch(deleteKnowledgeBaseItem(itemId.toString())).unwrap();
        // 删除成功后刷新知识库条目列表
        if (kbId) {
          dispatch(fetchKnowledgeBaseItems(kbId));
        }
      } catch (error) {
        console.error('删除条目失败:', error);
      }
    }
  };

  if (loading) {
    return (
      <div className="p-6 flex justify-center items-center">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 flex justify-center items-center">
        <div className="text-destructive">{error}</div>
      </div>
    );
  }

  if (!currentKnowledgeBase) {
    return (
      <div className="p-6 flex justify-center items-center">
        <div className="text-muted-foreground">知识库不存在</div>
      </div>
    );
  }

  const { knowledgeBase, itemLists } = currentKnowledgeBase;

  return (
    <div className="flex flex-col h-screen">
      {/* 顶部导航栏 */}
      <div className="flex items-center justify-between p-4 border-b bg-background">
        {/* 左侧：返回按钮和知识库名字 */}
        <div className="flex items-center gap-3">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={handleBack}
          >
            <ArrowLeft size={20} />
          </Button>
          <div className="flex items-center gap-2">
            <Database className="w-5 h-5" />
            <h1 className="text-xl font-semibold">{knowledgeBase.title}</h1>
          </div>
        </div>
        
        {/* 右侧：数据集和搜索测试切换按钮 */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-auto">
          <TabsList className="grid w-full grid-cols-2 max-w-md">
            <TabsTrigger value="dataset" className="flex items-center gap-2">
              <FileText className="w-4 h-4" />
              数据集
            </TabsTrigger>
            <TabsTrigger value="search" className="flex items-center gap-2">
              <Search className="w-4 h-4" />
              搜索测试
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* 主要内容区域 - 左右两栏布局 */}
      <div className="flex flex-1 overflow-hidden">
        {/* 左侧栏 - 知识库信息编辑 */}
        <div className="w-1/3 border-r bg-background flex flex-col">
          <Card className="h-full border-0 rounded-none flex flex-col">
            <CardHeader className="pb-4 flex-shrink-0">
              <CardTitle className="text-lg">
                知识库设置
              </CardTitle>
            </CardHeader>
            <CardContent className="flex-1 overflow-hidden flex flex-col">
              <ScrollArea className="flex-1 pr-4">
                <div className="space-y-4">
                  {/* 标题 */}
                  <div>
                    <Label htmlFor="title" className="text-sm font-medium">
                      标题
                    </Label>
                    <Input
                      id="title"
                      value={formData.title}
                      onChange={(e) => handleInputChange('title', e.target.value)}
                      className="mt-1 ml-1 w-[97%]"
                    />
                  </div>
                  
                  {/* 描述 */}
                  <div>
                    <Label htmlFor="remark" className="text-sm font-medium">
                      描述
                    </Label>
                    <Textarea
                      id="remark"
                      value={formData.remark}
                      onChange={(e) => handleInputChange('remark', e.target.value)}
                      className="mt-1 ml-1 w-[97%]"
                      rows={3}
                      placeholder="请输入描述"
                    />
                  </div>
                  
                  {/* 可见性 */}
                  <div>
                    <Label className="text-sm font-medium">
                      可见性
                    </Label>
                    <div className="flex items-center gap-2 mt-1">
                      <Switch
                        checked={formData.isPublic}
                        onCheckedChange={(checked) => handleInputChange('isPublic', checked)}
                      />
                      <span className="text-sm">{formData.isPublic ? '公开' : '私有'}</span>
                    </div>
                  </div>
                  
                  <Separator />
                  
                  {/* 嵌入模型 */}
                  <div>
                    <Label htmlFor="embeddingModel" className="text-sm font-medium">
                      嵌入模型
                    </Label>
                    <Select
                      value={formData.embeddingModelId}
                      onValueChange={(value) => handleInputChange('embeddingModelId', value)}
                    >
                      <SelectTrigger className="mt-1 ml-1 w-[97%]">
                        <SelectValue>
                          {embeddingModelName}
                        </SelectValue>
                      </SelectTrigger>
                      <SelectContent>
                        {modelList?.embedding?.map((model) => (
                          <SelectItem key={model.id} value={model.id.toString()}>
                            {model.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  {/* 问答模型 */}
                  <div>
                    <Label htmlFor="qaModel" className="text-sm font-medium">
                      问答模型
                    </Label>
                    <Select
                      value={formData.qaModelId}
                      onValueChange={(value) => handleInputChange('qaModelId', value)}
                    >
                      <SelectTrigger className="mt-1 ml-1 w-[97%]">
                        <SelectValue>
                          {qaModelName}
                        </SelectValue>
                      </SelectTrigger>
                      <SelectContent>
                        {modelList?.text?.map((model) => (
                          <SelectItem key={model.id} value={model.id.toString()}>
                            {model.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  {/* 问答提示词 */}
                  <div>
                    <Label htmlFor="qaPrompt" className="text-sm font-medium">
                      问答提示词
                    </Label>
                    <Textarea
                      id="qaPrompt"
                      value={formData.qaPrompt}
                      onChange={(e) => handleInputChange('qaPrompt', e.target.value)}
                      className="mt-1 ml-1 w-[97%]"
                      rows={4}
                      placeholder="请输入问答提示词"
                    />
                  </div>
                  
                  {/* 处理方式 */}
                  <div>
                    <Label htmlFor="processType" className="text-sm font-medium">
                      处理方式
                    </Label>
                    <Select
                      value={formData.processType}
                      onValueChange={(value) => handleInputChange('processType', value)}
                    >
                      <SelectTrigger className="mt-1 ml-1 w-[97%]">
                        <SelectValue placeholder="选择处理方式" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="direct">直接分段</SelectItem>
                        <SelectItem value="enhanced">增强处理</SelectItem>
                        <SelectItem value="qa_split">问答拆分</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  {/* 块大小 */}
                  <div>
                    <Label htmlFor="blockSize" className="text-sm font-medium">
                      块大小
                    </Label>
                    <Input
                      id="blockSize"
                      type="number"
                      value={formData.blockSize}
                      onChange={(e) => handleInputChange('blockSize', e.target.value)}
                      className="mt-1 ml-1 w-[97%]"
                      placeholder="请输入块大小"
                    />
                  </div>
                  
                  {/* 最大重叠 */}
                  <div>
                    <Label htmlFor="maxOverlap" className="text-sm font-medium">
                      最大重叠
                    </Label>
                    <Input
                      id="maxOverlap"
                      type="number"
                      value={formData.maxOverlap}
                      onChange={(e) => handleInputChange('maxOverlap', e.target.value)}
                      className="mt-1 ml-1 w-[97%]"
                      placeholder="请输入最大重叠"
                    />
                  </div>
                  
                  {/* 检索最大结果数 */}
                  <div>
                    <Label htmlFor="retrieveMaxResults" className="text-sm font-medium">
                      检索最大结果数
                    </Label>
                    <Input
                      id="retrieveMaxResults"
                      type="number"
                      value={formData.retrieveMaxResults}
                      onChange={(e) => handleInputChange('retrieveMaxResults', e.target.value)}
                      className="mt-1 ml-1 w-[97%]"
                      placeholder="请输入检索最大结果数"
                    />
                  </div>
                  
                  {/* 检索最小分数 */}
                  <div>
                    <Label htmlFor="retrieveMinScore" className="text-sm font-medium">
                      检索最小分数
                    </Label>
                    <Input
                      id="retrieveMinScore"
                      type="number"
                      step="0.1"
                      min="0"
                      max="100"
                      value={formData.retrieveMinScore}
                      onChange={(e) => {
                        const value = parseFloat(e.target.value);
                        if ((value >= 0 && value <= 100) || e.target.value === '') {
                          handleInputChange('retrieveMinScore', e.target.value);
                        }
                      }}
                      className="mt-1 ml-1 w-[97%]"
                      placeholder="请输入检索最小分数"
                    />
                  </div>
                  
                  <Separator />
                  
                  {/* 创建时间 */}
                  <div>
                    <Label className="text-sm font-medium">创建时间</Label>
                    <p className="text-sm mt-1 p-2 bg-muted rounded">
                      {knowledgeBase.createTime ? new Date(knowledgeBase.createTime).toLocaleString() : '未知'}
                    </p>
                  </div>
                  
                  {/* 更新时间 */}
                  <div>
                    <Label className="text-sm font-medium">更新时间</Label>
                    <p className="text-sm mt-1 p-2 bg-muted rounded">
                      {knowledgeBase.updateTime ? new Date(knowledgeBase.updateTime).toLocaleString() : '未知'}
                    </p>
                  </div>
                </div>
              </ScrollArea>
              <div className="flex gap-2 pt-4 border-t flex-shrink-0">
                <Button 
                  onClick={handleSave} 
                  disabled={isSaving || !hasChanges()}
                >
                  {isSaving ? '保存中...' : '保存'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* 右侧栏 - 数据集或搜索测试内容 */}
        <div className="flex-1 overflow-hidden flex flex-col">
          {/* 内容区域 */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full flex flex-col">
            <TabsContent value="dataset" className="h-full mt-0 flex flex-col">
              <Card className="h-full border-0 rounded-none flex flex-col">
                <CardHeader className="pb-4 flex-shrink-0">
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <FileText className="w-5 h-5" />
                      数据集管理
                    </CardTitle>
                    <div className="relative">
                      <input
                        type="file"
                        multiple
                        accept=".pdf,.doc,.docx,.txt,.md"
                        onChange={handleFileUpload}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        disabled={isUploading}
                      />
                      <Button className="flex items-center gap-2" disabled={isUploading}>
                        <Upload className="w-4 h-4" />
                        {isUploading ? '上传中...' : '上传文档'}
                      </Button>
                    </div>
                  </div>
                  <CardDescription>
                    管理知识库中的文档和数据
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex-1 overflow-hidden">
                  <ScrollArea className="h-full">
                    {knowledgeBaseItems && knowledgeBaseItems.length > 0 ? (
                    <div className="space-y-4">
                      {knowledgeBaseItems.map((item) => (
                        <Card key={item.id} className="border">
                          <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                              <div className="flex-1">
                                <h4 className="font-medium">{item.title || '未命名文档'}</h4>
                                <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                                  <span>处理类型: {item.processType || '默认'}</span>
                                  <span>块数: {item.chunks || 0}</span>
                                  <Badge 
                                    variant={item.embeddingStatus === 'completed' ? 'default' : 'secondary'}
                                    className="text-xs"
                                  >
                                    {item.embeddingStatus || '未知状态'}
                                  </Badge>
                                  <Badge 
                                    variant={item.isEnable ? 'default' : 'destructive'}
                                    className="text-xs"
                                  >
                                    {item.isEnable ? '启用' : '禁用'}
                                  </Badge>
                                </div>
                              </div>
                              <div className="flex items-center gap-2">
                                <Button variant="outline" size="sm">
                                  编辑
                                </Button>
                                <Button 
                                  variant="outline" 
                                  size="sm" 
                                  className="text-destructive hover:bg-destructive/10"
                                  onClick={() => handleDeleteItem(item.id!)}
                                >
                                  删除
                                </Button>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  ) : (
                      <div className="text-center py-12">
                        <FileText className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                        <h3 className="text-lg font-semibold mb-2">暂无数据</h3>
                        <p className="text-muted-foreground mb-4">上传文档开始构建知识库</p>
                      </div>
                    )}
                  </ScrollArea>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="search" className="h-full mt-0 flex flex-col">
              {/* TODO: 搜索测试功能 */}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default KnowledgeDetailPage;