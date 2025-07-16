import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// ✅ Interceptor que agrega el token a cada request automáticamente
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ✅ Manejo de errores
const handleError = (error) => {
  if (error.response && error.response.data) throw error.response.data;
  throw { error: 'Error desconocido' };
};

export const verificarIdentidad = async ({ legajo, dni }) => {
  try {
    const res = await api.post('/estudiantes/verificar-identidad', { legajo, dni });
    return res.data;
  } catch (e) {
    return handleError(e);
  }
};

export const enviarCodigo = async ({ email, codigo }) => {
  const res = await fetch('/api/email/enviar-codigo', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, codigo }),
  });

  const data = await res.json();
  if (!res.ok) throw data;
  return data;
};

export const registrarEstudiante = async (datos) => {
  try {
    const res = await api.post('/estudiantes/register', datos);
    return res.data;
  } catch (e) {
    return handleError(e);
  }
};

export const registrarEmpresa = async (datos) => {
  try {
    const res = await api.post('/empresas/register', datos);
    return res.data;
  } catch (e) {
    return handleError(e);
  }
};

export const verificarCuit = async (cuit) => {
  try {
    const res = await api.post('/empresas/verificar-cuit', { cuit });
    return res.data;
  } catch (e) {
    return handleError(e);
  }
};

export const verificarDNIadmin = async ({ dni, nombre, apellido }) => {
  try {
    const res = await api.post('/administradores/verificar-dni', { dni, nombre, apellido });
    return res.data;
  } catch (e) {
    return handleError(e);
  }
};

export const registrarAdministrador = async (datos) => {
  try {
    const res = await api.post('/administradores/register', datos);
    return res.data;
  } catch (e) {
    return handleError(e);
  }
};

export const iniciarSesion = async ({ email, contraseña }) => {
  try {
    const res = await api.post('/auth/login', { email, contraseña });
    return res.data;
  } catch (e) {
    return handleError(e);
  }
};

export const registrarPasantia = async (datos) => {
  try {
    const res = await api.post('/pasantias/register', datos);
    return res.data;
  } catch (e) {
    return handleError(e);
  }
};
