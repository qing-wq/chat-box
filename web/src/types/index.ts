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
  description?: string;
  systemMessage?: string;
}

export interface ChatListInfo {
  uuid: string;
  title: string;
  createTime: string;
  updateTime: string;
}

export interface ChatDetail{
  conversation: Conversation;
  messageList: Message[];
  currentModel?: Model;
}

// Conversation types
export interface Conversation {
  id: number;
  uuid: string;
  createTime: string;
  updateTime: string;
  title: string;
  remark?: string;
  description?: string;
  systemMessage?: string;
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

// Platform types
export enum PlatformType {
  "openai" = 0,
  "openai-response" = 1,
  "gemini" = 2,
  "anthropic" = 3,
  "azure_openai" = 4
  // Add more platform types as needed
}

// Export knowledge base types
export * from './knowledgeBase';

// Model types
export interface Model {
  id: number;
  createTime: string;
  updateTime: string;
  name: string;
  type: string;
  platformId: number;
}

export interface Platform {
  id: string;
  name: string;
  platformType: string;
  apiKey: string;
  baseUrl: string;
  createTime?: string;
  updateTime?: string;
  modelList?: Model[];
  enable?: boolean;
}
