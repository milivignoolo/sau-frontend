import { BrowserRouter, Routes, Route } from 'react-router-dom';
//import Login from '../pages/Login';
import RegistroEstudiante from '../pages/Estudiante/RegistroEstudiante';
import RegistroEmpresa from '../pages/Empresa/RegistroEmpresa';
//import RegistroAdmin from '../pages/RegistroAdmin';
//import PanelEstudiante from '../pages/PanelEstudiante';
//import PanelEmpresa from '../pages/PanelEmpresa';
//import PanelAdmin from '../pages/PanelAdmin';

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/registro/estudiante" element={<RegistroEstudiante />} />
        <Route path="/registro/empresa" element={<RegistroEmpresa />} />
  
      </Routes>
    </BrowserRouter>
  );
}
