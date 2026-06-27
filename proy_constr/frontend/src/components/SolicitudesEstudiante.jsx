import './Solicitudes.css'

export default function SolicitudesEstudiante({ onClose, solicitudes = null }) {


  const isLoading = solicitudes === null;
  //Filtro de seguridad: Extraemos el arreglo real sin importar cómo venga del backend
  const listaReal = Array.isArray(solicitudes)
    ? solicitudes
    : solicitudes && Array.isArray(solicitudes.data)
      ? solicitudes.data
      : solicitudes && Array.isArray(solicitudes.solicitudes)
        ? solicitudes.solicitudes
        : null;

  return (
    <div className="modal-backdrop" >
      <div className="modal-content">
        <div className="modal-header">
          <h2>Mis solicitudes - Impresión 3D</h2>
          <button onClick={onClose} className="modal-close-button">✕</button>
        </div>

        <hr style={{ margin: '15px 0' }} />

        {/* Renderizado condicional */}
        {isLoading ? (
          <p>Cargando panel de solicitudes...</p>
        ) : listaReal === null ? (
          <div style={{ color: 'orange', padding: '10px', backgroundColor: '#fff3cd', borderRadius: '5px' }}>
            Los datos recibidos no tienen un formato válido.
            <small style={{ display: 'block', marginTop: '5px', color: '#666' }}>
              Se recibió: {JSON.stringify(solicitudes)}
            </small>
          </div>
        ) : listaReal.length === 0 ? (
          <p>No tienes solicitudes hechas.</p>
        ) : (
          <div className="modal-table-container">
            <table className="modal-table">
              <thead>
                <tr>
                  <th className="modal-th">ID</th>
                  <th className="modal-th">Modelo / Archivo</th>
                  <th className="modal-th">Tipo de Solicitud</th>
                  <th className="modal-th">Estado</th>
                  <th className="modal-th">Observacion Ayudante</th>
                  <th className="modal-th">Comentario tecnico</th>
                  <th className="modal-th">Fecha inicio Impresion</th>
                </tr>
              </thead>
              <tbody>
                
                {listaReal.map((solicitud, index) => (
               

                  <tr className="modal-tr:hover" key={solicitud.id} >
                    <td className = "modal-td"><strong>#{index + 1}</strong></td>
                    <td className = "modal-td">
                      {solicitud.urlModelo3d }
                    </td>
                    <td className = "modal-td">
                      {solicitud.tipoSolicitud}
                    </td>
                    <td className = "modal-td">
                      <span className={`status-badge     ${String(solicitud.estadoImpresion).toLowerCase().replace('_', '-')}`}>
                        {solicitud.estadoImpresion || 'Pendiente'}
                      </span>
                    </td>
                    <td className = "modal-td">
                      {solicitud.observacionAyudante || 'No hay observaciones'}
                    </td>
                    <td className = "modal-td">
                      {solicitud.comentarioTecnico || 'No hay comentarios técnicos'}
                    </td>
                    <td className = "modal-td">
                      {solicitud.inicioImpresion
                        ? new Date(solicitud.inicioImpresion).toLocaleString()
                        : 'Sin actualizaciones'}
                    </td>

                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

