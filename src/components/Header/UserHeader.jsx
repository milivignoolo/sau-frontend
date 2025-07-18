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

  return (
    <nav className="user-header">
      <div className="logo" onClick={() => navigate('/')}>
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
              <button onClick={() => navigate('/panel-administrador')}>Panel Admin</button>
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
