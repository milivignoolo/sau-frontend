import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { enviarCodigo, registrarEmpresa, verificarCuit } from '../../api/api';
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';
import './RegistroEmpresa.css';

const RegistroEmpresa = () => {
  const navigate = useNavigate();
  const [error, setError] = useState(null);
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
    referente: '',
    cargo_referente: '',
    web: '',
    redes_sociales: ''
  });
  const [contraseña, setContraseña] = useState('');

  // Validaciones frontend
  const validarCuit = (cuit) => /^\d{11}$/.test(cuit);
  const validarEmail = (email) => /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email);
  const validarContraseña = (c) => /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/.test(c);
  const validarTelefono = (tel) => /^\d{6,15}$/.test(tel); // obligatorio
  const validarDomicilio = (dom) => /^.+,\s*.+\s+\d+/.test(dom); // Ciudad, Calle Número
  const validarWeb = (web) => web === '' || /^https?:\/\/.+/.test(web); // opcional

  const validarRedesSociales = (redes) => {
    if (redes.trim() === '') return true; // opcional
    try {
      JSON.parse(redes);
      return true;
    } catch {
      return false;
    }
  };

  // Paso 1: Verificar CUIT y razón social
  const handleVerificarCuit = async () => {
    if (!validarCuit(cuit)) {
      setError('CUIT inválido. Debe tener 11 dígitos numéricos.');
      return;
    }
    if (!razonSocial.trim()) {
      setError('La razón social no puede estar vacía.');
      return;
    }

    try {
      await verificarCuit(cuit);
      setPaso(2);
      setError(null);
    } catch (error) {
      setError(error.error || 'CUIT ya registrado');
    }
  };

  // Paso 2: Enviar código (validar campos)
  const handleEnviarCodigo = async () => {
    if (!validarEmail(email)) {
      setError('Email inválido.');
      return;
    }
    if (!datosAdicionales.rubro.trim()) {
      setError('El rubro es obligatorio.');
      return;
    }
    if (!validarDomicilio(datosAdicionales.domicilio_legal)) {
      setError('El domicilio debe tener formato: Ciudad, Calle y Número.');
      return;
    }
    if (!validarTelefono(datosAdicionales.telefono)) {
      setError('Teléfono inválido. Solo números, mínimo 6 dígitos.');
      return;
    }
    if (!datosAdicionales.referente.trim()) {
      setError('El nombre del referente es obligatorio.');
      return;
    }
    if (!datosAdicionales.cargo_referente.trim()) {
      setError('El cargo del referente es obligatorio.');
      return;
    }
    if (!validarWeb(datosAdicionales.web)) {
      setError('Sitio web inválido. Debe comenzar con http:// o https://');
      return;
    }
    if (!validarRedesSociales(datosAdicionales.redes_sociales)) {
      setError('Redes sociales deben ser un JSON válido o estar vacío. {"facebook":"https://fb.com/empresa", "instagram":"https://instagram.com/empresa"}');
      return;
    }

    const codigo = Math.floor(100000 + Math.random() * 900000);
    setCodigoEnviado(codigo);
    setIntentos(0);
    setCodigoExpirado(false);

    try {
      await enviarCodigo({ email, codigo });
      setPaso(3);
      setError(null);
      setTimeout(() => setCodigoExpirado(true), 5 * 60 * 1000);
    } catch {
      setError('Error al enviar el código por correo.');
    }
  };

  // Paso 3: Verificar código
  const handleVerificarCodigo = () => {
    if (codigoExpirado) {
      setError('Código expirado. Solicitá uno nuevo.');
      return;
    }

    if (Number(codigoIngresado) === codigoEnviado) {
      setPaso(4);
      setError(null);
    } else {
      const nuevos = intentos + 1;
      setIntentos(nuevos);
      if (nuevos >= 3) {
        setError('Máximo de intentos alcanzado. Solicitá un nuevo código.');
      } else {
        setError('Código incorrecto.');
      }
    }
  };

  // Paso 4: Registro final
  const handleRegistroFinal = async () => {
    if (!validarContraseña(contraseña)) {
      setError('Contraseña débil. Debe tener mínimo 8 caracteres, una mayúscula, una minúscula y un número.');
      return;
    }

    let redesSocialesParsed = null;
    if (datosAdicionales.redes_sociales.trim() !== '') {
      try {
        redesSocialesParsed = JSON.parse(datosAdicionales.redes_sociales);
      } catch {
        setError('Error interno: redes sociales no es un JSON válido.');
        return;
      }
    }

    try {
      await registrarEmpresa({
        cuit,
        razon_social: razonSocial,
        email,
        contraseña,
        datosAdicionales: {
          rubro: datosAdicionales.rubro,
          domicilio_legal: datosAdicionales.domicilio_legal,
          telefono: datosAdicionales.telefono,
          referente: datosAdicionales.referente,
          cargo_referente: datosAdicionales.cargo_referente,
          web: datosAdicionales.web,
          redes_sociales: redesSocialesParsed
        }
      });

      navigate('/login');
    } catch (err) {
      const mensajeError = err.response?.data?.error || 'Error al registrar la empresa.';
      setError(mensajeError);
    }
  };

  return (
    <div className="pagina-con-footer">
      <Header />
      <main className="formularioemp">
        <h1 className="titulo1emp">Registro de Empresa</h1>

        {paso === 1 && (
          <>
            <label htmlFor="cuit">CUIT</label>
            <input
              id="cuit"
              name="cuit"
              type="text"
              value={cuit}
              onChange={e => setCuit(e.target.value)}
            />

            <label htmlFor="razonSocial">Razón social</label>
            <input
              id="razonSocial"
              name="razonSocial"
              type="text"
              value={razonSocial}
              onChange={e => setRazonSocial(e.target.value)}
            />

            <button onClick={handleVerificarCuit}>Siguiente</button>
          </>
        )}

        {paso === 2 && (
          <>
            <label htmlFor="email">Email</label>
            <input
              id="email"
              name="email"
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
            />

            <label htmlFor="rubro">Rubro</label>
            <input
              id="rubro"
              name="rubro"
              type="text"
              value={datosAdicionales.rubro}
              onChange={e => setDatosAdicionales({ ...datosAdicionales, rubro: e.target.value })}
            />

            <label htmlFor="domicilioLegal">Domicilio legal</label>
            <input
              id="domicilioLegal"
              name="domicilioLegal"
              type="text"
              value={datosAdicionales.domicilio_legal}
              onChange={e => setDatosAdicionales({ ...datosAdicionales, domicilio_legal: e.target.value })}
              placeholder="Ciudad, calle y número"
            />

            <label htmlFor="telefono">Teléfono</label>
            <input
              id="telefono"
              name="telefono"
              type="tel"
              value={datosAdicionales.telefono}
              onChange={e => setDatosAdicionales({ ...datosAdicionales, telefono: e.target.value })}
            />

            <label htmlFor="referente">Nombre del referente</label>
            <input
              id="referente"
              name="referente"
              type="text"
              value={datosAdicionales.referente}
              onChange={e => setDatosAdicionales({ ...datosAdicionales, referente: e.target.value })}
            />

            <label htmlFor="cargoReferente">Cargo del referente</label>
            <input
              id="cargoReferente"
              name="cargoReferente"
              type="text"
              value={datosAdicionales.cargo_referente}
              onChange={e => setDatosAdicionales({ ...datosAdicionales, cargo_referente: e.target.value })}
            />

            <label htmlFor="web">Sitio web (opcional)</label>
            <input
              id="web"
              name="web"
              type="url"
              value={datosAdicionales.web}
              onChange={e => setDatosAdicionales({ ...datosAdicionales, web: e.target.value })}
              placeholder="https://www.ejemplo.com"
            />

            <label htmlFor="redesSociales">Redes sociales (opcional)</label>
            <input
              id="redesSociales"
              name="redesSociales"
              type="text"
              value={datosAdicionales.redes_sociales}
              onChange={e => setDatosAdicionales({ ...datosAdicionales, redes_sociales: e.target.value })}
              placeholder='Ej: {"facebook":"https://fb.com/empresa", "instagram":"https://instagram.com/empresa"}'
            />

            <button onClick={handleEnviarCodigo}>Solicitar código</button>
          </>
        )}

        {paso === 3 && (
          <>
            <label htmlFor="codigo">Código recibido</label>
            <input
              id="codigo"
              name="codigo"
              type="text"
              value={codigoIngresado}
              onChange={e => setCodigoIngresado(e.target.value)}
            />
            <button onClick={handleVerificarCodigo}>Verificar código</button>
            <button onClick={handleEnviarCodigo}>Reenviar código</button>
          </>
        )}

        {paso === 4 && (
          <>
            <label htmlFor="contraseña">Crear contraseña</label>
            <input
              id="contraseña"
              name="contraseña"
              type="password"
              value={contraseña}
              onChange={e => setContraseña(e.target.value)}
            />
            <button onClick={handleRegistroFinal}>Finalizar registro</button>
          </>
        )}
        {error && <p style={{ color: 'red' }}>{error}</p>}
      </main>
      <Footer />
    </div>
  );
};

export default RegistroEmpresa;
