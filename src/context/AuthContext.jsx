import React, { createContext, useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [token, setToken] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // ✅ Recuperar sesión si ya había una activa
  useEffect(() => {
    try {
      const storedUser = JSON.parse(localStorage.getItem('user'));
      const storedToken = localStorage.getItem('token');

      if (storedUser && storedToken) {
        setCurrentUser(storedUser);
        setToken(storedToken);
        setUserRole(storedUser.role);
        setIsAuthenticated(true);
      }
    } catch (error) {
      console.warn('Error al cargar usuario desde localStorage', error);
      localStorage.clear();
    }
    setLoading(false);
  }, []);

  // ✅ Guardar login
  const login = (userData, token) => {
    localStorage.setItem('user', JSON.stringify(userData));
    localStorage.setItem('token', token);

    setCurrentUser(userData);
    setToken(token);
    setUserRole(userData.role);
    setIsAuthenticated(true);
  };

  // ✅ Cerrar sesión
  const logout = () => {
    localStorage.clear();
    setCurrentUser(null);
    setToken(null);
    setUserRole(null);
    setIsAuthenticated(false);
    navigate('/login');
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        token,
        isAuthenticated,
        userRole,
        login,
        logout,
        loading,
      }}
    >
      {!loading && children}
    </AuthContext.Provider>
  );
};
