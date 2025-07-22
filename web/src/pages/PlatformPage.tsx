import React, { useState, useEffect } from 'react';
import { Form, Input, Select, message, Modal } from 'antd';
import { useAppSelector, useAppDispatch, useTheme } from '@/hooks';
import { 
  fetchPlatformList, 
  createPlatform, 
  updatePlatformApi, 
  deletePlatformApi, 
  fetchPlatformDetail,
  clearError,
  setCurrentPlatform
} from '@/store/platformSlice';
import { createModel, ModelType } from '@/store/modelSlice';
import { Platform, PlatformType } from '@/types';
import { Plus, Edit, Trash2, Bot } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { useNavigate, useLocation } from 'react-router-dom';

const { Option } = Select;

const PlatformPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { platforms, loading, error, currentPlatform } = useAppSelector(state => state.platform);
  const { isDarkMode } = useTheme();
  const [isPlatformModalVisible, setIsPlatformModalVisible] = useState(false);
  const [isModelModalVisible, setIsModelModalVisible] = useState(false);
  const [editingPlatform, setEditingPlatform] = useState<Platform | null>(null);
  const [platformForm] = Form.useForm();
  const [modelForm] = Form.useForm();

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
      platformType: platform.platformType
    });
  };

  // Handle selecting a platform to view details
  const handleSelectPlatform = (platform: Platform) => {
    if (platform.id) {
      // 获取平台详情
      dispatch(fetchPlatformDetail(Number(platform.id)));
      // 然后更新URL，但不触发页面跳转
      window.history.replaceState(null, '', `/platforms?platformId=${platform.id}`);
    }
  };

  // Handle navigating to model details
  const handleModelClick = (modelId: number) => {
    navigate(`/models/${modelId}`);
  };

  // 删除确认状态
  const [deleteConfirmVisible, setDeleteConfirmVisible] = useState(false);
  const [deletingPlatformId, setDeletingPlatformId] = useState<string | null>(null);

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
        await dispatch(updatePlatformApi({
          id: Number(editingPlatform.id),
          apiKey: values.apiKey,
          baseUrl: values.baseUrl,
          // 确保不会修改平台名称和类型
          name: editingPlatform.name,
          platformType: editingPlatform.platformType
        })).unwrap();
        message.success('平台更新成功');
      } else {
        // 创建平台
        await dispatch(createPlatform({
          name: values.name,
          type: values.platformType,
          apiKey: values.apiKey,
          baseUrl: values.baseUrl
        })).unwrap();
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
      await dispatch(createModel({
        modelId: values.modelId,
        name: values.name,
        platformId: values.platformId,
        modelType: values.modelType
      })).unwrap();
      
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
    <div className="p-6  h-full flex">
      {/* Left Sidebar for Platform List */}
      <div className="w-64 flex-shrink-0 mr-6">
        <Card className="shadow-md h-full">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">模型平台管理</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button
              onClick={handleCreatePlatform}
              className={cn(
                "w-full h-10 bg-gradient-to-r from-primary to-primary/90 hover:from-primary/80 hover:to-primary/70 shadow-sm",
                "hover:shadow-md hover:scale-[1.02] transition-all duration-200",
                "disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              )}
              disabled={loading}
            >
              <Plus size={16} className="mr-2" />
              创建新平台
            </Button>
            <div className="space-y-2">
              {platforms.length === 0 && !loading ? (
                <p className="text-muted-foreground text-sm text-center py-4">暂无平台</p>
              ) : (
                platforms.map(platform => (
                  <div
                    key={platform.id}
                    className={cn(
                      "flex items-center justify-between p-3 rounded-md border bg-card",
                      "hover:bg-accent hover:text-accent-foreground transition-colors transition-all",
                      currentPlatform?.id === platform.id ? "bg-accent text-accent-foreground" : ""
                    )}
                    onClick={() => handleSelectPlatform(platform)}
                    style={{ cursor: 'pointer' }}
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium truncate">{platform.name}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEditPlatform(platform);
                        }}
                        className="h-7 w-7 hover:bg-accent"
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
                        className="h-7 w-7 text-destructive hover:text-destructive hover:bg-destructive/10"
                        disabled={loading}
                      >
                        <Trash2 size={14} />
                      </Button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Right Content Area */}
      <div className="flex-1">
        <Card className="shadow-md h-full ">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg font-semibold  flex items-center gap-2">
              {currentPlatform?.platformType === PlatformType[PlatformType.openai] && <svg t="1753004630593" className="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="4597" width="32" height="32"><path d="M877.312 434.688c10.666667-29.354667 13.354667-58.709333 10.666667-88.021333-2.645333-29.354667-13.312-58.666667-26.666667-85.333334-23.978667-40.021333-58.666667-72.021333-98.645333-90.666666-42.666667-18.688-88.021333-24.021333-133.333334-13.354667-21.333333-21.333333-45.354667-39.978667-72.021333-53.333333C530.645333 90.709333 498.645333 85.333333 469.333333 85.333333a220.586667 220.586667 0 0 0-128 40.021334c-37.333333 26.624-64 64-77.354666 106.666666-32 7.978667-58.666667 21.333333-85.333334 37.333334-23.978667 18.645333-42.666667 42.666667-58.666666 66.645333-23.978667 40.021333-32 85.333333-26.666667 130.688a232.021333 232.021333 0 0 0 53.333333 122.624 200.32 200.32 0 0 0-10.666666 88.021333c2.688 29.354667 13.354667 58.666667 26.666666 85.333334 24.021333 40.021333 58.666667 72.021333 98.688 90.666666 42.666667 18.688 87.978667 24.021333 133.333334 13.354667 21.333333 21.333333 45.312 39.978667 71.978666 53.333333 26.666667 13.312 58.666667 18.645333 88.021334 18.645334a220.586667 220.586667 0 0 0 128-40.021334c37.333333-26.666667 64-64 77.312-106.666666a193.834667 193.834667 0 0 0 82.688-37.333334c23.978667-18.645333 45.312-39.978667 58.666666-66.645333 23.978667-40.021333 32-85.333333 26.666667-130.688-5.333333-45.312-21.333333-87.978667-50.688-122.624z m-320 448c-42.666667 0-74.666667-13.354667-103.978667-37.333333 0 0 2.645333-2.688 5.333334-2.688l170.666666-98.688a20.821333 20.821333 0 0 0 10.666667-10.666667c2.645333-5.333333 2.645333-7.978667 2.645333-13.312V480l72.021334 42.666667v197.333333a157.226667 157.226667 0 0 1-157.354667 162.688zM213.333333 736c-18.688-32-26.666667-69.333333-18.688-106.666667 0 0 2.688 2.688 5.333334 2.688l170.666666 98.645334a24.021333 24.021333 0 0 0 13.354667 2.688c5.333333 0 10.666667 0 13.312-2.688l208-120.021334v82.688l-173.312 101.333334A158.293333 158.293333 0 0 1 311.978667 810.666667c-42.666667-10.666667-77.312-37.333333-98.645334-74.666667zM167.978667 365.312a162.432 162.432 0 0 1 82.688-69.290667v202.666667c0 5.290667 0 10.666667 2.645333 13.312a20.821333 20.821333 0 0 0 10.666667 10.666667l208 120.021333-71.978667 42.666667-170.666667-98.688a157.738667 157.738667 0 0 1-74.666666-96c-10.666667-40.021333-8.021333-88.021333 13.312-125.354667zM757.333333 501.333333l-208-120.021333 71.978667-42.666667 170.666667 98.688c26.666667 16 48 37.333333 61.354666 64 13.312 26.666667 21.333333 56.021333 18.645334 88.021334a158.634667 158.634667 0 0 1-32 82.645333c-18.645333 24.021333-42.666667 42.666667-71.978667 53.333333v-202.666666c0-5.333333 0-10.666667-2.688-13.354667 0 0-2.645333-5.290667-7.978667-7.978667z m71.978667-106.666666s-2.645333-2.688-5.333333-2.688l-170.666667-98.645334c-5.333333-2.688-7.978667-2.688-13.312-2.688s-10.666667 0-13.354667 2.688L418.645333 413.354667V330.666667l173.354667-101.333334c26.666667-16 55.978667-21.333333 87.978667-21.333333 29.354667 0 58.666667 10.666667 85.333333 29.354667 24.021333 18.645333 45.354667 42.666667 56.021333 69.333333s13.312 58.666667 7.978667 87.978667z m-448 149.333333l-71.978667-42.666667V301.312c0-29.312 7.978667-61.312 23.978667-85.333333C349.312 189.354667 373.333333 170.666667 400 157.354667a143.573333 143.573333 0 0 1 87.978667-13.312c29.354667 2.688 58.666667 16 82.688 34.688 0 0-2.688 2.645333-5.333334 2.645333l-170.666666 98.688a20.821333 20.821333 0 0 0-10.666667 10.666667c-2.688 5.333333-2.688 7.978667-2.688 13.312v240z m37.333333-85.333333L512 405.333333l93.312 53.333334v106.666666L512 618.666667l-93.354667-53.333334v-106.666666z" p-id="4598" fill={isDarkMode ? "#ffffff" : "#000000"}></path></svg>}
              {currentPlatform?.platformType === PlatformType[PlatformType.gemini] && <svg t="1753004680193" className="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="6657" width="32" height="32"><path d="M960 512.896A477.248 477.248 0 0 0 512.896 960h-1.792A477.184 477.184 0 0 0 64 512.896v-1.792A477.184 477.184 0 0 0 511.104 64h1.792A477.248 477.248 0 0 0 960 511.104z" fill={isDarkMode ? "#ffffff" : "#448AFF"} p-id="6658"></path></svg>}
              {currentPlatform?.platformType === PlatformType[PlatformType.anthropic] && <svg t="1753004722387" className="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="7648" width="32" height="32"><path d="M710 196.2H572.9l250 631.6H960L710 196.2z m-396 0L64 827.8h139.8l51.1-132.6h261.5l51.1 132.6h139.8l-250-631.6H314z m-13.9 381.7l85.5-222 85.5 222h-171z" p-id="7649" fill={isDarkMode ? "#ffffff" : "#000000"}></path></svg>}
              {currentPlatform?.platformType === PlatformType[PlatformType.azure_openai] && <svg t="1753004779402" className="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="8674" width="32" height="32"><path d="M0 0m256 0l512 0q256 0 256 256l0 512q0 256-256 256l-512 0q-256 0-256-256l0-512q0-256 256-256Z" fill={isDarkMode ? "#ffffff" : "#03A4EE"} p-id="8675"></path><path d="M843.776 494.762667a177.621333 177.621333 0 0 1 11.434667 109.397333c-3.882667 18.261333-10.666667 35.797333-20.053334 51.925333a175.530667 175.530667 0 0 1-117.12 85.034667 176.213333 176.213333 0 0 1-25.258666 49.664 175.445333 175.445333 0 0 1-39.296 39.338667 177.066667 177.066667 0 0 1-104.618667 33.877333c-12.416 0.085333-24.874667-1.28-37.077333-3.754667a178.048 178.048 0 0 1-67.541334-30.208 174.506667 174.506667 0 0 1-27.434666-25.088 177.664 177.664 0 0 1-109.568-11.434666 176.213333 176.213333 0 0 1-46.634667-30.378667 179.626667 179.626667 0 0 1-50.261333-77.354667 175.786667 175.786667 0 0 1 0.213333-109.866666 178.090667 178.090667 0 0 1-21.76-208A176.256 176.256 0 0 1 238.165333 312.746667a173.866667 173.866667 0 0 1 67.797334-29.866667 177.066667 177.066667 0 0 1 169.173333-122.88 174.933333 174.933333 0 0 1 104.661333 33.877333c10.069333 7.424 19.285333 15.786667 27.52 25.130667a178.090667 178.090667 0 0 1 156.032 41.813333c13.866667 12.458667 25.685333 27.050667 34.986667 43.264a176.810667 176.810667 0 0 1 23.04 70.357334 176.042667 176.042667 0 0 1-7.978667 73.642666c12.544 13.866667 22.741333 29.568 30.378667 46.677334z m-244.48 313.173333a131.584 131.584 0 0 0 71.424-71.424c6.570667-16 10.026667-33.194667 10.026667-50.517333v-163.584a7.338667 7.338667 0 0 1-0.128-0.512 1.92 1.92 0 0 0-0.213334-0.426667 1.365333 1.365333 0 0 0-0.384-0.384 1.237333 1.237333 0 0 0-0.426666-0.298667l-59.221334-34.133333v197.589333a23.04 23.04 0 0 1-11.52 19.968l-140.202666 80.896c-1.152 0.768-3.157333 1.792-4.181334 2.346667 5.802667 4.949333 12.117333 9.258667 18.730667 13.098667 6.656 3.797333 13.568 7.04 20.736 9.685333a132.309333 132.309333 0 0 0 95.36-2.261333z m-333.866667-111.061333a131.797333 131.797333 0 0 0 180.181334 48.256l141.738666-81.792 0.384-0.341334a0.896 0.896 0 0 0 0.213334-0.426666 1.792 1.792 0 0 0 0.213333-0.469334v-68.949333l-171.093333 98.986667a25.941333 25.941333 0 0 1-5.504 2.304 23.765333 23.765333 0 0 1-17.493334-2.346667L253.866667 611.114667a146.986667 146.986667 0 0 1-4.138667-2.517334 132.48 132.48 0 0 0 0.085333 45.653334 132.693333 132.693333 0 0 0 15.616 42.752v-0.128z m-36.821333-305.92a132.693333 132.693333 0 0 0-13.141333 100.138666 131.84 131.84 0 0 0 61.44 80.042667l141.653333 81.877333a7.082667 7.082667 0 0 0 0.512 0.128h0.512a0.896 0.896 0 0 0 0.512-0.128 1.92 1.92 0 0 0 0.426667-0.213333l59.434666-34.346667-171.093333-98.730666a23.594667 23.594667 0 0 1-10.709333-13.994667 20.053333 20.053333 0 0 1-0.725334-5.973333V333.141333a133.589333 133.589333 0 0 0-20.778666 9.685334 134.826667 134.826667 0 0 0-47.914667 48.128h-0.128z m486.613333 113.28a23.381333 23.381333 0 0 1 8.533334 8.405333 26.368 26.368 0 0 1 2.261333 5.589333c0.426667 2.005333 0.725333 3.968 0.682667 6.016v166.613334a131.413333 131.413333 0 0 0 59.264-43.818667 132.138667 132.138667 0 0 0 12.117333-141.013333 131.328 131.328 0 0 0-50.986667-53.162667l-141.653333-81.877333a7.466667 7.466667 0 0 0-0.554667-0.128h-0.512a6.656 6.656 0 0 1-0.512 0.128 1.792 1.792 0 0 0-0.426666 0.213333l-59.136 34.218667 171.093333 98.816h-0.170667z m59.050667-88.746667h-0.042667 0.085334z m-0.042667-0.128a131.925333 131.925333 0 0 0-195.84-136.618667l-141.738666 81.834667a1.322667 1.322667 0 0 0-0.341334 0.384l-0.298666 0.426667a6.954667 6.954667 0 0 0-0.213334 1.024v68.394666l171.093334-98.858666a26.368 26.368 0 0 1 5.546666-2.346667 23.552 23.552 0 0 1 17.493334 2.346667l140.16 81.024 4.138666 2.389333zM403.498667 339.669333a23.637333 23.637333 0 0 1 6.784-16.298666 20.906667 20.906667 0 0 1 4.736-3.584l140.202666-80.938667c1.322667-0.768 3.157333-1.834667 4.181334-2.346667-19.2-16.042667-42.666667-26.325333-67.541334-29.44A131.882667 131.882667 0 0 0 343.168 337.92v163.584a6.869333 6.869333 0 0 0 0.128 0.512 1.877333 1.877333 0 0 0 0.213333 0.426667 3.114667 3.114667 0 0 0 0.341334 0.426666 1.706667 1.706667 0 0 0 0.426666 0.341334l59.221334 34.133333V339.712z m32.128 216.192l76.245333 44.032 76.245333-44.032v-87.936l-76.16-44.032-76.245333 44.032-0.085333 87.936z" fill={isDarkMode ? "#000000" : "#FFFFFF"} p-id="8676"></path></svg>}
              {currentPlatform?.platformType === PlatformType[PlatformType['openai-response']] && <svg t="1753004918555" className="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="10690" width="32" height="32"><path d="M877.312 434.688c10.667-29.355 13.355-58.71 10.667-88.021-2.646-29.355-13.312-58.667-26.667-85.334-23.979-40.021-58.667-72.021-98.645-90.666-42.667-18.688-88.022-24.022-133.334-13.355-21.333-21.333-45.354-39.979-72.021-53.333-26.667-13.27-58.667-18.646-87.979-18.646a220.587 220.587 0 0 0-128 40.022c-37.333 26.624-64 64-77.354 106.666-32 7.979-58.667 21.334-85.334 37.334C154.667 288 135.98 312.02 119.98 336c-23.979 40.021-32 85.333-26.667 130.688a232.021 232.021 0 0 0 53.333 122.624a200.32 200.32 0 0 0-10.666 88.021c2.688 29.355 13.354 58.667 26.666 85.334 24.022 40.021 58.667 72.021 98.688 90.666 42.667 18.688 87.979 24.022 133.334 13.355 21.333 21.333 45.312 39.979 71.978 53.333 26.667 13.312 58.667 18.646 88.022 18.646a220.587 220.587 0 0 0 128-40.022c37.333-26.666 64-64 77.312-106.666a193.835 193.835 0 0 0 82.688-37.334C866.645 736 887.979 714.667 901.333 688c23.979-40.021 32-85.333 26.667-130.688-5.333-45.312-21.333-87.979-50.688-122.624z m-320 448c-42.667 0-74.667-13.355-103.979-37.333 0 0 2.646-2.688 5.334-2.688l170.666-98.688A20.821 20.821 0 0 0 640 733.312c2.645-5.333 2.645-7.979 2.645-13.312V480l72.022 42.667V720a157.227 157.227 0 0 1-157.355 162.688zM213.333 736c-18.688-32-26.666-69.333-18.688-106.667 0 0 2.688 2.688 5.334 2.688l170.666 98.646A24.021 24.021 0 0 0 384 733.355c5.333 0 10.667 0 13.312-2.688l208-120.022v82.688L432 794.667a158.293 158.293 0 0 1-120.021 16C269.312 800 234.667 773.333 213.333 736zM167.98 365.312a162.432 162.432 0 0 1 82.688-69.29v202.666c0 5.29 0 10.667 2.645 13.312a20.821 20.821 0 0 0 10.667 10.667l208 120.021L400 685.355l-170.667-98.688a157.739 157.739 0 0 1-74.666-96c-10.667-40.022-8.022-88.022 13.312-125.355z m589.354 136.021l-208-120.021 71.979-42.667 170.667 98.688c26.666 16 48 37.334 61.354 64 13.312 26.667 21.334 56.022 18.646 88.022a158.635 158.635 0 0 1-32 82.645c-18.646 24.021-42.667 42.667-71.979 53.333V522.667c0-5.334 0-10.667-2.688-13.355 0 0-2.645-5.29-7.979-7.979z m71.979-106.666s-2.645-2.688-5.333-2.688l-170.667-98.646c-5.333-2.688-7.979-2.688-13.312-2.688s-10.667 0-13.355 2.688l-208 120.022v-82.688L592 229.333c26.667-16 55.979-21.333 87.979-21.333 29.354 0 58.666 10.667 85.333 29.355 24.021 18.645 45.355 42.666 56.021 69.333s13.312 58.667 7.979 87.979zM381.312 544l-71.979-42.667V301.312c0-29.312 7.979-61.312 23.979-85.333 16-26.624 40.021-45.312 66.688-58.624a143.573 143.573 0 0 1 87.979-13.312c29.354 2.688 58.666 16 82.688 34.688 0 0-2.688 2.645-5.334 2.645l-170.666 98.688A20.821 20.821 0 0 0 384 290.731c-2.688 5.333-2.688 7.978-2.688 13.312v240z m37.333-85.333L512 405.333l93.312 53.334v106.666L512 618.667l-93.355-53.334V458.667z" p-id="10691" fill={isDarkMode ? "#ffffff" : "#1296db"}></path></svg>}  
              {currentPlatform ? currentPlatform.name : "平台详情 / 模型列表"}
            </CardTitle>
            {currentPlatform && (
              <Button
                onClick={handleCreateModel}
                className="h-9 bg-gradient-to-r from-primary to-primary/90 hover:from-primary/80 hover:to-primary/70 shadow-sm"
                disabled={loading}
              >
                <Plus size={16} className="mr-2" />
                创建模型
              </Button>
            )}
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex justify-center items-center h-64">
                <div className="w-8 h-8 border-3 border-primary border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : !currentPlatform ? (
              <div className="text-muted-foreground text-center py-10">
                <p>从左侧选择一个平台查看详情或管理模型。</p>
              </div>
            ) : (
              <div>
                {/* 使用 currentPlatform.modelList 来获取当前平台的模型列表 */}
                {!currentPlatform.modelList || currentPlatform.modelList.length === 0 ? (
                  <div className="text-muted-foreground text-center py-10">
                    <p>当前平台暂无模型，请创建新模型。</p>
                  </div>
                ) : (
                  <div className="flex flex-wrap gap-8">
                    {currentPlatform.modelList.map(model => (
                      <div 
                        key={model.id}
                        className="p-4 border rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer w-[240px] h-[128px] flex flex-col justify-between"
                        onClick={() => handleModelClick(model.id)}
                      >
                        <Bot className="w-6 h-6 text-primary" />
                        <div className="text-xl font-medium text-center overflow-hidden text-ellipsis whitespace-nowrap mb-2">{model.name}</div>
                        <div className="text-sm text-muted-foreground overflow-hidden">
                          <p className="text-center overflow-hidden text-ellipsis line-clamp-2">{model?.description || '暂无描述'}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
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
            color: 'black'
          }
        }}
      >
        <Form
          form={platformForm}
          layout="vertical"
          name="platform_form"
          initialValues={{ type: "openai" }}
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
          form={modelForm}
          layout="vertical"
          name="model_form"
          initialValues={{ modelType: ModelType.TEXT }}
        >
          <Form.Item
            name="platformId"
            hidden
          >
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
        <p>确定要删除这个平台吗？此操作不可恢复。</p>
      </Modal>
  </div>
  );
};

export default PlatformPage;