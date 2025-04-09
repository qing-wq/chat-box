import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { ChatInfo, ChatDetail, Message, ResVo, ChatUpdateRequest } from '../types';
import axios from 'axios';

interface ChatState {
  chatList: ChatInfo[];
  currentChat: ChatDetail | null;
  loading: boolean;
  error: string | null;
  streaming: boolean;
}

const initialState: ChatState = {
  chatList: [],
  currentChat: null,
  loading: false,
  error: null,
  streaming: false
};

// Async thunks for chat operations
export const fetchChatList = createAsyncThunk(
  'chat/fetchChatList',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get<ResVo<ChatInfo[]>>('/api/chat/list');
      
      if (response.data.status.code === 0) {
        return response.data.data;
      } else {
        return rejectWithValue(response.data.status.msg);
      }
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        return rejectWithValue(error.response.data.status?.msg || 'Failed to fetch chat list');
      }
      return rejectWithValue('Failed to fetch chat list. Please try again.');
    }
  }
);

export const fetchChatDetail = createAsyncThunk(
  'chat/fetchChatDetail',
  async (chatId: number, { rejectWithValue }) => {
    try {
      const response = await axios.get<ResVo<ChatDetail>>(`/api/chat/detail/${chatId}`);
      
      if (response.data.status.code === 0) {
        return response.data.data;
      } else {
        return rejectWithValue(response.data.status.msg);
      }
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        return rejectWithValue(error.response.data.status?.msg || 'Failed to fetch chat details');
      }
      return rejectWithValue('Failed to fetch chat details. Please try again.');
    }
  }
);

export const createNewChat = createAsyncThunk(
  'chat/createNewChat',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.post<ResVo<ChatInfo>>('/api/chat/new');
      
      if (response.data.status.code === 0) {
        return response.data.data;
      } else {
        return rejectWithValue(response.data.status.msg);
      }
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        return rejectWithValue(error.response.data.status?.msg || 'Failed to create new chat');
      }
      return rejectWithValue('Failed to create new chat. Please try again.');
    }
  }
);

export const updateChatInfo = createAsyncThunk(
  'chat/updateChatInfo',
  async (chatUpdateRequest: ChatUpdateRequest, { rejectWithValue }) => {
    try {
      const response = await axios.post<ResVo<string>>('/api/chat/update/info', chatUpdateRequest);
      
      if (response.data.status.code === 0) {
        return chatUpdateRequest;
      } else {
        return rejectWithValue(response.data.status.msg);
      }
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        return rejectWithValue(error.response.data.status?.msg || 'Failed to update chat');
      }
      return rejectWithValue('Failed to update chat. Please try again.');
    }
  }
);

export const deleteChat = createAsyncThunk(
  'chat/deleteChat',
  async (chatId: number, { rejectWithValue }) => {
    try {
      const response = await axios.get<ResVo<string>>(`/api/chat/delete/${chatId}`);
      
      if (response.data.status.code === 0) {
        return chatId;
      } else {
        return rejectWithValue(response.data.status.msg);
      }
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        return rejectWithValue(error.response.data.status?.msg || 'Failed to delete chat');
      }
      return rejectWithValue('Failed to delete chat. Please try again.');
    }
  }
);

export const updateChatMessages = createAsyncThunk(
  'chat/updateChatMessages',
  async ({ chatId, newMessageList }: { chatId: number, newMessageList: Message[] }, { rejectWithValue, dispatch }) => {
    try {
      const response = await axios.post<ResVo<string>>('/api/chat/update', {
        chatId,
        newMessageList
      });
      
      if (response.data.status.code === 0) {
        // 更新后重新获取聊天详情
        dispatch(fetchChatDetail(chatId));
        return { chatId, newMessageList };
      } else {
        return rejectWithValue(response.data.status.msg);
      }
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        return rejectWithValue(error.response.data.status?.msg || 'Failed to update chat messages');
      }
      return rejectWithValue('Failed to update chat messages. Please try again.');
    }
  }
);

const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setStreaming: (state, action: PayloadAction<boolean>) => {
      state.streaming = action.payload;
    },
    addMessage: (state, action: PayloadAction<Message>) => {
      if (state.currentChat) {
        state.currentChat.messageList.push(action.payload);
      }
    },
    updateLastMessage: (state, action: PayloadAction<{ content: string }>) => {
      if (state.currentChat && state.currentChat.messageList.length > 0) {
        const lastMessage = state.currentChat.messageList[state.currentChat.messageList.length - 1];
        lastMessage.content = action.payload.content;
      }
    },
    clearMessages: (state) => {
      if (state.currentChat) {
        state.currentChat.messageList = [];
      }
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch chat list
      .addCase(fetchChatList.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchChatList.fulfilled, (state, action: PayloadAction<ChatInfo[]>) => {
        state.loading = false;
        state.chatList = action.payload;
      })
      .addCase(fetchChatList.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // Fetch chat detail
      .addCase(fetchChatDetail.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchChatDetail.fulfilled, (state, action: PayloadAction<ChatDetail>) => {
        state.loading = false;
        state.currentChat = action.payload;
      })
      .addCase(fetchChatDetail.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // Create new chat
      .addCase(createNewChat.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createNewChat.fulfilled, (state, action: PayloadAction<ChatInfo>) => {
        state.loading = false;
        state.chatList.unshift(action.payload);
        state.currentChat = {
          ...action.payload,
          messageList: []
        };
      })
      .addCase(createNewChat.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // Update chat info
      .addCase(updateChatInfo.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateChatInfo.fulfilled, (state, action: PayloadAction<ChatUpdateRequest>) => {
        state.loading = false;
        const { id, title } = action.payload;
        
        // Update in chat list
        const chatIndex = state.chatList.findIndex(chat => chat.id === id);
        if (chatIndex !== -1 && title) {
          state.chatList[chatIndex].title = title;
        }
        
        // Update current chat if it's the same
        if (state.currentChat && state.currentChat.id === id && title) {
          state.currentChat.title = title;
        }
      })
      .addCase(updateChatInfo.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // Delete chat
      .addCase(deleteChat.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteChat.fulfilled, (state, action: PayloadAction<number>) => {
        state.loading = false;
        state.chatList = state.chatList.filter(chat => chat.id !== action.payload);
        
        // Clear current chat if it's the deleted one
        if (state.currentChat && state.currentChat.id === action.payload) {
          state.currentChat = null;
        }
      })
      .addCase(deleteChat.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // Update chat messages
      .addCase(updateChatMessages.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateChatMessages.fulfilled, (state, action: PayloadAction<{ chatId: number, newMessageList: Message[] }>) => {
        state.loading = false;
        
        // Update current chat if it's the same
        if (state.currentChat && state.currentChat.id === action.payload.chatId) {
          state.currentChat.messageList = action.payload.newMessageList;
        }
      })
      .addCase(updateChatMessages.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  }
});

export const { clearError, setStreaming, addMessage, updateLastMessage, clearMessages } = chatSlice.actions;
export default chatSlice.reducer;
