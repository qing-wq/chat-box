import React, { Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { routes } from './routes';
import ThemeProvider from '../providers/ThemeProvider';
import LoadingSpinner from '../components/ui/LoadingSpinner';

// Helper function to render routes recursively
const renderRoutes = (routeConfig: any[]) => {
  return routeConfig.map((route, index) => {
    const { children, ...routeProps } = route;
    
    if (children) {
      return (
        <Route key={index} {...routeProps}>
          {renderRoutes(children)}
        </Route>
      );
    }
    
    return <Route key={index} {...routeProps} />;
  });
};

// Main router component
const AppRouter: React.FC = () => {
  return (
    <ThemeProvider>
      <Router>
        <Suspense fallback={<LoadingSpinner />}>
          <Routes>
            {renderRoutes(routes)}
          </Routes>
        </Suspense>
      </Router>
    </ThemeProvider>
  );
};

export default AppRouter;

// Re-export components for backward compatibility
export { default as ProtectedRoute } from './ProtectedRoute';
export { default as ThemeProvider } from '../providers/ThemeProvider';
export { default as LoadingSpinner } from '../components/ui/LoadingSpinner';