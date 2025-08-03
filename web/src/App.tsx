import React from 'react';
import { Provider } from 'react-redux';
import { store } from './store';
import AppRouter from './router';

// Import styles
import './index.css';

// App component with Redux Provider
const App: React.FC = () => {
  return (
    <Provider store={store}>
      <AppRouter />
    </Provider>
  );
};

export default App;
