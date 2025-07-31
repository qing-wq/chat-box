import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Model, ResVo } from '../types';
import axios from 'axios';

// 定义模型类型枚举
export enum ModelType {
  TEXT = 'text',
  IMAGE = 'image',
  EMBEDDING = 'embedding',
  RERANK = 'rerank'
}

// 定义当前使用的模型接口
export interface CurrentModel {
  id: number;
  name: string;
}

// 定义模型列表接口
export interface ModelListResponse {
  [key: string]: CurrentModel[];
}

// 定义模型创建请求接口
export interface CreateModelRequest {
  modelId?: string;
  name?: string;
  platformId?: number;
  modelType?: ModelType;
}

// 定义模型更新请求接口
export interface UpdateModelRequest {
  id: number;
  createTime?: string;
  updateTime?: string;
  name?: string;
  type?: string;
  platformId?: number;
  description?: string;
}

// 定义模型状态接口
interface ModelState {
  models: Model[];
  currentModel: CurrentModel | null;
  modelList: ModelListResponse | null;
  loading: boolean;
  error: string | null;
}

// 初始状态
const initialState: ModelState = {
  models: [],
  currentModel: null,
  modelList: null,
  loading: false,
  error: null
};

// 创建模型
export const createModel = createAsyncThunk(
  'model/createModel',
  async (modelData: CreateModelRequest, { rejectWithValue }) => {
    try {
      const response = await axios.post<ResVo<Model>>('/api/model/create', modelData);
      
      if (response.data.status.code === 0) {
        return response.data.data;
      } else {
        return rejectWithValue(response.data.status.msg);
      }
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        return rejectWithValue(error.response.data.status?.msg || '创建模型失败');
      }
      return rejectWithValue('创建模型失败，请重试。');
    }
  }
);



// 获取模型选择列表
export const fetchModelList = createAsyncThunk(
  'model/fetchModelList',
  async (type?: ModelType, { rejectWithValue }) => {
    try {
      // 构建请求URL，如果提供了type参数，则添加到路径中
      const url = type ? `/api/model/list/${type}` : '/api/model/list';
      const response = await axios.get<ResVo<ModelListResponse>>(url);
      
      if (response.data.status.code === 0) {
        return {
          type, // 添加类型信息，用于在reducer中区分不同类型的模型
          data: response.data.data
        };
      } else {
        return rejectWithValue(response.data.status.msg);
      }
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        return rejectWithValue(error.response.data.status?.msg || '获取模型选择列表失败');
      }
      return rejectWithValue('获取模型选择列表失败，请重试。');
    }
  }
);

// 根据模型ID获取模型详情
export const fetchModelDetail = createAsyncThunk(
  'model/fetchModelDetail',
  async (modelId: number, { rejectWithValue }) => {
    try {
      const response = await axios.get<ResVo<Model>>(`/api/model/detail/${modelId}`);
      
      if (response.data.status.code === 0) {
        return response.data.data;
      } else {
        return rejectWithValue(response.data.status.msg);
      }
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        return rejectWithValue(error.response.data.status?.msg || '获取模型详情失败');
      }
      return rejectWithValue('获取模型详情失败，请重试。');
    }
  }
);

// 更新模型信息
export const updateModel = createAsyncThunk(
  'model/updateModel',
  async (modelData: UpdateModelRequest, { rejectWithValue }) => {
    try {
      const response = await axios.post<ResVo<string>>('/api/model/update', modelData);
      
      if (response.data.status.code === 0) {
        // 更新成功后获取模型详情
        const detailResponse = await axios.get<ResVo<Model>>(`/api/model/detail/${modelData.id}`);
        if (detailResponse.data.status.code === 0) {
          return detailResponse.data.data;
        } else {
          return rejectWithValue(detailResponse.data.status.msg);
        }
      } else {
        return rejectWithValue(response.data.status.msg);
      }
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        return rejectWithValue(error.response.data.status?.msg || '更新模型失败');
      }
      return rejectWithValue('更新模型失败，请重试。');
    }
  }
);

// 删除模型
export const deleteModel = createAsyncThunk(
  'model/deleteModel',
  async (modelId: number, { rejectWithValue }) => {
    try {
      const response = await axios.get<ResVo<string>>(`/api/model/delete/${modelId}`);
      
      if (response.data.status.code === 0) {
        return modelId;
      } else {
        return rejectWithValue(response.data.status.msg);
      }
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        return rejectWithValue(error.response.data.status?.msg || '删除模型失败');
      }
      return rejectWithValue('删除模型失败，请重试。');
    }
  }
);

const modelSlice = createSlice({
  name: 'model',
  initialState,
  reducers: {
    // 清除错误状态
    clearError: (state) => {
      state.error = null;
    },
    
    // 设置当前模型
    setCurrentModel: (state, action: PayloadAction<CurrentModel | null>) => {
      state.currentModel = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      // 创建模型
      .addCase(createModel.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createModel.fulfilled, (state, action: PayloadAction<Model>) => {
        state.loading = false;
        state.models.push(action.payload);
      })
      .addCase(createModel.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
        
      // 获取模型选择列表
      .addCase(fetchModelList.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchModelList.fulfilled, (state, action) => {
        state.loading = false;
        
        const { type, data } = action.payload;
        
        // 初始化modelList为对象（如果为null）
        if (!state.modelList) {
          state.modelList = {};
        }
        
        // 根据模型类型组织模型信息
        if (type) {
          // 如果指定了类型，则更新该类型的模型列表
          // 检查data是否直接是数组，或者是否有type键
          if (Array.isArray(data)) {
            // 如果data直接是数组，则使用该数组作为指定类型的模型列表
            state.modelList = {
              ...state.modelList,
              [type]: data
            };
          } else if (data[type]) {
            // 如果data有type键，则使用data[type]作为指定类型的模型列表
            state.modelList = {
              ...state.modelList,
              [type]: data[type]
            };
          } else {
            // 如果data既不是数组也没有type键，则保持原样
            console.warn(`获取${type}类型的模型列表失败：API返回的数据格式不正确`, data);
          }
        } else {
          // 如果没有指定类型，则更新所有类型的模型列表
          state.modelList = {
            ...state.modelList,
            ...data
          };
        }
      })
      .addCase(fetchModelList.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // 获取模型详情
      .addCase(fetchModelDetail.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchModelDetail.fulfilled, (state, action: PayloadAction<Model>) => {
        state.loading = false;
        
        // 更新模型列表中的模型
        const index = state.models.findIndex(model => model.id === action.payload.id);
        if (index !== -1) {
          state.models[index] = action.payload;
        } else {
          state.models.push(action.payload);
        }
      })
      .addCase(fetchModelDetail.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // 更新模型
      .addCase(updateModel.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateModel.fulfilled, (state, action: PayloadAction<Model>) => {
        state.loading = false;
        
        // 更新模型列表中的模型
        const index = state.models.findIndex(model => model.id === action.payload.id);
        if (index !== -1) {
          state.models[index] = action.payload;
        }
      })
      .addCase(updateModel.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // 删除模型
      .addCase(deleteModel.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteModel.fulfilled, (state, action: PayloadAction<number>) => {
        state.loading = false;
        
        // 从模型列表中移除
        state.models = state.models.filter(model => model.id !== action.payload);
        
        // 如果删除的是当前模型，清除当前模型
        if (state.currentModel && state.currentModel.id === action.payload) {
          state.currentModel = null;
        }
      })
      .addCase(deleteModel.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  }
});

export const {
  clearError,
  setCurrentModel
} = modelSlice.actions;

export default modelSlice.reducer;