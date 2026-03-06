import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import { AuthProvider } from './context/AuthContext';
import { SavedProvider } from './context/SavedContext';
import { WatchedProvider } from './context/WatchedContext';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthProvider>
      <SavedProvider>
        <WatchedProvider>
          <App />
        </WatchedProvider>
      </SavedProvider>
    </AuthProvider>
  </React.StrictMode>
);
