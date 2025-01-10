import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import App from './App';
import { queryClient } from './lib/queryClient';
import { dbConnection } from './lib/db/connection';
import { logger } from './lib/logger';
import './index.css';

// Initialize database connection
dbConnection.initialize().catch(err => {
  logger.error('Failed to initialize database', {
    context: { error: err },
    source: 'main'
  });
});

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <App />
        {process.env.NODE_ENV === 'development' && (
          <React.Suspense fallback={null}>
            <ReactQueryDevtools />
          </React.Suspense>
        )}
      </BrowserRouter>
    </QueryClientProvider>
  </React.StrictMode>
);