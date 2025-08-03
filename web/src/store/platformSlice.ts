import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Platform, ResVo, PlatformType } from '../types';
import axios from 'axios';

interface PlatformState {
  platforms: Platform[];
  loading: boolean;
  error: string | null;
  currentPlatform: Platform | null;
}

// 获取平台列表
export const fetchPlatformList = createAsyncThunk(
  'platform/fetchPlatformList',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get<ResVo<Platform[]>>('/api/platform/list');
      
      if (response.data.status.code === 0) {
        return response.data.data;
      } else {
        return rejectWithValue(response.data.status.msg);
      }
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        return rejectWithValue(error.response.data.status?.msg || '获取平台列表失败');
      }
      return rejectWithValue('获取平台列表失败，请重试。');
    }
  }
);

// 创建新平台
export const createPlatform = createAsyncThunk(
  'platform/createPlatform',
  async (platform: Omit<Platform, 'id'>, { rejectWithValue }) => {
    try {
      const response = await axios.post<ResVo<number>>('/api/platform/create', platform);
      
      if (response.data.status.code === 0) {
        // 创建成功后重新获取平台列表
        const listResponse = await axios.get<ResVo<Platform[]>>('/api/platform/list');
        if (listResponse.data.status.code === 0) {
          return listResponse.data.data;
        } else {
          return rejectWithValue(listResponse.data.status.msg);
        }
      } else {
        return rejectWithValue(response.data.status.msg);
      }
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        return rejectWithValue(error.response.data.status?.msg || '创建平台失败');
      }
      return rejectWithValue('创建平台失败，请重试。');
    }
  }
);

// 更新平台
export const updatePlatformApi = createAsyncThunk(
  'platform/updatePlatformApi',
  async (platform: { id?: number, apiKey?: string, baseUrl?: string }, { rejectWithValue }) => {
    try {
      const response = await axios.post<ResVo<string>>('/api/platform/update', platform);
      
      if (response.data.status.code === 0) {
        // 更新成功后获取平台详情
        const detailResponse = await axios.get<ResVo<Platform>>(`/api/platform/detail/${platform.id}`);
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
        return rejectWithValue(error.response.data.status?.msg || '更新平台失败');
      }
      return rejectWithValue('更新平台失败，请重试。');
    }
  }
);

// 删除平台
export const deletePlatformApi = createAsyncThunk(
  'platform/deletePlatformApi',
  async (platformId: number, { rejectWithValue }) => {
    try {
      const response = await axios.get<ResVo<string>>(`/api/platform/delete/${platformId}`);
      
      if (response.data.status.code === 0) {
        return platformId;
      } else {
        return rejectWithValue(response.data.status.msg);
      }
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        return rejectWithValue(error.response.data.status?.msg || '删除平台失败');
      }
      return rejectWithValue('删除平台失败，请重试。');
    }
  }
);

// 获取平台详情
export const fetchPlatformDetail = createAsyncThunk(
  'platform/fetchPlatformDetail',
  async (platformId: number, { rejectWithValue }) => {
    try {
      const response = await axios.get<ResVo<Platform>>(`/api/platform/detail/${platformId}`);
      
      if (response.data.status.code === 0) {
        return response.data.data;
      } else {
        return rejectWithValue(response.data.status.msg);
      }
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        return rejectWithValue(error.response.data.status?.msg || '获取平台详情失败');
      }
      return rejectWithValue('获取平台详情失败，请重试。');
    }
  }
);

const initialState: PlatformState = {
  platforms: [],
  loading: false,
  error: null,
  currentPlatform: null
};

const platformSlice = createSlice({
  name: 'platform',
  initialState,
  reducers: {
    // Set all platforms
    setPlatforms: (state, action: PayloadAction<Platform[]>) => {
      state.platforms = action.payload;
    },
    
    // Clear error state
    clearError: (state) => {
      state.error = null;
    },

    // Set current platform
    setCurrentPlatform: (state, action: PayloadAction<Platform | null>) => {
      state.currentPlatform = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      // 获取平台列表
      .addCase(fetchPlatformList.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPlatformList.fulfilled, (state, action: PayloadAction<Platform[]>) => {
        state.loading = false;
        state.platforms = action.payload;
      })
      .addCase(fetchPlatformList.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // 创建平台
      .addCase(createPlatform.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createPlatform.fulfilled, (state, action: PayloadAction<Platform[]>) => {
        state.loading = false;
        state.platforms = action.payload;
      })
      .addCase(createPlatform.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // 更新平台
      .addCase(updatePlatformApi.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updatePlatformApi.fulfilled, (state, action: PayloadAction<Platform>) => {
        state.loading = false;
        const index = state.platforms.findIndex(platform => platform.id === action.payload.id);
        if (index !== -1) {
          state.platforms[index] = action.payload;
        }
      })
      .addCase(updatePlatformApi.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // 删除平台
      .addCase(deletePlatformApi.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deletePlatformApi.fulfilled, (state, action: PayloadAction<number>) => {
        state.loading = false;
        state.platforms = state.platforms.filter(platform => Number(platform.id) !== action.payload);
        // 如果删除的是当前选中的平台，则清除当前平台
        if (state.currentPlatform && Number(state.currentPlatform.id) === action.payload) {
          state.currentPlatform = null;
        }
      })
      .addCase(deletePlatformApi.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // 获取平台详情
      .addCase(fetchPlatformDetail.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPlatformDetail.fulfilled, (state, action: PayloadAction<Platform>) => {
        state.loading = false;
        state.currentPlatform = action.payload;
        const index = state.platforms.findIndex(platform => String(platform.id) === String(action.payload.id));
        if (index !== -1) {
          state.platforms[index] = action.payload;
        } else {
          state.platforms.push(action.payload);
        }
      })
      .addCase(fetchPlatformDetail.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  }
});

export const {
  setPlatforms,
  clearError,
  setCurrentPlatform
} = platformSlice.actions;

export default platformSlice.reducer;