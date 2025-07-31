import { configureStore } from '@reduxjs/toolkit';
import userReducer from './userSlice';
import chatReducer from './chatSlice';
import configReducer from './configSlice';
import platformReducer from './platformSlice';
import modelReducer from './modelSlice';
import knowledgeBaseReducer from './knowledgeBaseSlice';

export const store = configureStore({
  reducer: {
    user: userReducer,
    chat: chatReducer,
    config: configReducer,
    platform: platformReducer,
    model: modelReducer,
    knowledgeBase: knowledgeBaseReducer
  }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
