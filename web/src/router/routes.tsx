import React from 'react';
import { RouteObject } from 'react-router-dom';
import { Navigate } from 'react-router-dom';

// Import layouts
import ChatMainLayout from '../components/layout/ChatMainLayout';
import GlobalMainLayout from '../components/layout/GlobalMainLayout';
import ProtectedRoute from './ProtectedRoute';

// Lazy load pages for better performance
const HomePage = React.lazy(() => import('../pages/HomePage'));
const ChatPage = React.lazy(() => import('../pages/ChatPage'));
const LoginPage = React.lazy(() => import('../pages/LoginPage'));
const SettingsPage = React.lazy(() => import('../pages/SettingsPage'));
const PlatformPage = React.lazy(() => import('../pages/PlatformPage'));
const ModelPage = React.lazy(() => import('../pages/ModelPage'));
const KnowledgeBasePage = React.lazy(() => import('../pages/KnowledgeBasePage'));
const KnowledgeDetailPage = React.lazy(() => import('../pages/KnowledgeDetailPage'));
const MarkdownDemo = React.lazy(() => import('../components/demo/MarkdownDemo'));
const SSETest = React.lazy(() => import('../components/demo/SSETest'));

// Define route configuration
export const routes: RouteObject[] = [
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    path: '/demo',
    element: <MarkdownDemo />,
  },
  {
    path: '/sse-test',
    element: <SSETest />,
  },
  // Chat routes with ChatMainLayout
  {
    path: '/',
    element: (
      <ProtectedRoute>
        <ChatMainLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: 'chat/:chatId',
        element: <ChatPage />,
      },
    ],
  },
  // Global routes with GlobalMainLayout
  {
    path: '/',
    element: (
      <ProtectedRoute>
        <GlobalMainLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        path: 'settings',
        element: <SettingsPage />,
      },
      {
        path: 'platforms',
        element: <PlatformPage />,
      },
      {
        path: 'models/:modelId',
        element: <ModelPage />,
      },
      {
        path: 'knowledge-base',
        element: <KnowledgeBasePage />,
      },
      {
        path: 'knowledge-base/:kbId',
        element: <KnowledgeDetailPage />,
      },
    ],
  },
  {
    path: '*',
    element: <Navigate to="/" replace />,
  },
];