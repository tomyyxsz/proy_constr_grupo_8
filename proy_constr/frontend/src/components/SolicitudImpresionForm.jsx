/* eslint-disable max-lines-per-function */
import { useState, useEffect } from 'react'
import { crearSolicitudImpresion, obtenerCursosEstudiante, obtenerCursosProfesor } from '../api/ApiSolicitudImpresion'
import './SolicitudImpresionForm.css'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient('https://kywbczhepfqbgtlpxemr.supabase.co', 'sb_publishable_oVCW7zdncy0aEPbw_ed9FQ_uo-FS4to');

// Componente para el formulario de solicitud de impresión, utilizado en el dashboard del estudiante
function SolicitudImpresionForm({ user, isOpen, onClose, onSuccess }) {
  const [cursosInscritos, setCursosInscritos] = useState([])
  const esProfesor = user?.role === 'PROFESOR'
  const esSolicitante = user?.role === 'SOLICITANTE'

  useEffect(() => {
    async function fetchCursos() {
      try {
        let cursos=[];
        if (esProfesor) {
          cursos = await obtenerCursosProfesor(user.id);
      
        } else {
          cursos = await obtenerCursosEstudiante(user.id);
        }
        setCursosInscritos(cursos.cursos);
      } catch (err) {
        console.error("Error al obtener cursos del estudiante:", err);
        setCursosInscritos([]);
      }
    }
    if (isOpen) {
      fetchCursos();
    }
  }, [isOpen, user.id, esProfesor]);

  const [formData, setFormData] = useState({
    color1: '#000000', color2: '#ffffff', color3: '#ff0000', tipoSolicitud: 'PERSONAL',comentario: '',urlModelo3d: '',urlModeloStl: '',refCurso: '',
  })
  const [archivoStl, setArchivoStl] = useState(null)
  const [archivoModelo3D, setArchivoModelo3d] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [exito, setExito] = useState(null)
  //maneja cambios en el formularo 
  const handleChange = (e) => {
    const { name, value } = e.target
    if (name === 'tipoSolicitud' && value === 'PERSONAL') {
      setFormData(prev => ({ ...prev, tipoSolicitud: value, refCurso: '' }))
    } else {
      setFormData(prev => ({ ...prev, [name]: value }))
    }
  }
  //validamos que los campos esten completos y tengan un formato correcto 
  const validar = () => {
    if (!archivoModelo3D) {
      return 'Debes adjuntar el archivo modelo 3D'
    }
    if (!archivoStl) {
      return 'Debes adjuntar el archivo STL'
    }
    if (formData.tipoSolicitud === 'ACADEMICA' && !formData.refCurso.trim()) {
      return 'Para una solicitud académica debes ingresar el código del curso.'
    }
    return null
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    setExito(null)

    const errorValidacion = validar()
    if (errorValidacion) {
      setError(errorValidacion)
      return
    }

    setLoading(true)
    try {
      // configurar el url del archivo stl para la BD
      const nombreLimpioArchivo = archivoStl.name.replace(/[^a-zA-Z0-9.]/g, '_')
      
      const rutaArchivo = `estudiantes/${user.email}/${Date.now()}_${nombreLimpioArchivo}` // la ruta del archivo se deberia crear en la carpeta estudiantes/[rut del estudiante]/nombrearchivo
      const { error: storageError } = await supabase.storage
        .from("archivos-subidos")
        .upload(rutaArchivo, archivoStl);
      if (storageError) throw new Error ('Error al subir el archivo STL' + storageError.message);

      const { data: urlData } = supabase.storage
        .from('archivos-subidos')
        .getPublicUrl(rutaArchivo)

      const urlPublicaStl = urlData.publicUrl

      // configurar el url del archivo modelo3D para la BD
      const nombreLimpioArchivo3D = archivoModelo3D.name.replace(/[^a-zA-Z0-9.]/g, '_')
      const rutaArchivo2 = `estudiantes/${user.email}/${Date.now()}_${nombreLimpioArchivo3D}`

      const { error: storageError3D } = await supabase.storage
        .from("archivos-subidos")
        .upload(rutaArchivo2, archivoModelo3D);
      if (storageError3D)
        throw new Error("Error al subir el archivo 3D" + storageError3D.message);

      const { data: urlData3D } = supabase.storage
        .from("archivos-subidos")
        .getPublicUrl(rutaArchivo2);

      const urlPublica3D = urlData3D.publicUrl

      const data = await crearSolicitudImpresion({
        idUsuario: user.id, color1: formData.color1, color2: formData.color2, color3: formData.color3,
        tipoSolicitud: formData.tipoSolicitud,
        comentario: formData.comentario || undefined,
        urlModelo3d: urlPublica3D, urlModeloStl: urlPublicaStl,
        refCurso: formData.tipoSolicitud === 'ACADEMICA' ? formData.refCurso : undefined,
      })
      
      setExito(data.impresion?.idImpresion || 'creada')
      onSuccess?.()

      setTimeout(() => {
        setExito(null)
        onClose()
      }, 2000)

    } catch (err) {
      console.error('Error al crear solicitud:', err.message)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={`slide-panel ${isOpen ? "open" : ""}`}>
      <div className="slide-panel__inner">
        <div className="slide-panel__header">
          <h3>Nueva solicitud de impresión</h3>
          <button
            className="slide-panel__close"
            onClick={onClose}
            aria-label="Cerrar panel"
          >
            ×
          </button>
        </div>

        {exito ? (
          <div className="slide-panel__success">
            <span className="slide-panel__success-icon">✓</span>
            <p>¡Solicitud enviada correctamente!</p>
            <code>{exito}</code>
          </div>
        ) : (
          <>
            {/* Se asigna id="solicitud-form" para vincularlo al botón del footer */}
            <form
              id="solicitud-form"
              onSubmit={handleSubmit}
              className="slide-panel__body"
            >
              {error && <div className="slide-panel__error">{error}</div>}

              <div className="form-group">
                <label htmlFor="tipo">Tipo de solicitud</label>
                <select
                  id="tipo"
                  name="tipoSolicitud"
                  value={formData.tipoSolicitud}
                  onChange={handleChange}
                >
                  {!esSolicitante && <option value="ACADEMICA">Académica</option>}
                  <option value="PERSONAL">Personal</option>
                </select>
              </div>

              {formData.tipoSolicitud === "ACADEMICA" && !esSolicitante(
                <div className="form-group">
                  <label htmlFor="refCurso">
                    Curso <span className="slide-panel__required">*</span>
                  </label>

                  <select
                    id="refCurso"
                    name="refCurso"
                    value={formData.refCurso}
                    onChange={handleChange}
                    required
                  >
                    <option value="" disabled>
                      {esProfesor ? "Selecciona una de las asignaturas que dictas" : "Selecciona uno de los cursos en los que estás inscrito"}
                    </option>
                    {cursosInscritos.map((curso) => (
                      <option key={curso.idCurso}>
                        {curso.nombreCurso}
                      </option>
                    ))}
                  </select>
                  <span className="slide-panel__hint">
                    { cursosInscritos.length === 0 
                      ? (esProfesor ? "No tienes cursos asignados como docente." : "No estás inscrito en ningún curso.")
                      : (esProfesor ? "La impresion se asociara a esta asignatura" : "La impresión se asociará a este curso")}
                  </span>
                </div>
              )}

              <p className="slide-panel__section-label">Colores de filamento</p>
              <div className="slide-panel__colors">
                {["color1", "color2", "color3"].map((name, i) => (
                  <div className="slide-panel__color-item" key={name}>
                    <label htmlFor={name}>Color {i + 1}</label>
                    <input
                      id={name}
                      type="color"
                      name={name}
                      value={formData[name]}
                      onChange={handleChange}
                    />
                  </div>
                ))}
              </div>

              <p className="slide-panel__section-label">Archivos</p>

              <div className="form-group">
                <label htmlFor="modelo3d">
                  Archivo Modelo 3D
                  <span className="slide-panel__required">*</span>
                </label>
                <input
                  id="modelo3d"
                  type="file"
                  accept="*" // se crea con accept = "*" para probar, pero deberia ser accept = ".3d"
                  onChange={(e) => setArchivoModelo3d(e.target.files[0])}
                />
              </div>

              <div className="form-group">
                <label htmlFor="stl">
                  Archivo Stl<span className="slide-panel__required">*</span>
                </label>
                <input
                  id="stl"
                  type="file"
                  accept="*" // se crea con accept = "*" para probar, pero deberia ser accept = ".stl"
                  onChange={(e) => setArchivoStl(e.target.files[0])}
                />
              </div>

              <div className="form-group">
                <label htmlFor="comentario">
                  Comentario{" "}
                  <span className="slide-panel__optional">(opcional)</span>
                </label>
                <textarea
                  id="comentario"
                  name="comentario"
                  value={formData.comentario}
                  onChange={handleChange}
                  placeholder="Instrucciones adicionales para el ayudante..."
                />
              </div>
            </form>

            <div className="slide-panel__footer">
              <button type="button" className="btn-cancel" onClick={onClose}>
                Cancelar
              </button>
              <button
                type="submit"
                form="solicitud-form"
                className="btn-submit"
                disabled={loading}
              >
                {loading ? "Enviando..." : "Enviar solicitud"}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default SolicitudImpresionForm