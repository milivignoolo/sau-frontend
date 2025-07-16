import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from '../context/AuthContext';
import ProtectedRoute from '../components/ProtectedRoute/ProtectedRoute';

import Login from '../pages/Login/Login';
import LandingPage from '../pages/Landingpage/LandingPage';
import RegistroEstudiante from '../pages/Estudiante/RegistroEstudiante';
import RegistroEmpresa from '../pages/Empresa/RegistroEmpresa';
import RegistroAdmin from '../pages/Admin/RegistroAdministrador';
import PanelEstudiante from '../pages/Estudiante/PanelEstudiante';
import PanelEmpresa from '../pages/Empresa/PanelEmpresa';
import PanelAdmin from '../pages/Admin/PanelAdministrador';
import RegistrarPasantia from '../pages/Empresa/RegistrarPasantia';

export default function AppRoutes() {
  return (
    <AuthProvider>
      <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/registro/estudiante" element={<RegistroEstudiante />} />
      <Route path="/registro/empresa" element={<RegistroEmpresa />} />
      <Route path="/registro/admin" element={<RegistroAdmin />} />
      <Route path="/panel-estudiante" element={<ProtectedRoute rol="estudiante"><PanelEstudiante /></ProtectedRoute>} />
      <Route path="/panel-empresa" element={<ProtectedRoute rol="empresa"><PanelEmpresa /></ProtectedRoute>} />
      <Route path="/panel-admin" element={<ProtectedRoute rol="administrador"><PanelAdmin /></ProtectedRoute>} />
      <Route path="/empresa/registrar-pasantia" element={<ProtectedRoute rol="empresa"><RegistrarPasantia /></ProtectedRoute>} />
      </Routes>
      </AuthProvider>
  );
}

