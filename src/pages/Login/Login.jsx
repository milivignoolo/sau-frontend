import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { iniciarSesion } from '../../api/api';
import './Login.css';
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth(); 
  const [email, setEmail] = useState('');
  const [contraseña, setContraseña] = useState('');
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      const data = await iniciarSesion({ email, contraseña });
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      login(data.user, data.token);

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
    <div className="login-page">
      <Header />
      <main className="login-content">
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
      </main>
      <Footer />
    </div>
  );
};

export default Login;
