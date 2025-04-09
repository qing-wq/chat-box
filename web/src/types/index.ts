// API Response type
export interface Status {
  code: number;
  msg: string;
}

export interface ResVo<T> {
  status: Status;
  data: T;
}

// User types
export interface UserInfo {
  id: number;
  createTime: string;
  updateTime: string;
  userId: number;
  userName: string;
}

// Chat types
export interface ChatInfo {
  id: number;
  createTime: string;
  updateTime: string;
  title: string;
}

export interface ChatDetail extends ChatInfo {
  messageList: Message[];
}

// Message types
export interface Message {
  id?: number;
  chatId?: number;
  createTime?: string;
  updateTime?: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
}

// Chat update request
export interface ChatUpdateRequest {
  id: number;
  title?: string;
}

// Model configuration
export interface ModelParams {
  temperature?: number;
  topP?: number;
  maxTokens?: number;
  stop?: string[];
}

export interface ModelConfig {
  apiUrl: string;
  apiKey: string;
  modelName: string;
  modelParams?: ModelParams;
}

// Chat request
export interface ChatRequest {
  chatId: number;
  messageList: Message[];
  modelConfig: ModelConfig;
  toolList?: string[];
}

// Memory chat request
export interface MemoryChatRequest {
  chatId: number;
  sessionId: string;
  message: string;
  modelConfig: ModelConfig;
  toolList?: string[];
}

// Theme type
export type ThemeMode = 'light' | 'dark';
