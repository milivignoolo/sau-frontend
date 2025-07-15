// RegistroEmpresa.jsx
import { useState } from 'react';
import { enviarCodigo, registrarEmpresa, verificarCuit } from '../../api/api';

const RegistroEmpresa = () => {
  const [paso, setPaso] = useState(1);
  const [cuit, setCuit] = useState('');
  const [razonSocial, setRazonSocial] = useState('');
  const [email, setEmail] = useState('');
  const [codigoEnviado, setCodigoEnviado] = useState(null);
  const [codigoIngresado, setCodigoIngresado] = useState('');
  const [intentos, setIntentos] = useState(0);
  const [codigoExpirado, setCodigoExpirado] = useState(false);
  const [datosAdicionales, setDatosAdicionales] = useState({
    rubro: '',
    domicilio_legal: '',
    telefono: '',
    ubicacion: '',
    referente: '',
    cargo_referente: '',
    web: '',
    redes_sociales: ''
  });
  const [contraseña, setContraseña] = useState('');

  const validarCuit = (cuit) => /^\d{11}$/.test(cuit);
  const validarEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const validarContraseña = (c) => /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/.test(c);

  const handleVerificarCuit = async () => {
    if (!validarCuit(cuit)) return alert('CUIT inválido. Debe tener 11 dígitos.');
    if (!razonSocial.trim()) return alert('Debe ingresar la razón social.');

    try {
      await verificarCuit(cuit);
      setPaso(2);
    } catch (error) {
      alert(error.error || 'CUIT ya registrado');
    }
  };

  const handleEnviarCodigo = async () => {
    if (!validarEmail(email)) return alert('Email inválido');

    const codigo = Math.floor(100000 + Math.random() * 900000);
    setCodigoEnviado(codigo);
    setIntentos(0);
    setCodigoExpirado(false);

    try {
      await enviarCodigo({ email, codigo });
      alert('Código enviado al email');
      setPaso(3);
      setTimeout(() => setCodigoExpirado(true), 5 * 60 * 1000);
    } catch {
      alert('Error al enviar correo');
    }
  };

  const handleVerificarCodigo = () => {
    if (codigoExpirado) return alert('Código expirado');

    if (Number(codigoIngresado) === codigoEnviado) {
      setPaso(4);
    } else {
      const nuevos = intentos + 1;
      setIntentos(nuevos);
      alert(nuevos >= 3 ? 'Máximo de intentos alcanzado' : 'Código incorrecto');
    }
  };

  const handleRegistroFinal = async () => {
    if (!validarContraseña(contraseña)) return alert('Contraseña débil');

    try {
      await registrarEmpresa({
        cuit,
        razon_social: razonSocial,
        email,
        contraseña,
        datosAdicionales
      });
      alert('Empresa registrada exitosamente');
    } catch (err) {
      alert(err.error || 'Error al registrar');
    }
  };

  return (
    <div className="formulario">
      <h1 className="titulo1">Registro de Empresa</h1>

      {paso === 1 && (
        <>
          <input placeholder="CUIT" value={cuit} onChange={e => setCuit(e.target.value)} />
          <input placeholder="Razón social" value={razonSocial} onChange={e => setRazonSocial(e.target.value)} />
          <button onClick={handleVerificarCuit}>Siguiente</button>
        </>
      )}

      {paso === 2 && (
        <>
          <input placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />
          <input placeholder="Rubro" value={datosAdicionales.rubro} onChange={e => setDatosAdicionales({ ...datosAdicionales, rubro: e.target.value })} />
          <input placeholder="Domicilio legal" value={datosAdicionales.domicilio_legal} onChange={e => setDatosAdicionales({ ...datosAdicionales, domicilio_legal: e.target.value })} />
          <input placeholder="Teléfono" value={datosAdicionales.telefono} onChange={e => setDatosAdicionales({ ...datosAdicionales, telefono: e.target.value })} />
          <input placeholder="Ubicación" value={datosAdicionales.ubicacion} onChange={e => setDatosAdicionales({ ...datosAdicionales, ubicacion: e.target.value })} />
          <input placeholder="Nombre del referente" value={datosAdicionales.referente} onChange={e => setDatosAdicionales({ ...datosAdicionales, referente: e.target.value })} />
          <input placeholder="Cargo del referente" value={datosAdicionales.cargo_referente} onChange={e => setDatosAdicionales({ ...datosAdicionales, cargo_referente: e.target.value })} />
          <input placeholder="Sitio web (opcional)" value={datosAdicionales.web} onChange={e => setDatosAdicionales({ ...datosAdicionales, web: e.target.value })} />
          <input placeholder="Redes sociales (opcional)" value={datosAdicionales.redes_sociales} onChange={e => setDatosAdicionales({ ...datosAdicionales, redes_sociales: e.target.value })} />
          <button onClick={handleEnviarCodigo}>Solicitar código</button>
        </>
      )}

      {paso === 3 && (
        <>
          <input placeholder="Código recibido" value={codigoIngresado} onChange={e => setCodigoIngresado(e.target.value)} />
          <button onClick={handleVerificarCodigo}>Verificar código</button>
          <button onClick={handleEnviarCodigo}>Reenviar código</button>
        </>
      )}

      {paso === 4 && (
        <>
          <input type="password" placeholder="Crear contraseña" value={contraseña} onChange={e => setContraseña(e.target.value)} />
          <button onClick={handleRegistroFinal}>Finalizar registro</button>
        </>
      )}
    </div>
  );
};

export default RegistroEmpresa;
