import React from 'react';
import UserHeader from '../../components/Header/UserHeader';
import Footer from '../../components/Footer/Footer';
import './PanelAdministrador.css';

const PanelAdministrador = () => {
  return (
    <div className="panel-wrapper">
      <UserHeader titulo="Panel de Administrador" />
      <main className="panel-content">
        <p>Bienvenido al panel de administrador.</p>
      </main>
      <Footer />
    </div>
  );
};

export default PanelAdministrador;
