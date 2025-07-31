import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { UserInfo, ResVo } from '../types';
import axios from 'axios';
import { getCookie, setSessionCookie, removeSessionCookie } from '../utils/api';

// 使用从types导入的ResVo类型

interface UserState {
  userInfo: UserInfo | null;
  isLoggedIn: boolean;
  loading: boolean;
  error: string | null;
}

const initialState: UserState = {
  userInfo: localStorage.getItem('chat-box-userInfo')
    ? JSON.parse(localStorage.getItem('chat-box-userInfo')!)
    : null,
  isLoggedIn:
    localStorage.getItem('chat-box-isLoggedIn') === 'true' &&
    localStorage.getItem('chat-box-session') !== null,
  loading: false,
  error: null,
};

// Async thunks for authentication
export const login = createAsyncThunk(
  'user/login',
  async (
    { username, password }: { username: string; password: string },
    { rejectWithValue }
  ) => {
    try {
      // 创建 FormData 对象
      const formData = new FormData();
      formData.append('username', username);
      formData.append('password', password);

      // 使用fetch而不是axios，以便获取响应头
      const response = await fetch('/api/login', {
        method: 'POST',
        body: formData,
        credentials: 'include', // 重要：包含cookie
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('Login response:', data);

      if (data.status.code === 0) {
        console.log('Login successful, user info:', data.data);

        // 保存登录信息到localStorage
        localStorage.setItem('chat-box-userInfo', JSON.stringify(data.data));
        localStorage.setItem('chat-box-isLoggedIn', 'true');

        // 从响应头中获取Set-Cookie
        const setCookieHeader = response.headers.get('Set-Cookie');
        console.log('Set-Cookie header:', setCookieHeader);

        if (setCookieHeader) {
          // 解析Set-Cookie头，提取box-session的值
          const sessionMatch = setCookieHeader.match(/box-session=([^;]+)/);
          if (sessionMatch) {
            const sessionValue = sessionMatch[1];
            setSessionCookie(sessionValue);
            console.log('Session cookie extracted and saved:', sessionValue);
          } else {
            console.warn('No box-session found in Set-Cookie header');
          }
        } else {
          // 如果响应头中没有Set-Cookie，尝试从document.cookie获取
          const sessionCookie = getCookie('box-session');
          if (sessionCookie) {
            setSessionCookie(sessionCookie);
            console.log(
              'Session cookie found in document.cookie:',
              sessionCookie
            );
          } else {
            console.warn(
              'No session cookie found in response headers or document.cookie'
            );
          }
        }

        return data.data;
      } else {
        console.log('Login failed:', data.status.msg);
        return rejectWithValue(data.status.msg);
      }
    } catch (error) {
      console.error('Login error:', error);
      return rejectWithValue('Login failed. Please try again.');
    }
  }
);

export const register = createAsyncThunk(
  'user/register',
  async (
    { username, password }: { username: string; password: string },
    { rejectWithValue }
  ) => {
    try {
      // 创建注册请求的 FormData
      const formData = new FormData();
      formData.append('username', username);
      formData.append('password', password);

      // 发送注册请求，确保不手动设置 Content-Type
      const response = await axios.post<ResVo<number>>(
        '/api/register',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      if (response.data.status.code === 0) {
        // 注册成功后登录获取用户信息
        const loginFormData = new FormData();
        loginFormData.append('username', username);
        loginFormData.append('password', password);

        // 发送登录请求，确保不手动设置 Content-Type
        const loginResponse = await axios.post<ResVo<UserInfo>>(
          '/api/login',
          loginFormData,
          {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          }
        );

        if (loginResponse.data.status.code === 0) {
          return loginResponse.data.data;
        } else {
          return rejectWithValue(loginResponse.data.status.msg);
        }
      } else {
        return rejectWithValue(response.data.status.msg);
      }
    } catch (error) {
      console.error('Registration error:', error);
      if (axios.isAxiosError(error) && error.response) {
        return rejectWithValue(
          error.response.data.msg || 'Registration failed'
        );
      }
      return rejectWithValue('Registration failed. Please try again.');
    }
  }
);

export const logout = createAsyncThunk(
  'user/logout',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get<ResVo<string>>('/api/logout');

      if (response.data.status.code === 0) {
        // 清除localStorage中的登录信息
        localStorage.removeItem('chat-box-userInfo');
        localStorage.removeItem('chat-box-isLoggedIn');
        // 清除localStorage中的session cookie
        removeSessionCookie();
        console.log('Session cookie removed from localStorage');
        return true;
      } else {
        return rejectWithValue(response.data.status.msg);
      }
    } catch (error) {
      // 即使请求失败，也要清除本地存储
      localStorage.removeItem('chat-box-userInfo');
      localStorage.removeItem('chat-box-isLoggedIn');
      removeSessionCookie();
      console.log('Session cookie removed from localStorage (logout failed)');

      if (axios.isAxiosError(error) && error.response) {
        return rejectWithValue(error.response.data.msg || 'Logout failed');
      }
      return rejectWithValue('Logout failed. Please try again.');
    }
  }
);

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Login
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action: PayloadAction<UserInfo>) => {
        state.loading = false;
        state.userInfo = action.payload;
        state.isLoggedIn = true;
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Register
      .addCase(register.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(register.fulfilled, (state, action: PayloadAction<UserInfo>) => {
        state.loading = false;
        state.userInfo = action.payload;
        state.isLoggedIn = true;
      })
      .addCase(register.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Logout
      .addCase(logout.pending, (state) => {
        state.loading = true;
      })
      .addCase(logout.fulfilled, (state) => {
        state.loading = false;
        state.userInfo = null;
        state.isLoggedIn = false;
      })
      .addCase(logout.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearError } = userSlice.actions;
export default userSlice.reducer;
