import { useState } from 'react'
import { crearSolicitudImpresion } from '../api/ApiSolicitudImpresion'
import './SolicitudImpresionForm.css'


// Componente para el formulario de solicitud de impresión, utilizado en el dashboard del estudiante
function SolicitudImpresionForm({ user, isOpen, onClose, onSuccess }) {
  const [formData, setFormData] = useState({
    color1: '#000000',
    color2: '#ffffff',
    color3: '#ff0000',
    tipoSolicitud: 'ACADEMICA',
    comentario: '',
    urlModelo3d: '',
    urlModeloStl: '',
    refCurso: '',
  })
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
    if (!formData.urlModelo3d || !formData.urlModeloStl) {
      return 'Debes ingresar las URLs del modelo 3D y el archivo STL.'
    }
    if (!/^https?:\/\/.+/.test(formData.urlModelo3d)) {
      return 'La URL del modelo 3D no es válida (debe empezar con http:// o https://).'
    }
    if (!/^https?:\/\/.+/.test(formData.urlModeloStl)) {
      return 'La URL del archivo STL no es válida (debe empezar con http:// o https://).'
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
      const data = await crearSolicitudImpresion({
        idEstudiante: user.id,
        color1: formData.color1,
        color2: formData.color2,
        color3: formData.color3,
        tipoSolicitud: formData.tipoSolicitud,
        comentario: formData.comentario || undefined,
        urlModelo3d: formData.urlModelo3d,
        urlModeloStl: formData.urlModeloStl,
        refCurso: formData.tipoSolicitud === 'ACADEMICA' ? formData.refCurso : undefined,
      })

      console.log('Solicitud creada:', data)
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
    <div className={`slide-panel ${isOpen ? 'open' : ''}`}>
      <div className="slide-panel__inner">
        <div className="slide-panel__header">
          <h3>Nueva solicitud de impresión</h3>
          <button className="slide-panel__close" onClick={onClose} aria-label="Cerrar panel">
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
            <form id="solicitud-form" onSubmit={handleSubmit} className="slide-panel__body">
              {error && <div className="slide-panel__error">{error}</div>}

              <div className="form-group">
                <label htmlFor="tipo">Tipo de solicitud</label>
                <select id="tipo" name="tipoSolicitud" value={formData.tipoSolicitud} onChange={handleChange}>
                  <option value="ACADEMICA">Académica</option>
                  <option value="PERSONAL">Personal</option>
                </select>
              </div>

              {formData.tipoSolicitud === 'ACADEMICA' && (
                <div className="form-group">
                  <label htmlFor="refCurso">
                    Código del curso <span className="slide-panel__required">*</span>
                  </label>
                  <input
                    id="refCurso"
                    type="text"
                    name="refCurso"
                    value={formData.refCurso}
                    onChange={handleChange}
                    placeholder="Ej: CS101-2026"
                  />
                  <span className="slide-panel__hint">Debes estar inscrito en el curso.</span>
                </div>
              )}

              <p className="slide-panel__section-label">Colores de filamento</p>
              <div className="slide-panel__colors">
                {['color1', 'color2', 'color3'].map((name, i) => (
                  <div className="slide-panel__color-item" key={name}>
                    <label htmlFor={name}>Color {i + 1}</label>
                    <input id={name} type="color" name={name} value={formData[name]} onChange={handleChange} />
                  </div>
                ))}
              </div>

              <p className="slide-panel__section-label">Archivos</p>

              <div className="form-group">
                <label htmlFor="modelo3d">URL del modelo 3D <span className="slide-panel__required">*</span></label>
                <input
                  id="modelo3d"
                  type="url"
                  name="urlModelo3d"
                  value={formData.urlModelo3d}
                  onChange={handleChange}
                  placeholder="https://ejemplo.com/modelo.glb"
                />
              </div>

              <div className="form-group">
                <label htmlFor="stl">URL del archivo STL <span className="slide-panel__required">*</span></label>
                <input
                  id="stl"
                  type="url"
                  name="urlModeloStl"
                  value={formData.urlModeloStl}
                  onChange={handleChange}
                  placeholder="https://ejemplo.com/archivo.stl"
                />
              </div>

              <div className="form-group">
                <label htmlFor="comentario">Comentario <span className="slide-panel__optional">(opcional)</span></label>
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
              <button type="button" className="btn-cancel" onClick={onClose}>Cancelar</button>
              <button type="submit" form="solicitud-form" className="btn-submit" disabled={loading}>
                {loading ? 'Enviando...' : 'Enviar solicitud'}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default SolicitudImpresionForm