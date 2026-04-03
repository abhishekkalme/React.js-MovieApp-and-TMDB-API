import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import { AuthProvider } from './context/AuthContext';
import { LibraryProvider } from './context/LibraryContext';
import { NotificationProvider } from './context/NotificationContext';

ReactDOM.createRoot(document.getElementById('root')).render(
 
    <NotificationProvider>
      <AuthProvider>
        <LibraryProvider>
          <App />
        </LibraryProvider>
      </AuthProvider>
    </NotificationProvider>
  
);
