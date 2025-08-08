import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './UserHeader.css';

const UserHeader = () => {
  const navigate = useNavigate();
  const authContext = useAuth();

  // Validar que el contexto exista (por si no está envuelto en AuthProvider)
  if (!authContext) {
    // Mostrar header básico para evitar que no se vea nada
    return (
      <nav className="user-header">
        <div className="logo" onClick={() => navigate('/')}>MiApp UTN</div>
        <div className="acciones">
          <button onClick={() => navigate('/login')}>Iniciar Sesión</button>
        </div>
      </nav>
    );
  }

  const { isAuthenticated, currentUser, userRole, logout } = authContext;

  const handleLogout = () => {
    logout();
  };

  // Función para manejar click en logo y redirigir según estado y rol
  const handleLogoClick = () => {
    if (!isAuthenticated) {
      navigate('/'); // o '/login' si preferís que vaya directo a login
    } else {
      // Redirigir según rol
      switch (userRole) {
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
          navigate('/'); // fallback por si hay un rol desconocido
      }
    }
  };

  return (
    <nav className="user-header">
      <div className="logo" onClick={handleLogoClick} style={{ cursor: 'pointer' }}>
        Gestion de Pasantías UTN
      </div>

      <div className="acciones">
        {!isAuthenticated && (
          <button onClick={() => navigate('/login')}>Iniciar Sesión</button>
        )}

        {isAuthenticated && (
          <>
            <span className="usuario">Hola, {currentUser?.nombre || 'Usuario'}</span>

            {userRole === 'estudiante' && (
              <button onClick={() => navigate('/panel-estudiante')}>Panel Estudiante</button>
            )}
            {userRole === 'empresa' && (
              <button onClick={() => navigate('/panel-empresa')}>Panel Empresa</button>
            )}
            {userRole === 'administrador' && (
              <button onClick={() => navigate('/panel-admin')}>Panel Admin</button>
            )}

            <button onClick={handleLogout} style={{ marginLeft: '1rem' }}>
              Cerrar Sesión
            </button>
          </>
        )}
      </div>
    </nav>
  );
};

export default UserHeader;
