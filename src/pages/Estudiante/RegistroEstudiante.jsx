import { useState } from 'react';
import opciones from '../../data/listasOpciones.json';
import { verificarIdentidad, registrarEstudiante, enviarCodigo } from '../../api/api';

const RegistroEstudiante = () => {
  const [paso, setPaso] = useState(1);
  const [legajo, setLegajo] = useState('');
  const [dni, setDni] = useState('');
  const [datosSysacad, setDatosSysacad] = useState(null);
  const [email, setEmail] = useState('');
  const [codigoEnviado, setCodigoEnviado] = useState(null);
  const [codigoIngresado, setCodigoIngresado] = useState('');
  const [intentos, setIntentos] = useState(0);
  const [codigoExpirado, setCodigoExpirado] = useState(false);
  const [habilidadesSeleccionadas, setHabilidadesSeleccionadas] = useState({
    habilidades_tecnicas: {},
    habilidades_blandas: {},
    idiomas: {},
  });
  const [datosAdicionales, setDatosAdicionales] = useState({
    disponibilidad_horaria: '',
    experiencia_previa: ''
  });
  const [contraseña, setContraseña] = useState('');

  const handleVerificarIdentidad = async () => {
    try {
      const data = await verificarIdentidad({ legajo, dni });
      setDatosSysacad(data);
      setEmail(data.email);
      setPaso(2);
    } catch (error) {
      alert(error.error || 'Error al verificar identidad');
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
      alert('Código enviado correctamente a tu correo.');
      setTimeout(() => setCodigoExpirado(true), 5 * 60 * 1000);
    } catch (err) {
      alert('Error al enviar el correo. Verificá el email.');
    }
  };

  const handleVerificarCodigo = () => {
    if (codigoExpirado) {
      alert('El código ha expirado. Pedí uno nuevo.');
      return;
    }

    if (Number(codigoIngresado) === codigoEnviado) {
      setPaso(4);
    } else {
      const nuevosIntentos = intentos + 1;
      setIntentos(nuevosIntentos);
      alert(nuevosIntentos >= 3 ? 'Máximo de intentos alcanzado. Reenviá el código.' : 'Código incorrecto. Intentá de nuevo.');
    }
  };

  const handleRegistroFinal = async () => {
    const emailValido = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    if (!emailValido) return alert('El email no es válido');

    const contraseñaValida = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/.test(contraseña);
    if (!contraseñaValida) return alert('La contraseña debe tener al menos 8 caracteres, incluyendo mayúsculas, minúsculas y números.');

    const transformar = (obj) => Object.entries(obj).map(([nombre, nivel]) => ({ nombre, nivel }));

    try {
      const payload = {
        legajo,
        dni,
        email,
        contraseña,
        disponibilidad_horaria: datosAdicionales.disponibilidad_horaria,
        experiencia_previa: datosAdicionales.experiencia_previa,
        habilidades_tecnicas: transformar(habilidadesSeleccionadas.habilidades_tecnicas),
        habilidades_blandas: transformar(habilidadesSeleccionadas.habilidades_blandas),
        idiomas: transformar(habilidadesSeleccionadas.idiomas),
      };

      await registrarEstudiante(payload);
      alert('Registro exitoso. Ahora podés iniciar sesión.');
    } catch (err) {
      alert('Error al registrar: ' + (err.error || 'Desconocido'));
    }
  };

  const toggleHabilidad = (categoria, habilidad) => {
    setHabilidadesSeleccionadas(prev => {
      const actualizado = { ...prev[categoria] };
      if (actualizado[habilidad]) delete actualizado[habilidad];
      else actualizado[habilidad] = 'Básico';
      return { ...prev, [categoria]: actualizado };
    });
  };

  const cambiarNivel = (categoria, habilidad, nivel) => {
    setHabilidadesSeleccionadas(prev => {
      const actualizado = { ...prev[categoria] };
      actualizado[habilidad] = nivel;
      return { ...prev, [categoria]: actualizado };
    });
  };

  return (
    <div className="formulario">
      <h1 className="titulo1">Registro de Estudiante</h1>

      {paso === 1 && (
        <div className="formulario">
          <input className="input-texto" placeholder="Legajo" value={legajo} onChange={e => setLegajo(e.target.value)} />
          <input className="input-texto" placeholder="DNI" value={dni} onChange={e => setDni(e.target.value)} />
          <button className="boton" onClick={handleVerificarIdentidad}>Verificar identidad</button>
        </div>
      )}

      {paso === 2 && datosSysacad && (
        <div className="formulario">
          <p className="parrafo"><strong>Nombre:</strong> {datosSysacad.nombre} {datosSysacad.apellido}</p>
          <p className="parrafo"><strong>Carrera:</strong> {datosSysacad.carrera}</p>
          <p className="parrafo"><strong>Promedio:</strong> {datosSysacad.promedio}</p>
          <p className="parrafo"><strong>Año de cursado:</strong> {datosSysacad.año_cursado}</p>
          <p className="parrafo"><strong>Materias aprobadas:</strong> {datosSysacad.materias_aprobadas}</p>
          <p className="parrafo"><strong>Materias regularizadas:</strong> {datosSysacad.materias_regularizadas}</p>
          <input className="input-texto" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />
          <button className="boton" onClick={handleEnviarCodigo}>Solicitar código</button>
        </div>
      )}

      {paso === 3 && (
        <div className="formulario">
          <input className="input-texto" placeholder="Código recibido" value={codigoIngresado} onChange={e => setCodigoIngresado(e.target.value)} />
          <button className="boton" onClick={handleVerificarCodigo}>Verificar código</button>
          <button className="boton" onClick={handleEnviarCodigo}>Reenviar código</button>
        </div>
      )}

      {paso === 4 && (
        <div className="formulario">
          <input
            className="input-texto"
            placeholder="Disponibilidad horaria"
            value={datosAdicionales.disponibilidad_horaria}
            onChange={e => setDatosAdicionales({ ...datosAdicionales, disponibilidad_horaria: e.target.value })}
          />

          {["habilidades_tecnicas", "habilidades_blandas", "idiomas"].map(categoria => (
            <fieldset key={categoria} className="fieldset-form">
              <legend className="noidea">{categoria.replace('_', ' ')}</legend>
              {opciones[categoria].map(hab => (
                <div key={hab} className="item-habilidad">
                  <input
                    type="checkbox"
                    checked={!!habilidadesSeleccionadas[categoria][hab]}
                    onChange={() => toggleHabilidad(categoria, hab)}
                  />
                  <label>{hab}</label>
                  {habilidadesSeleccionadas[categoria][hab] && (
                    <select
                      value={habilidadesSeleccionadas[categoria][hab]}
                      onChange={(e) => cambiarNivel(categoria, hab, e.target.value)}
                      className="select-nivel"
                    >
                      {["Básico", "Intermedio", "Avanzado"].map(nivel => (
                        <option key={nivel} value={nivel}>{nivel}</option>
                      ))}
                    </select>
                  )}
                </div>
              ))}
            </fieldset>
          ))}

          <input
            className="input-texto"
            placeholder="Experiencia previa"
            value={datosAdicionales.experiencia_previa}
            onChange={e => setDatosAdicionales({ ...datosAdicionales, experiencia_previa: e.target.value })}
          />
          <button className="boton" onClick={() => setPaso(5)}>Siguiente</button>
        </div>
      )}

      {paso === 5 && (
        <div className="formulario">
          <input
            className="input-texto"
            type="password"
            placeholder="Crear contraseña"
            value={contraseña}
            onChange={e => setContraseña(e.target.value)}
          />
          <button className="boton" onClick={handleRegistroFinal}>Finalizar registro</button>
        </div>
      )}
    </div>
  );
};

export default RegistroEstudiante;
