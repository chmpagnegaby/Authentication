import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

import Login from './components/Login';
import Register from './components/Register';
import ForgotPassword from './components/ForgotPassword';
import DashboardCreador from './components/DashboardCreador';
import DashboardMarca from './components/DashboardMarca';
import PrivateRoute from './components/PrivateRoute';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />

      {/* Rutas protegidas */}
      <Route element={<PrivateRoute />}>
        <Route path="/dashboard/creador" element={<DashboardCreador />} />
        <Route path="/dashboard/marca" element={<DashboardMarca />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
