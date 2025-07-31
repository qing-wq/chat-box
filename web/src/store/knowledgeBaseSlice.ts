import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { KnowledgeBase, KbDetailVO, SimpleKbDto, KbItemDto, ResVo } from '../types';
import axios from 'axios';

interface KnowledgeBaseState {
  knowledgeBases: SimpleKbDto[];
  currentKnowledgeBase: KbDetailVO | null;
  knowledgeBaseItems: KbItemDto[];
  loading: boolean;
  error: string | null;
}

// 创建知识库
export const createKnowledgeBase = createAsyncThunk(
  'knowledgeBase/createKnowledgeBase',
  async (knowledgeBase: Partial<KnowledgeBase>, { rejectWithValue }) => {
    try {
      const response = await axios.post<ResVo<KnowledgeBase>>('/api/kb/create', knowledgeBase);
      
      if (response.data.status.code === 0) {
        return response.data.data;
      } else {
        return rejectWithValue(response.data.status.msg);
      }
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        return rejectWithValue(error.response.data.status?.msg || '创建知识库失败');
      }
      return rejectWithValue('创建知识库失败，请重试。');
    }
  }
);

// 更新知识库
export const updateKnowledgeBase = createAsyncThunk(
  'knowledgeBase/updateKnowledgeBase',
  async (knowledgeBase: Partial<KnowledgeBase>, { rejectWithValue }) => {
    try {
      const response = await axios.post<ResVo<KnowledgeBase>>('/api/kb/update', knowledgeBase);
      
      if (response.data.status.code === 0) {
        return response.data.data;
      } else {
        return rejectWithValue(response.data.status.msg);
      }
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        return rejectWithValue(error.response.data.status?.msg || '更新知识库失败');
      }
      return rejectWithValue('更新知识库失败，请重试。');
    }
  }
);

// 获取知识库列表
export const fetchKnowledgeBaseList = createAsyncThunk(
  'knowledgeBase/fetchKnowledgeBaseList',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get<ResVo<SimpleKbDto[]>>('/api/kb/list');
      
      if (response.data.status.code === 0) {
        return response.data.data;
      } else {
        return rejectWithValue(response.data.status.msg);
      }
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        return rejectWithValue(error.response.data.status?.msg || '获取知识库列表失败');
      }
      return rejectWithValue('获取知识库列表失败，请重试。');
    }
  }
);

// 获取知识库详情
export const fetchKnowledgeBaseDetail = createAsyncThunk(
  'knowledgeBase/fetchKnowledgeBaseDetail',
  async (id: string | number, { rejectWithValue }) => {
    try {
      const response = await axios.get<ResVo<KbDetailVO>>(`/api/kb/detail/${id}`);
      
      if (response.data.status.code === 0) {
        return response.data.data;
      } else {
        return rejectWithValue(response.data.status.msg);
      }
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        return rejectWithValue(error.response.data.status?.msg || '获取知识库详情失败');
      }
      return rejectWithValue('获取知识库详情失败，请重试。');
    }
  }
);

// 获取指定知识库下的所有条目
export const fetchKnowledgeBaseItems = createAsyncThunk(
  'knowledgeBase/fetchKnowledgeBaseItems',
  async (kbId: string | number, { rejectWithValue }) => {
    try {
      const response = await axios.get<ResVo<KbItemDto[]>>(`/api/kb-item/list/${kbId}`);
      
      if (response.data.status.code === 0) {
        return response.data.data;
      } else {
        return rejectWithValue(response.data.status.msg);
      }
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        return rejectWithValue(error.response.data.status?.msg || '获取知识库条目列表失败');
      }
      return rejectWithValue('获取知识库条目列表失败，请重试。');
    }
  }
);

// 上传文档到指定知识库
export const uploadDocsToKnowledgeBase = createAsyncThunk(
  'knowledgeBase/uploadDocsToKnowledgeBase',
  async ({ kbId, files }: { kbId: string | number, files: File[] }, { rejectWithValue }) => {
    try {
      const formData = new FormData();
      files.forEach(file => {
        formData.append('files', file);
      });

      const response = await axios.post<ResVo<string>>(
        `/api/kb-item/uploadDocs?kbId=${kbId}`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }
      );
      
      if (response.data.status.code === 0) {
        return response.data.data;
      } else {
        return rejectWithValue(response.data.status.msg);
      }
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        return rejectWithValue(error.response.data.status?.msg || '上传文档失败');
      }
      return rejectWithValue('上传文档失败，请重试。');
    }
  }
);

// 删除知识库
export const deleteKnowledgeBase = createAsyncThunk(
  'knowledgeBase/deleteKnowledgeBase',
  async (id: number, { rejectWithValue }) => {
    try {
      const response = await axios.get<ResVo<string>>(`/api/kb/del/${id}`);
      
      if (response.data.status.code === 0) {
        return { id, data: response.data.data };
      } else {
        return rejectWithValue(response.data.status.msg);
      }
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        return rejectWithValue(error.response.data.status?.msg || '删除知识库失败');
      }
      return rejectWithValue('删除知识库失败，请重试。');
    }
  }
);

// 删除知识库中的指定条目
export const deleteKnowledgeBaseItem = createAsyncThunk(
  'knowledgeBase/deleteKnowledgeBaseItem',
  async (itemId: string, { rejectWithValue }) => {
    try {
      const response = await axios.get<ResVo<string>>(`/api/kb-item/del/${itemId}`);
      
      if (response.data.status.code === 0) {
        return { itemId, data: response.data.data };
      } else {
        return rejectWithValue(response.data.status.msg);
      }
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        return rejectWithValue(error.response.data.status?.msg || '删除知识库条目失败');
      }
      return rejectWithValue('删除知识库条目失败，请重试。');
    }
  }
);

const initialState: KnowledgeBaseState = {
  knowledgeBases: [],
  currentKnowledgeBase: null,
  knowledgeBaseItems: [],
  loading: false,
  error: null
};

const knowledgeBaseSlice = createSlice({
  name: 'knowledgeBase',
  initialState,
  reducers: {
    // 清除错误
    clearError: (state) => {
      state.error = null;
    },
    // 设置当前知识库
    setCurrentKnowledgeBase: (state, action: PayloadAction<KbDetailVO | null>) => {
      state.currentKnowledgeBase = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      // 创建知识库
      .addCase(createKnowledgeBase.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createKnowledgeBase.fulfilled, (state, action: PayloadAction<KnowledgeBase>) => {
        state.loading = false;
        // 将新创建的知识库添加到列表中
        const newKb: SimpleKbDto = {
          id: action.payload.id,
          title: action.payload.title,
          remark: action.payload.remark,
          isPublic: action.payload.isPublic,
          createTime: action.payload.createTime,
          updateTime: action.payload.updateTime
        };
        state.knowledgeBases.push(newKb);
      })
      .addCase(createKnowledgeBase.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // 更新知识库
      .addCase(updateKnowledgeBase.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateKnowledgeBase.fulfilled, (state, action: PayloadAction<KnowledgeBase>) => {
        state.loading = false;
        // 更新列表中的知识库
        const index = state.knowledgeBases.findIndex(kb => kb.id === action.payload.id);
        if (index !== -1) {
          state.knowledgeBases[index] = {
            id: action.payload.id,
            title: action.payload.title,
            remark: action.payload.remark,
            isPublic: action.payload.isPublic,
            createTime: action.payload.createTime,
            updateTime: action.payload.updateTime
          };
        }
        // 如果当前正在查看的是这个知识库，也更新当前知识库
        if (state.currentKnowledgeBase && state.currentKnowledgeBase.knowledgeBase.id === action.payload.id) {
          state.currentKnowledgeBase.knowledgeBase = action.payload;
        }
      })
      .addCase(updateKnowledgeBase.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // 获取知识库列表
      .addCase(fetchKnowledgeBaseList.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchKnowledgeBaseList.fulfilled, (state, action: PayloadAction<SimpleKbDto[]>) => {
        state.loading = false;
        state.knowledgeBases = action.payload;
      })
      .addCase(fetchKnowledgeBaseList.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // 获取知识库详情
      .addCase(fetchKnowledgeBaseDetail.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchKnowledgeBaseDetail.fulfilled, (state, action: PayloadAction<KbDetailVO>) => {
        state.loading = false;
        state.currentKnowledgeBase = action.payload;
      })
      .addCase(fetchKnowledgeBaseDetail.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // 获取知识库条目列表
      .addCase(fetchKnowledgeBaseItems.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchKnowledgeBaseItems.fulfilled, (state, action: PayloadAction<KbItemDto[]>) => {
        state.loading = false;
        state.knowledgeBaseItems = action.payload;
      })
      .addCase(fetchKnowledgeBaseItems.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // 上传文档到知识库
      .addCase(uploadDocsToKnowledgeBase.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(uploadDocsToKnowledgeBase.fulfilled, (state) => {
        state.loading = false;
        // 上传成功后，可能需要刷新知识库条目列表，但这里不直接更新，而是由组件调用fetchKnowledgeBaseItems
      })
      .addCase(uploadDocsToKnowledgeBase.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // 删除知识库
      .addCase(deleteKnowledgeBase.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteKnowledgeBase.fulfilled, (state, action: PayloadAction<{id: number, data: string}>) => {
        state.loading = false;
        // 从列表中移除被删除的知识库
        state.knowledgeBases = state.knowledgeBases.filter(kb => kb.id !== action.payload.id);
        // 如果当前正在查看的是被删除的知识库，清空当前知识库
        if (state.currentKnowledgeBase && state.currentKnowledgeBase.knowledgeBase.id === action.payload.id) {
          state.currentKnowledgeBase = null;
        }
      })
      .addCase(deleteKnowledgeBase.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // 删除知识库条目
      .addCase(deleteKnowledgeBaseItem.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteKnowledgeBaseItem.fulfilled, (state, action: PayloadAction<{itemId: string, data: string}>) => {
        state.loading = false;
        // 从列表中移除被删除的条目
        state.knowledgeBaseItems = state.knowledgeBaseItems.filter(item => item.id !== Number(action.payload.itemId));
        // 如果当前知识库中有这个条目，也从当前知识库的条目列表中移除
        if (state.currentKnowledgeBase && state.currentKnowledgeBase.itemLists) {
          state.currentKnowledgeBase.itemLists = state.currentKnowledgeBase.itemLists.filter(
            item => item.id !== Number(action.payload.itemId)
          );
        }
      })
      .addCase(deleteKnowledgeBaseItem.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  }
});

export const {
  clearError,
  setCurrentKnowledgeBase
} = knowledgeBaseSlice.actions;

export default knowledgeBaseSlice.reducer;