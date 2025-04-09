import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ModelConfig, ModelParams, ThemeMode } from '../types';

interface ConfigState {
  theme: ThemeMode;
  modelConfig: ModelConfig;
}

// Default model configuration
const defaultModelConfig: ModelConfig = {
  apiUrl: 'https://api.openai.com/v1',  // Default OpenAI API URL
  apiKey: '',  // User needs to provide their own API key
  modelName: 'gpt-3.5-turbo',  // Default to a more widely available model
  modelParams: {
    temperature: 0.7,
    topP: 0.9,
    maxTokens: 2000
  }
};

// 尝试从localStorage加载保存的配置
const loadSavedConfig = (): ConfigState => {
  try {
    // 加载主题设置
    const savedTheme = localStorage.getItem('theme') as ThemeMode | null;
    
    // 加载模型配置
    const savedModelConfigStr = localStorage.getItem('modelConfig');
    let savedModelConfig: ModelConfig | null = null;
    
    if (savedModelConfigStr) {
      savedModelConfig = JSON.parse(savedModelConfigStr);
    }
    
    return {
      theme: savedTheme || 'light',
      modelConfig: savedModelConfig || defaultModelConfig
    };
  } catch (error) {
    console.error('Error loading saved config:', error);
    return {
      theme: 'light',
      modelConfig: defaultModelConfig
    };
  }
};

const initialState: ConfigState = loadSavedConfig();

const configSlice = createSlice({
  name: 'config',
  initialState,
  reducers: {
    setTheme: (state, action: PayloadAction<ThemeMode>) => {
      state.theme = action.payload;
      // Update document class for theme
      if (action.payload === 'dark') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
      localStorage.setItem('theme', action.payload);
    },
    setModelConfig: (state, action: PayloadAction<ModelConfig>) => {
      state.modelConfig = action.payload;
      localStorage.setItem('modelConfig', JSON.stringify(action.payload));
    },
    updateModelParam: (state, action: PayloadAction<{ key: keyof ModelParams, value: any }>) => {
      const { key, value } = action.payload;
      if (state.modelConfig.modelParams) {
        state.modelConfig.modelParams[key] = value;
      } else {
        state.modelConfig.modelParams = { [key]: value } as ModelParams;
      }
      localStorage.setItem('modelConfig', JSON.stringify(state.modelConfig));
    }
  }
});

export const { setTheme, setModelConfig, updateModelParam } = configSlice.actions;
export default configSlice.reducer;
