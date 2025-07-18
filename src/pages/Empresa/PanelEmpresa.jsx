import React from 'react';
import { useNavigate } from 'react-router-dom';
import UserHeader from '../../components/Header/UserHeader';
import Footer from '../../components/Footer/Footer';
import './PanelEmpresa.css';

const PanelEmpresa = () => {
  const navigate = useNavigate();

  return (
    <div className="panel-layout">
      <UserHeader />
      <main className="panel-contenido">
        <h1>Panel de Empresa</h1>
        <p>Bienvenido al panel de empresa.</p>
        <button className="btn-principal" onClick={() => navigate('/empresa/registrar-pasantia')}>
          Registrar nueva pasantía
        </button>
      </main>
      <Footer />
    </div>
  );
};

export default PanelEmpresa;
