import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Finance from './Finance';
import Invoices from './Invoices';
import Payments from './Payments';
import ErrorBoundary from '../../components/ErrorBoundary';
import LoadingSpinner from '../../components/LoadingSpinner';

const FinanceRoutes = () => {
  return (
    <ErrorBoundary source="Finance">
      <Routes>
        <Route index element={<Finance />} />
        <Route 
          path="invoices" 
          element={
            <React.Suspense fallback={<LoadingSpinner message="Loading invoices..." />}>
              <Invoices />
            </React.Suspense>
          } 
        />
        <Route 
          path="payments" 
          element={
            <React.Suspense fallback={<LoadingSpinner message="Loading payments..." />}>
              <Payments />
            </React.Suspense>
          } 
        />
      </Routes>
    </ErrorBoundary>
  );
};

export default FinanceRoutes;