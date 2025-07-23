import React from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './store';
import { useAppSelector } from './hooks';

// Import pages and layouts
import MainLayout from './components/layout/MainLayout';
import HomePage from './pages/HomePage';
import ChatPage from './pages/ChatPage';
import LoginPage from './pages/LoginPage';
import SettingsPage from './pages/SettingsPage';
import PlatformPage from './pages/PlatformPage';
import ModelPage from './pages/ModelPage';
import MarkdownDemo from './components/demo/MarkdownDemo';
import SSETest from './components/demo/SSETest';

// Import styles
import './index.css';

// Auth guard component
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { isLoggedIn } = useAppSelector((state) => state.user);

  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

// Theme provider component
const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { theme: themeMode } = useAppSelector((state) => state.config);

  // Apply theme class to document
  React.useEffect(() => {
    if (themeMode === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [themeMode]);

  return <>{children}</>;
};

// App component with Redux Provider
const AppWithProviders: React.FC = () => {
  return (
    <Provider store={store}>
      <AppContent />
    </Provider>
  );
};

// Main app content with routing
const AppContent: React.FC = () => {
  return (
    <ThemeProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<LoginPage />} />

          <Route path="/demo" element={<MarkdownDemo />} />
          <Route path="/sse-test" element={<SSETest />} />

          <Route
            path="/"
            element={
              <ProtectedRoute>
                <MainLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<HomePage />} />
            <Route path="chat/:chatId" element={<ChatPage />} />
            <Route path="settings" element={<SettingsPage />} />
            <Route path="platforms" element={<PlatformPage />} />
            <Route path="models/:modelId" element={<ModelPage />} />
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
};

export default AppWithProviders;
