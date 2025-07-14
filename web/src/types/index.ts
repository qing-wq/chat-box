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
  uuid: string;
  createTime: string;
  updateTime: string;
  title: string;
}

export interface ChatDetail extends ChatInfo {
  conversation: any;
  messageList: Message[];
}

// Message types
export interface Message {
  id?: number;
  conversationUuId?: string;
  createTime?: string;
  updateTime?: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
}

// Chat update request
export interface ChatUpdateRequest {
  uuid: string;
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
  conversationUuId: string;
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
