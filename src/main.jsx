import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { CssBaseline, ThemeProvider } from '@mui/material';
import App from './App';
import { NotificationProvider } from './context/NotificationContext';
import { campusTheme } from './theme';

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <ThemeProvider theme={campusTheme}>
      <CssBaseline />
      <NotificationProvider>
        <App />
      </NotificationProvider>
    </ThemeProvider>
  </BrowserRouter>,
);