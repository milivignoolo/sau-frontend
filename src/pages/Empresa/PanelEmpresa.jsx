import React from 'react';
import { useNavigate } from 'react-router-dom';

const PanelEmpresa = () => {
  const navigate = useNavigate();

  const handleNuevaPasantia = () => {
    navigate('/nueva-pasantia'); // Ruta para crear nueva pasantía
  };

  return (
    <div>
      <h1>Panel de Empresa</h1>
      <p>Bienvenido al panel de empresa.</p>
      <button onClick={() => navigate('/empresa/registrar-pasantia')}>Registrar nueva pasantía</button>
    </div>
  );
};

export default PanelEmpresa;
