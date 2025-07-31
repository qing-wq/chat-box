import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';

import {
  ChatInfo,
  ChatDetail,
  Message,
  ResVo,
  ChatUpdateRequest,
  Conversation,
  ChatListInfo,
} from '../types';

import axios from 'axios';

interface ChatState {
  chatList: ChatListInfo[];
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
  streaming: false,
};

// Async thunks for chat operations
export const fetchChatList = createAsyncThunk(
  'chat/fetchChatList',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get<ResVo<ChatListInfo[]>>(
        '/api/conversation/list'
      );

      if (response.data.status.code === 0) {
        return response.data.data;
      } else {
        return rejectWithValue(response.data.status.msg);
      }
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        return rejectWithValue(
          error.response.data.status?.msg || 'Failed to fetch chat list'
        );
      }
      return rejectWithValue('Failed to fetch chat list. Please try again.');
    }
  }
);

export const fetchChatDetail = createAsyncThunk(
  'chat/fetchChatDetail',
  async (uuid: string, { rejectWithValue }) => {
    try {
      const response = await axios.get<ResVo<ChatDetail>>(
        `/api/conversation/detail/${uuid}`
      );

      if (response.data.status.code === 0) {
        return response.data.data;
      } else {
        return rejectWithValue(response.data.status.msg);
      }
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        return rejectWithValue(
          error.response.data.status?.msg || 'Failed to fetch chat details'
        );
      }
      return rejectWithValue('Failed to fetch chat details. Please try again.');
    }
  }
);

export const createNewChat = createAsyncThunk(
  'chat/createNewChat',
  async (_, { rejectWithValue }) => {
    try {
      const uuid = crypto.randomUUID();
      // 默认参数
      const DEFAULT_TEMPERATURE = 1;
      const DEFAULT_MAX_TOKENS = 2048;
      const DEFAULT_CONTEXT_WINDOW = 8;

      const response = await axios.post<ResVo<Conversation>>(
        `/api/conversation/${uuid}`,
        {
          uuid,
          temperature: DEFAULT_TEMPERATURE,
          maxTokens: DEFAULT_MAX_TOKENS,
          contextWindow: DEFAULT_CONTEXT_WINDOW,
        }
      );

      if (response.data.status.code === 0) {
        return response.data.data;
      } else {
        return rejectWithValue(response.data.status.msg);
      }
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        return rejectWithValue(
          error.response.data.status?.msg || 'Failed to create new chat'
        );
      }
      return rejectWithValue('Failed to create new chat. Please try again.');
    }
  }
);

export const updateChatInfo = createAsyncThunk(
  'chat/updateChatInfo',
  async (chatUpdateRequest: ChatUpdateRequest, { rejectWithValue }) => {
    try {
      const response = await axios.post<ResVo<string>>(
        `/api/conversation/update`,
        {
          conversationUUid: chatUpdateRequest.uuid,
          title: chatUpdateRequest.title,
        }
      );

      if (response.data.status.code === 0) {
        return chatUpdateRequest;
      } else {
        return rejectWithValue(response.data.status.msg);
      }
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        return rejectWithValue(
          error.response.data.status?.msg || 'Failed to update chat'
        );
      }
      return rejectWithValue('Failed to update chat. Please try again.');
    }
  }
);

export const deleteChat = createAsyncThunk(
  'chat/deleteChat',
  async (uuid: string, { rejectWithValue }) => {
    try {
      const response = await axios.get<ResVo<string>>(
        `/api/conversation/del/${uuid}`
      );

      if (response.data.status.code === 0) {
        return uuid;
      } else {
        return rejectWithValue(response.data.status.msg);
      }
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        return rejectWithValue(
          error.response.data.status?.msg || 'Failed to delete chat'
        );
      }
      return rejectWithValue('Failed to delete chat. Please try again.');
    }
  }
);
// TODO 待修改
export const updateChatMessages = createAsyncThunk(
  'chat/updateChatMessages',

  async (
    {
      uuid,
      title,
      description,
      systemMessage,
      temperature,
      contextWindow,
      maxTokens,
    }: {
      uuid: string;
      title?: string;
      description?: string;
      systemMessage?: string;
      temperature?: number;
      contextWindow?: number;
      maxTokens?: number;
    },
    { rejectWithValue, dispatch }
  ) => {
    try {
      const response = await axios.post<ResVo<string>>(
        '/api/conversation/update',
        {
          uuid,
          title,
          ...(description ? { description } : {}),
          ...(systemMessage ? { systemMessage } : {}),
          ...(temperature !== undefined ? { temperature } : {}),
          ...(contextWindow !== undefined ? { contextWindow } : {}),
          ...(maxTokens !== undefined ? { maxTokens } : {}),
        }
      );

      if (response.data.status.code === 0) {
        // 更新后重新获取聊天详情并返回
        const detailResponse = await dispatch(fetchChatDetail(uuid));
        if (fetchChatDetail.fulfilled.match(detailResponse)) {
          return detailResponse.payload;
        } else {
          return rejectWithValue(
            detailResponse.payload || 'Failed to fetch updated chat detail'
          );
        }
      } else {
        return rejectWithValue(response.data.status.msg);
      }
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        return rejectWithValue(
          error.response.data.status?.msg || 'Failed to update chat messages'
        );
      }
      return rejectWithValue(
        'Failed to update chat messages. Please try again.'
      );
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
        const lastMessage =
          state.currentChat.messageList[
            state.currentChat.messageList.length - 1
          ];
        lastMessage.content = action.payload.content;
      }
    },
    clearMessages: (state) => {
      if (state.currentChat) {
        state.currentChat.messageList = [];
      }
    },
    setCurrentModel: (
      state,
      action: PayloadAction<{ id: number; name: string } | null>
    ) => {
      if (state.currentChat && action.payload) {
        if (!state.currentChat.currentModel) {
          state.currentChat.currentModel = action.payload;
        } else {
          state.currentChat.currentModel.id = action.payload.id;
          state.currentChat.currentModel.name = action.payload.name;
        }
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch chat list
      .addCase(fetchChatList.pending, (state) => {
        // state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchChatList.fulfilled,
        (state, action: PayloadAction<ChatInfo[]>) => {
          // state.loading = false;
          state.chatList = action.payload;
        }
      )
      .addCase(fetchChatList.rejected, (state, action) => {
        // state.loading = false;
        state.error = action.payload as string;
      })

      // Fetch chat detail
      .addCase(fetchChatDetail.pending, (state) => {
        // state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchChatDetail.fulfilled,
        (state, action: PayloadAction<ChatDetail>) => {
          // state.loading = false;
          const chat = state.chatList.find(
            (chat) => chat.uuid === action.payload.conversation.uuid
          );
          if (chat) {
            chat.updateTime = action.payload.conversation.updateTime;
            chat.createTime = action.payload.conversation.createTime;
            chat.title = action.payload.conversation.title;
          }
          state.currentChat = action.payload;
          // currentModel 现在直接包含在 currentChat 中
        }
      )
      .addCase(fetchChatDetail.rejected, (state, action) => {
        // state.loading = false;
        state.error = action.payload as string;
      })

      // Create new chat
      .addCase(createNewChat.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(
        createNewChat.fulfilled,
        (state, action: PayloadAction<ChatInfo>) => {
          state.loading = false;
          state.chatList.unshift({
            uuid: action.payload.uuid,
            title: action.payload.title,
            description: action.payload.description,
            systemMessage: action.payload.systemMessage,
          });
          state.currentChat = {
            conversation: action.payload,
            messageList: [],
          };
        }
      )

      .addCase(createNewChat.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Update chat info
      .addCase(updateChatInfo.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        updateChatInfo.fulfilled,
        (state, action: PayloadAction<ChatUpdateRequest>) => {
          state.loading = false;
          const { uuid, title } = action.payload;

          // Update in chat list
          const chatIndex = state.chatList.findIndex(
            (chat) => chat.uuid === uuid
          );
          if (chatIndex !== -1 && title) {
            state.chatList[chatIndex].title = title;
          }

          // Update current chat if it's the same
          if (state.currentChat && state.currentChat.uuid === uuid && title) {
            state.currentChat.title = title;
          }
        }
      )
      .addCase(updateChatInfo.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Delete chat
      .addCase(deleteChat.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteChat.fulfilled, (state, action: PayloadAction<string>) => {
        state.loading = false;
        state.chatList = state.chatList.filter(
          (chat) => chat.uuid !== action.payload
        );

        // Clear current chat if it's the deleted one
        if (
          state.currentChat &&
          state.currentChat.conversation.uuid === action.payload
        ) {
          state.currentChat = null;
        }
      })
      .addCase(deleteChat.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Update chat messages
      .addCase(updateChatMessages.pending, (state) => {
        // state.loading = true;
        state.error = null;
      })

      .addCase(
        updateChatMessages.fulfilled,
        (state, action: PayloadAction<ChatDetail>) => {
          // state.loading = false;
          const { uuid, title, description } = action.payload.conversation;

          // Update in chat list
          const chatIndex = state.chatList.findIndex(
            (chat) => chat.uuid === uuid
          );
          if (chatIndex !== -1) {
            if (title) state.chatList[chatIndex].title = title;
            if (description)
              state.chatList[chatIndex].description = description;
          }

          // Update current chat if it's the same
          if (
            state.currentChat &&
            state.currentChat.conversation.uuid === uuid
          ) {
            state.currentChat = action.payload;
          }
        }
      )

      .addCase(updateChatMessages.rejected, (state, action) => {
        // state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const {
  clearError,
  setStreaming,
  addMessage,
  updateLastMessage,
  clearMessages,
  setCurrentModel,
} = chatSlice.actions;
export default chatSlice.reducer;
