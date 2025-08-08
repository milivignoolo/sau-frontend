import { useState } from 'react';
import { verificarDNIadmin, registrarAdministrador, enviarCodigo } from '../../api/api';
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';
import './RegistroAdministrador.css';

const RegistroAdministrador = () => {
  const [paso, setPaso] = useState(1);
  const [nombre, setNombre] = useState('');
  const [apellido, setApellido] = useState('');
  const [dni, setDni] = useState('');
  const [email, setEmail] = useState('');
  const [codigoEnviado, setCodigoEnviado] = useState(null);
  const [codigoIngresado, setCodigoIngresado] = useState('');
  const [codigoExpirado, setCodigoExpirado] = useState(false);
  const [intentos, setIntentos] = useState(0);
  const [contraseña, setContraseña] = useState('');
  const [error, setError] = useState(null);
  const [exito, setExito] = useState(null);  // Estado para mensaje de éxito

  // Validaciones
  const validarDni = (dni) => /^\d{7,8}$/.test(dni);
  const validarEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const validarContraseña = (c) => /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/.test(c);

  const handleVerificarDNI = async () => {
    setError(null);
    setExito(null);
    if (!validarDni(dni)) {
      setError('Formato de DNI incorrecto. Debe tener 7 u 8 dígitos numéricos.');
      return;
    }
    if (!nombre.trim() || !apellido.trim()) {
      setError('Nombre y apellido son obligatorios.');
      return;
    }
  
    try {
      const data = await verificarDNIadmin({ dni, nombre, apellido });
      setEmail(data.email);
      setPaso(2);
      setError(null);
      setExito(null);
    } catch (err) {
      if (err.message === 'Failed to fetch') {
        setError('No se pudo conectar al servidor. Intentá nuevamente.');
      } else {
        setError(err.error || 'Error al verificar DNI.');
      }
      setExito(null);
    }
  };
  
  const handleEnviarCodigo = async () => {
    setError(null);
    setExito(null);
    if (!email.trim()) {
      setError('El campo email no puede estar vacío.');
      return;
    }
    if (!validarEmail(email)) {
      setError('Email inválido.');
      return;
    }
  
    const codigo = Math.floor(100000 + Math.random() * 900000);
    setCodigoEnviado(codigo);
    setIntentos(0);
    setCodigoExpirado(false);
    setPaso(3);
  
    try {
      await enviarCodigo({ email, codigo });
      setError(null);
      setExito('Código enviado al email.');
      setTimeout(() => setCodigoExpirado(true), 5 * 60 * 1000);
    } catch (err) {
      if (err.message === 'Failed to fetch') {
        setError('No se pudo conectar al servidor. Intentá nuevamente.');
      } else {
        setError('Error al enviar el correo. Intenta nuevamente más tarde.');
      }
      setExito(null);
    }
  };
  
  const handleVerificarCodigo = () => {
    setError(null);
    setExito(null);
  
    if (!codigoIngresado.trim()) {
      setError('Debés ingresar un código.');
      return;
    }
  
    if (codigoExpirado) {
      setError('El código expiró. Solicitá uno nuevo.');
      return;
    }
  
    if (Number(codigoIngresado) === codigoEnviado) {
      setPaso(4);
      setError(null);
      setExito(null);
    } else {
      const nuevosIntentos = intentos + 1;
      setIntentos(nuevosIntentos);
      if (nuevosIntentos >= 3) {
        setError('Demasiados intentos. Reenviá el código.');
      } else {
        setError('Código incorrecto.');
      }
    }
  };
  
  const handleRegistroFinal = async () => {
    setError(null);
    setExito(null);
  
    if (!contraseña.trim()) {
      setError('La contraseña no puede estar vacía.');
      return;
    }
  
    if (!validarContraseña(contraseña)) {
      setError('Contraseña débil. Debe tener mínimo 8 caracteres, una mayúscula, una minúscula y un número.');
      return;
    }
  
    try {
      await registrarAdministrador({ dni, nombre, apellido, email, contraseña });
      setError(null);
      setExito('Administrador registrado con éxito.');
      navigate('/login');
      
    } catch (err) {
      if (err.message === 'Failed to fetch') {
        setError('No se pudo conectar al servidor. Intentá nuevamente.');
      } else {
        setError(err.error || 'Error al registrar.');
      }
      setExito(null);
    }
  };
  

  return (
    <div className="pagina-con-footer">
      <Header />
      <main className="formularioadmin">
        <h1 className="titulo1admin">Registro de Administrador</h1>

        {paso === 1 && (
          <>
            <input placeholder="Nombre" value={nombre} onChange={e => setNombre(e.target.value)} />
            <input placeholder="Apellido" value={apellido} onChange={e => setApellido(e.target.value)} />
            <input placeholder="DNI" value={dni} onChange={e => setDni(e.target.value)} />
            <button onClick={handleVerificarDNI}>Verificar Identidad</button>
          </>
        )}

        {paso === 2 && (
          <>
            <input placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />
            <button onClick={handleEnviarCodigo}>Enviar código</button>
          </>
        )}

        {paso === 3 && (
          <>
            <input
              placeholder="Código recibido"
              value={codigoIngresado}
              onChange={e => setCodigoIngresado(e.target.value)}
            />
            <button onClick={handleVerificarCodigo}>Verificar código</button>
            <button onClick={handleEnviarCodigo}>Reenviar código</button>
          </>
        )}

        {paso === 4 && (
          <>
            <input
              type="password"
              placeholder="Crear contraseña"
              value={contraseña}
              onChange={e => setContraseña(e.target.value)}
            />
            <button onClick={handleRegistroFinal}>Finalizar registro</button>
          </>
        )}

        {error && <p style={{ color: 'red', marginTop: '1rem' }}>{error}</p>}
        {exito && <p style={{ color: 'green', marginTop: '1rem' }}>{exito}</p>}
      </main>
      <Footer />
    </div>
  );
};

export default RegistroAdministrador;
