import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { iniciarSesion } from '../../api/api';

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth(); // ← Función para guardar user + token
  const [email, setEmail] = useState('');
  const [contraseña, setContraseña] = useState('');
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      const data = await iniciarSesion({ email, contraseña });

      // 🟩 Guardar token y usuario en localStorage
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));

      // 🟦 También actualizar el contexto si estás usando AuthContext
      login(data.user, data.token);

      // Redirección según el rol
      switch (data.user.role) {
        case 'estudiante':
          navigate('/panel-estudiante');
          break;
        case 'empresa':
          navigate('/panel-empresa');
          break;
        case 'administrador':
          navigate('/panel-admin');
          break;
        default:
          navigate('/');
          break;
      }

    } catch (err) {
      setError(err.error || 'Error al iniciar sesión');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Iniciar Sesión</h2>

      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />

      <input
        type="password"
        placeholder="Contraseña"
        value={contraseña}
        onChange={(e) => setContraseña(e.target.value)}
        required
      />

      <button type="submit">Ingresar</button>

      {error && <p style={{ color: 'red' }}>{error}</p>}
    </form>
  );
};

export default Login;
