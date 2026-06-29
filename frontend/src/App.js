import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './pages/auth/Login';
import Dashboard from './pages/dashboard/Dashboard';
import Assets from './pages/assets/Assets';
import Transactions from './pages/transactions/Transactions';
import Maintenance from './pages/maintenance/Maintenance';
import Stock from './pages/stock/Stock';
import Reports from './pages/reports/Reports';
import Users from './pages/auth/Users';

const PrivateRoute = ({ children, roles }) => {
  const { user, loading } = useAuth();
  if (loading) return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>Loading...</div>;
  if (!user) return <Navigate to="/login" />;
  if (roles && !roles.includes(user.role)) return <Navigate to="/dashboard" />;
  return children;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Toaster position="top-right" />
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
          <Route path="/assets" element={<PrivateRoute><Assets /></PrivateRoute>} />
          <Route path="/transactions" element={<PrivateRoute><Transactions /></PrivateRoute>} />
          <Route path="/maintenance" element={<PrivateRoute roles={['admin', 'store_manager']}><Maintenance /></PrivateRoute>} />
          <Route path="/stock" element={<PrivateRoute roles={['admin', 'store_manager']}><Stock /></PrivateRoute>} />
          <Route path="/reports" element={<PrivateRoute roles={['admin', 'store_manager']}><Reports /></PrivateRoute>} />
          <Route path="/users" element={<PrivateRoute roles={['admin']}><Users /></PrivateRoute>} />
          <Route path="/" element={<Navigate to="/login" />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
