import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface GlobalSettings {
  temperature: number;
  contextWindow: number;
  maxTokens: number | null;
  systemMessage: string;
  streamOutput: boolean;
}

const initialState: GlobalSettings = {
  temperature: 1,
  contextWindow: 8,
  maxTokens: null,
  systemMessage: '这里是默认系统消息内容，可以自定义。',
  streamOutput: true,
};

const settingsSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    updateGlobalSettings: (
      state,
      action: PayloadAction<Partial<GlobalSettings>>
    ) => {
      return { ...state, ...action.payload };
    },
    resetToDefaults: (state) => {
      return initialState;
    },
  },
});

export const { updateGlobalSettings, resetToDefaults } = settingsSlice.actions;
export default settingsSlice.reducer;
