import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const UserHeader = () => {
  const navigate = useNavigate();
  const { isAuthenticated, currentUser, userRole, logout } = useAuth();

  const handleLogout = () => {
    logout();
  };

  return (
    <nav style={{ display: 'flex', justifyContent: 'space-between', padding: '1rem' }}>
      <div
        style={{ cursor: 'pointer', fontWeight: 'bold' }}
        onClick={() => navigate('/')}
      >
        MiApp UTN
      </div>

      <div>
        {!isAuthenticated && (
          <>
            <button onClick={() => navigate('/login')}>Iniciar Sesión</button>
          </>
        )}

        {isAuthenticated && (
          <>
            <span style={{ marginRight: '1rem' }}>Hola, {currentUser?.nombre}</span>

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
