import { useState } from 'react';
import { registrarPasantia } from '../../api/api';
import opciones from '../../data/listasOpciones.json';
import UserHeader from '../../components/Header/UserHeader';
import Footer from '../../components/Footer/Footer';
import './RegistrarPasantia.css';


const RegistrarPasantia = ({ empresaId }) => {
  const [formulario, setFormulario] = useState({
    titulo: '',
    descripcion: '',
    area: '',
    vacantes: '',
    fecha_inicio: '',
    fecha_fin: '',
    modalidad: '',
    remuneracion: '',
    ubicacion: '',
    duracion: '',
    horas_semanales: '',
    horario_estimado: '',
    tareas: '',
    carrera: '',
    año_cursado_min: '',
    urgencia: 1,
  });

  const [errores, setErrores] = useState({});
  const [habilidadesSeleccionadas, setHabilidadesSeleccionadas] = useState({
    habilidades_tecnicas: {},
    habilidades_blandas: {},
    idiomas: {},
  });

  const transformar = (obj) =>
    Object.entries(obj).map(([nombre, nivel]) => ({ nombre, nivel }));

  const validar = () => {
    const errs = {};

    // Campos obligatorios
    if (!formulario.titulo.trim()) errs.titulo = 'El título es obligatorio';
    if (!formulario.descripcion.trim()) errs.descripcion = 'La descripción es obligatoria';
    if (!formulario.area.trim()) errs.area = 'El área es obligatoria';

    // Vacantes: número entero positivo
    if (!formulario.vacantes || isNaN(formulario.vacantes) || Number(formulario.vacantes) < 1) {
      errs.vacantes = 'Vacantes debe ser un número entero positivo';
    }

    // Fechas obligatorias y lógicas
    if (!formulario.fecha_inicio) errs.fecha_inicio = 'Fecha de inicio obligatoria';
    if (!formulario.fecha_fin) errs.fecha_fin = 'Fecha de fin obligatoria';

    if (formulario.fecha_inicio && formulario.fecha_fin) {
      const inicio = new Date(formulario.fecha_inicio);
      const fin = new Date(formulario.fecha_fin);
      if (inicio > fin) errs.fecha_fin = 'La fecha fin debe ser posterior a la fecha inicio';
    }

    // Carrera: selección obligatoria
    if (!formulario.carrera) errs.carrera = 'Debe seleccionar una carrera';

    // Año cursado mínimo: rango válido
    if (
      !formulario.año_cursado_min ||
      isNaN(formulario.año_cursado_min) ||
      Number(formulario.año_cursado_min) < 1 ||
      Number(formulario.año_cursado_min) > 10
    ) {
      errs.año_cursado_min = 'Ingrese un año de cursado mínimo válido (1-10)';
    }

    // Horas semanales, si hay, debe ser positivo
    if (formulario.horas_semanales) {
      if (isNaN(formulario.horas_semanales) || Number(formulario.horas_semanales) < 0) {
        errs.horas_semanales = 'Horas semanales debe ser un número positivo';
      }
    }

    // Urgencia entre 1 y 3
    if (
      !formulario.urgencia ||
      isNaN(formulario.urgencia) ||
      Number(formulario.urgencia) < 1 ||
      Number(formulario.urgencia) > 3
    ) {
      errs.urgencia = 'Urgencia debe estar entre 1 y 3';
    }

    setErrores(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validar()) return;

    try {
      const payload = {
        ...formulario,
        vacantes: Number(formulario.vacantes),
        horas_semanales: formulario.horas_semanales ? Number(formulario.horas_semanales) : null,
        año_cursado_min: Number(formulario.año_cursado_min),
        urgencia: Number(formulario.urgencia),
        empresaId,
        habilidades_tecnicas: transformar(habilidadesSeleccionadas.habilidades_tecnicas),
        habilidades_blandas: transformar(habilidadesSeleccionadas.habilidades_blandas),
        idiomas: transformar(habilidadesSeleccionadas.idiomas),
      };

      await registrarPasantia(payload);
      alert('Pasantía registrada exitosamente');
      setFormulario({
        titulo: '',
        descripcion: '',
        area: '',
        vacantes: '',
        fecha_inicio: '',
        fecha_fin: '',
        modalidad: '',
        remuneracion: '',
        ubicacion: '',
        duracion: '',
        horas_semanales: '',
        horario_estimado: '',
        tareas: '',
        carrera: '',
        año_cursado_min: '',
        urgencia: 1,
      });
      setHabilidadesSeleccionadas({
        habilidades_tecnicas: {},
        habilidades_blandas: {},
        idiomas: {},
      });
      setErrores({});
    } catch (error) {
      alert(error.error || 'Error al registrar pasantía');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormulario((prev) => ({ ...prev, [name]: value }));
  };

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

  return (
    <div className="layout-container">
      <UserHeader />

      <main className="main-content">
      <form onSubmit={handleSubmit} className="formulario" noValidate>
  <h2 className="titulo-pasantia">Registrar Pasantía</h2>

  {/* Sección de campos básicos */}
  <label htmlFor="titulo">Título del puesto *</label>
  <input id="titulo" name="titulo" value={formulario.titulo} onChange={handleChange} required />
  {errores.titulo && <p className="error">{errores.titulo}</p>}

  <label htmlFor="descripcion">Descripción *</label>
  <textarea id="descripcion" name="descripcion" value={formulario.descripcion} onChange={handleChange} required />
  {errores.descripcion && <p className="error">{errores.descripcion}</p>}

  <label htmlFor="area">Área *</label>
  <input id="area" name="area" value={formulario.area} onChange={handleChange} required />
  {errores.area && <p className="error">{errores.area}</p>}

  <label htmlFor="vacantes">Vacantes *</label>
  <input id="vacantes" name="vacantes" type="number" min="1" value={formulario.vacantes} onChange={handleChange} required />
  {errores.vacantes && <p className="error">{errores.vacantes}</p>}

  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
    <div>
      <label htmlFor="fecha_inicio">Fecha inicio *</label>
      <input id="fecha_inicio" name="fecha_inicio" type="date" value={formulario.fecha_inicio} onChange={handleChange} required />
      {errores.fecha_inicio && <p className="error">{errores.fecha_inicio}</p>}
    </div>

    <div>
      <label htmlFor="fecha_fin">Fecha fin *</label>
      <input id="fecha_fin" name="fecha_fin" type="date" value={formulario.fecha_fin} onChange={handleChange} required />
      {errores.fecha_fin && <p className="error">{errores.fecha_fin}</p>}
    </div>
  </div>

  <label htmlFor="modalidad">Modalidad</label>
  <input id="modalidad" name="modalidad" value={formulario.modalidad} onChange={handleChange} />

  <label htmlFor="remuneracion">Remuneración</label>
  <input id="remuneracion" name="remuneracion" value={formulario.remuneracion} onChange={handleChange} />

  <label htmlFor="ubicacion">Ubicación</label>
  <input id="ubicacion" name="ubicacion" value={formulario.ubicacion} onChange={handleChange} />

  <label htmlFor="duracion">Duración</label>
  <input id="duracion" name="duracion" value={formulario.duracion} onChange={handleChange} />

  <label htmlFor="horas_semanales">Horas semanales</label>
  <input id="horas_semanales" name="horas_semanales" type="number" min="0" value={formulario.horas_semanales} onChange={handleChange} />
  {errores.horas_semanales && <p className="error">{errores.horas_semanales}</p>}

  <label htmlFor="horario_estimado">Horario estimado</label>
  <input id="horario_estimado" name="horario_estimado" value={formulario.horario_estimado} onChange={handleChange} />

  <label htmlFor="tareas">Tareas</label>
  <textarea id="tareas" name="tareas" value={formulario.tareas} onChange={handleChange} />

  <label htmlFor="carrera">Carrera *</label>
  <select id="carrera" name="carrera" value={formulario.carrera} onChange={handleChange} required>
    <option value="">Seleccione carrera</option>
    {opciones.carreras.map((carrera) => (
      <option key={carrera} value={carrera}>{carrera}</option>
    ))}
  </select>
  {errores.carrera && <p className="error">{errores.carrera}</p>}

  <label htmlFor="año_cursado_min">Año de cursado mínimo *</label>
  <input id="año_cursado_min" name="año_cursado_min" type="number" min="1" max="10" value={formulario.año_cursado_min} onChange={handleChange} required />
  {errores.año_cursado_min && <p className="error">{errores.año_cursado_min}</p>}

  {/* Sección de habilidades en columnas */}
  {['habilidades_tecnicas', 'habilidades_blandas', 'idiomas'].map((categoria) => (
    <fieldset key={categoria} className="fieldset-form">
      <legend style={{ fontWeight: '600', marginBottom: '1rem', fontSize: '1.1rem' }}>
        {categoria.replace('_', ' ').replace(/^\w/, c => c.toUpperCase())}
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
                  <option key={nivel} value={nivel}>{nivel}</option>
                ))}
              </select>
            )}
          </div>
        ))}
      </div>
    </fieldset>
  ))}

  <label htmlFor="urgencia">Urgencia *</label>
  <select id="urgencia" name="urgencia" value={formulario.urgencia} onChange={handleChange} required>
    <option value={1}>1 - Baja</option>
    <option value={2}>2 - Media</option>
    <option value={3}>3 - Alta</option>
  </select>
  {errores.urgencia && <p className="error">{errores.urgencia}</p>}

  <button type="submit" className="boton">Registrar Pasantía</button>
</form>

    </main>

      <Footer />
    </div>
  );
};

export default RegistrarPasantia;
