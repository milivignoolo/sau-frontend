import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { verificarIdentidad, registrarEstudiante, enviarCodigo } from '../../api/api';
import opciones from '../../data/listasOpciones.json'; // Este archivo debe contener habilidades, idiomas, etc.
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';
import './RegistroEstudiante.css';

const validarEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
const validarDni = (dni) => /^\d{7,8}$/.test(dni);
const validarLegajo = (legajo) => /^\d{3,}$/.test(legajo);

const RegistroEstudiante = () => {
  const navigate = useNavigate();

  const [paso, setPaso] = useState(1);
  const [dni, setDni] = useState('');
  const [legajo, setLegajo] = useState('');
  const [email, setEmail] = useState('');
  const [emailOriginal, setEmailOriginal] = useState('');
  const [codigoEnviado, setCodigoEnviado] = useState(null);
  const [codigoIngresado, setCodigoIngresado] = useState('');
  const [intentos, setIntentos] = useState(0);
  const [codigoExpirado, setCodigoExpirado] = useState(false);
  const [password, setPassword] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [datosSysacad, setDatosSysacad] = useState(null);

  const timeoutRef = useRef(null);

  // Nuevos estados para habilidades, idiomas, disponibilidad y experiencia
  const [habilidadesSeleccionadas, setHabilidadesSeleccionadas] = useState({
    habilidades_tecnicas: {},
    habilidades_blandas: {},
    idiomas: {},
  });

  const [disponibilidadHoraria, setDisponibilidadHoraria] = useState('');
  const [experienciaPrevia, setExperienciaPrevia] = useState('');

  // Función auxiliar para transformar objetos en arrays [{nombre, nivel}]
  const transformar = (obj) =>
    Object.entries(obj).map(([nombre, nivel]) => ({ nombre, nivel }));

  // Paso 1: Verificar DNI y legajo
  const handleVerificarIdentidad = async (e) => {
    e.preventDefault();
    setMensaje('');
    if (!validarDni(dni)) {
      setMensaje('DNI inválido. Debe tener 7 u 8 dígitos numéricos.');
      return;
    }
    if (!validarLegajo(legajo)) {
      setMensaje('Legajo inválido. Debe contener solo números y tener al menos 3 dígitos.');
      return;
    }

    try {
      const data = await verificarIdentidad({ dni, legajo });
      setDatosSysacad(data);
      setEmail(data.email || '');
      setEmailOriginal(data.email || '');
      setPaso(2);
      setMensaje('');
    } catch (error) {
      setMensaje(error?.error || 'Error al verificar identidad');
    }
  };

  // Paso 2: Enviar código al email (editable)
  const handleEnviarCodigo = async () => {
    setMensaje('');
    if (!validarEmail(email)) {
      setMensaje('Ingrese un email válido.');
      return;
    }

    const codigo = Math.floor(100000 + Math.random() * 900000);
    setCodigoEnviado(codigo);
    setCodigoExpirado(false);
    setIntentos(0);
    setCodigoIngresado('');

    try {
      await enviarCodigo({ email, codigo });
      setPaso(3);
      setMensaje('Código enviado. Revisa tu email.');

      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => {
        setCodigoExpirado(true);
        setMensaje('El código ha expirado, solicita uno nuevo.');
      }, 5 * 60 * 1000);
    } catch (error) {
      setMensaje(error?.error || 'Error al enviar código');
    }
  };

  // Paso 3: Verificar código
  const handleVerificarCodigo = (e) => {
    e.preventDefault();
    setMensaje('');

    if (codigoExpirado) {
      setMensaje('Código expirado. Solicita uno nuevo.');
      return;
    }
    if (codigoIngresado.trim() === '') {
      setMensaje('Por favor ingrese el código recibido.');
      return;
    }

    if (Number(codigoIngresado) === codigoEnviado) {
      setPaso(4);
      setMensaje('');
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    } else {
      const nuevosIntentos = intentos + 1;
      setIntentos(nuevosIntentos);
      if (nuevosIntentos >= 3) {
        setMensaje('Máximo de intentos alcanzado. Solicita un nuevo código.');
      } else {
        setMensaje('Código incorrecto. Intenta nuevamente.');
      }
    }
  };

  // Paso 4: Ingresar habilidades, idiomas, disponibilidad y experiencia
  const toggleHabilidad = (categoria, habilidad) => {
    setHabilidadesSeleccionadas((prev) => {
      const actualizado = { ...prev[categoria] };
      if (actualizado[habilidad]) delete actualizado[habilidad];
      else actualizado[habilidad] = 'Básico';
      return { ...prev, [categoria]: actualizado };
    });
  };

  const cambiarNivel = (categoria, habilidad, nivel) => {
    setHabilidadesSeleccionadas((prev) => {
      const actualizado = { ...prev[categoria] };
      actualizado[habilidad] = nivel;
      return { ...prev, [categoria]: actualizado };
    });
  };

  const handlePaso4Submit = (e) => {
    e.preventDefault();

    // Validar disponibilidad horaria y experiencia (opcional podrías agregar validaciones)
    if (!disponibilidadHoraria.trim()) {
      setMensaje('Debe ingresar su disponibilidad horaria.');
      return;
    }

    // Continúa al paso de creación de contraseña
    setMensaje('');
    setPaso(5);
  };

  // Paso 5: Registrar con contraseña y todos los datos
  const handleRegistrar = async (e) => {
    e.preventDefault();
    setMensaje('');

    if (password.length < 6) {
      setMensaje('La contraseña debe tener al menos 6 caracteres.');
      return;
    }

    try {
      await registrarEstudiante({
        dni,
        legajo,
        email,
        contraseña: password,
        nombre: datosSysacad.nombre,
        apellido: datosSysacad.apellido,
        carrera: datosSysacad.carrera,
        año_cursado: datosSysacad.año_cursado,
        promedio: datosSysacad.promedio,
        habilidades_tecnicas: transformar(habilidadesSeleccionadas.habilidades_tecnicas),
        habilidades_blandas: transformar(habilidadesSeleccionadas.habilidades_blandas),
        idiomas: transformar(habilidadesSeleccionadas.idiomas),
        disponibilidad_horaria: disponibilidadHoraria,
        experiencia_previa: experienciaPrevia,
      });

      setMensaje('Estudiante registrado con éxito.');
      // Redirigir a login luego del registro exitoso
      navigate('/login');
    } catch (error) {
      setMensaje(error?.error || 'Error al registrar estudiante.');
    }
  };

  return (
    <div className="pagina-con-footer">
      <Header />
      <main className="formularioest">
        {paso === 1 && (
          <form onSubmit={handleVerificarIdentidad} noValidate>
            <h2>Verificación de identidad</h2>
            <input
              type="text"
              value={dni}
              onChange={(e) => setDni(e.target.value)}
              placeholder="DNI"
              required
              maxLength={8}
            />
            <input
              type="text"
              value={legajo}
              onChange={(e) => setLegajo(e.target.value)}
              placeholder="Legajo"
              required
            />
            <button type="submit">Verificar</button>
          </form>
        )}

        {paso === 2 && datosSysacad && (
          <>
            <h2>Confirme sus datos</h2>

            <label>
              Nombre:
              <input type="text" value={datosSysacad.nombre} readOnly />
            </label>

            <label>
              Apellido:
              <input type="text" value={datosSysacad.apellido} readOnly />
            </label>

            <label>
              Carrera:
              <input type="text" value={datosSysacad.carrera} readOnly />
            </label>

            <label>
              Año cursado:
              <input type="text" value={datosSysacad.año_cursado} readOnly />
            </label>

            <label>
              Promedio:
              <input type="text" value={datosSysacad.promedio} readOnly />
            </label>

            <label>
              Email original:
              <input type="email" value={emailOriginal} readOnly />
            </label>

            <label>
              Email (puede modificar):
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
                required
              />
            </label>

            <button onClick={handleEnviarCodigo}>Enviar Código</button>
          </>
        )}

        {paso === 3 && (
          <form onSubmit={handleVerificarCodigo} noValidate>
            <h2>Verificación del código</h2>

            <label>
              Código recibido:
              <input
                type="text"
                value={codigoIngresado}
                onChange={(e) => setCodigoIngresado(e.target.value)}
                maxLength={6}
                required
              />
            </label>

            <button type="submit" disabled={intentos >= 3 || codigoExpirado}>
              Verificar código
            </button>
            <button type="button" onClick={handleEnviarCodigo}>
              Reenviar código
            </button>
          </form>
        )}

        {paso === 4 && (
          <form onSubmit={handlePaso4Submit} noValidate>
            <h2>Datos adicionales</h2>

            {/* Sección de habilidades */}
            {['habilidades_tecnicas', 'habilidades_blandas', 'idiomas'].map((categoria) => (
              <fieldset key={categoria} className="fieldset-form">
                <legend style={{ fontWeight: '600', marginBottom: '1rem', fontSize: '1.1rem' }}>
                  {categoria.replace('_', ' ').replace(/^\w/, (c) => c.toUpperCase())}
                </legend>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {opciones[categoria]?.map((hab) => (
                    <div key={hab} className="item-habilidad">
                      <input
                        id={`${categoria}-${hab}`}
                        type="checkbox"
                        checked={!!habilidadesSeleccionadas[categoria][hab]}
                        onChange={() => toggleHabilidad(categoria, hab)}
                      />
                      <label htmlFor={`${categoria}-${hab}`}>{hab}</label>
                      {habilidadesSeleccionadas[categoria][hab] && (
                        <select
                          value={habilidadesSeleccionadas[categoria][hab]}
                          onChange={(e) => cambiarNivel(categoria, hab, e.target.value)}
                          className="select-nivel"
                        >
                          {['Básico', 'Intermedio', 'Avanzado'].map((nivel) => (
                            <option key={nivel} value={nivel}>
                              {nivel}
                            </option>
                          ))}
                        </select>
                      )}
                    </div>
                  ))}
                </div>
              </fieldset>
            ))}

            <label htmlFor="disponibilidadHoraria">Disponibilidad horaria *</label>
            <input
              id="disponibilidadHoraria"
              name="disponibilidadHoraria"
              value={disponibilidadHoraria}
              onChange={(e) => setDisponibilidadHoraria(e.target.value)}
              placeholder="Ej: Lunes a viernes de 9 a 18"
              required
            />

            <label htmlFor="experienciaPrevia">Experiencia previa</label>
            <textarea
              id="experienciaPrevia"
              name="experienciaPrevia"
              value={experienciaPrevia}
              onChange={(e) => setExperienciaPrevia(e.target.value)}
              placeholder="Describa su experiencia previa"
            />

            <button type="submit">Siguiente</button>
          </form>
        )}

        {paso === 5 && (
          <form onSubmit={handleRegistrar} noValidate>
            <h2>Crear contraseña</h2>

            <label>
              Contraseña:
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Contraseña"
                required
                minLength={6}
              />
            </label>

            <button type="submit">Finalizar registro</button>
          </form>
        )}

        {mensaje && <p className="mensaje-feedback">{mensaje}</p>}
      </main>
      <Footer />
    </div>
  );
};

export default RegistroEstudiante;
