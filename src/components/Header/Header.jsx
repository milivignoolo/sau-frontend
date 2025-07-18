import { useNavigate } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import './Header.css';

const Header = () => {
  const navigate = useNavigate();
  const [mostrarOpciones, setMostrarOpciones] = useState(false);
  const dropdownRef = useRef(null);

  const toggleOpciones = () => setMostrarOpciones(prev => !prev);

  const irARegistro = (ruta) => {
    navigate(ruta);
    setMostrarOpciones(false);
  };

  // Cierra el menú al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setMostrarOpciones(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="header">
      <div className="header-left">
        <button className="btn-volver" onClick={() => navigate(-1)}>← Volver</button>
      </div>

      <button className="b2" onClick={() => navigate('/')}>Sistemas de Pasantias</button>

      <div className="header-right">
        <button onClick={() => navigate('/login')}>Iniciar sesión</button>
        <div className="registro-dropdown" ref={dropdownRef}>
          <button onClick={toggleOpciones}>Registrarse</button>
          {mostrarOpciones && (
            <div className="registro-opciones">
              <button onClick={() => irARegistro('/registro/empresa')}>Empresa</button>
              <button onClick={() => irARegistro('/registro/estudiante')}>Estudiante</button>
              <button onClick={() => irARegistro('/registro/admin')}>Administrador</button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
