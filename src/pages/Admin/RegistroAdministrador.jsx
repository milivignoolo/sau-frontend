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

  const handleVerificarDNI = async () => {
    if (!/^\d{7,8}$/.test(dni)) {
      return alert('Formato de DNI incorrecto.');
    }

    try {
      const data = await verificarDNIadmin({ dni, nombre, apellido });
      setEmail(data.email);
      setPaso(2);
    } catch (error) {
      alert(error.error || 'Error al verificar DNI.');
    }
  };

  const handleEnviarCodigo = async () => {
    const codigo = Math.floor(100000 + Math.random() * 900000);
    setCodigoEnviado(codigo);
    setIntentos(0);
    setCodigoExpirado(false);
    setPaso(3);

    try {
      await enviarCodigo({ email, codigo });
      alert('Código enviado al email.');
      setTimeout(() => setCodigoExpirado(true), 5 * 60 * 1000);
    } catch (err) {
      alert('Error al enviar el correo.');
    }
  };

  const handleVerificarCodigo = () => {
    if (codigoExpirado) {
      alert('El código expiró. Solicitá uno nuevo.');
      return;
    }

    if (Number(codigoIngresado) === codigoEnviado) {
      setPaso(4);
    } else {
      const nuevosIntentos = intentos + 1;
      setIntentos(nuevosIntentos);
      alert(nuevosIntentos >= 3 ? 'Demasiados intentos. Reenviá el código.' : 'Código incorrecto.');
    }
  };

  const handleRegistroFinal = async () => {
    const emailValido = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    if (!emailValido) return alert('Email inválido');

    const contraseñaValida = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/.test(contraseña);
    if (!contraseñaValida) return alert('Contraseña débil. Debe tener mínimo 8 caracteres, una mayúscula y un número.');

    try {
      await registrarAdministrador({ dni, nombre, apellido, email, contraseña });
      alert('Administrador registrado con éxito.');
    } catch (err) {
      alert(err.error || 'Error al registrar.');
    }
  };

  return (
    <div className="pagina-con-footer">
      <Header />
      <main className="formulario">
        <h1 className="titulo1">Registro de Administrador</h1>

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
            <input placeholder="Código recibido" value={codigoIngresado} onChange={e => setCodigoIngresado(e.target.value)} />
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
      </main>
      <Footer />
    </div>
  );
};

export default RegistroAdministrador;
