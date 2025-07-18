import React from 'react';
import UserHeader from '../../components/Header/UserHeader';
import Footer from '../../components/Footer/Footer';
import './PanelEstudiante.css';

const PanelEstudiante = () => {
  return (
    <div className="pagina-con-footer">
      <UserHeader />
      <div className="contenido">
        <div className="panel-estudiante">
          <h1 className="titulo">Panel de Estudiante</h1>
          <p>Bienvenido al panel de estudiante.</p>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default PanelEstudiante;
