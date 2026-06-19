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
    <div className="modal-backdrop" style={modalStyles.backdrop}>
      <div className="modal-content" style={modalStyles.content}>
        <div style={modalStyles.header}>
          <h2>Mis solicitudes - Impresión 3D</h2>
          <button onClick={onClose} style={modalStyles.closeButton}>✕</button>
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
          <div style={modalStyles.tableContainer}>
            <table style={modalStyles.table}>
              <thead>
                <tr>
                  <th style={modalStyles.th}>ID</th>
                  <th style={modalStyles.th}>Modelo / Archivo</th>
                  <th style={modalStyles.th}>Tipo de Solicitud</th>
                  <th style={modalStyles.th}>Estado</th>
                  <th style ={modalStyles.th}>Observacion Ayudante</th>
                  <th style={modalStyles.th}>Comentario tecnico</th>
                  <th style={modalStyles.th}>Fecha inicio Impresion</th>
                </tr>
              </thead>
              <tbody>
                
                {listaReal.map((solicitud, index) => (
               

                  <tr key={solicitud.id} style={modalStyles.tr}>
                    <td style={modalStyles.td}><strong>#{index + 1}</strong></td>
                    <td style={modalStyles.td}>
                      {solicitud.urlModelo3d }
                    </td>
                    <td style={modalStyles.td}>
                      {solicitud.tipoSolicitud}
                    </td>
                    <td style={modalStyles.td}>
                      <span style={statusBadgeStyle(solicitud.estadoImpresion)}>
                        {solicitud.estadoImpresion || 'Pendiente'}
                      </span>
                    </td>
                    <td style={modalStyles.td}>
                      {solicitud.observacionAyudante || 'No hay observaciones'}
                    </td>
                    <td style = {modalStyles.td}>
                      {solicitud.comentarioTecnico || 'No hay comentarios técnicos'}
                    </td>
                    <td style={modalStyles.td}>
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

const modalStyles = {
  backdrop: {
    position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000
  },
  content: {
    backgroundColor: '#fff', padding: '20px', borderRadius: '8px', width: '95%', maxWidth: '850px',
    maxHeight: '80vh', overflowY: 'auto', boxShadow: '0 4px 15px rgba(0,0,0,0.2)', color: '#333', fontFamily: 'sans-serif'
  },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  closeButton: { background: 'none', border: 'none', fontSize: '22px', cursor: 'pointer', color: '#666' },
  tableContainer: { marginTop: '15px' },
  table: { width: '100%', borderCollapse: 'collapse', textAlign: 'left' },
  th: { padding: '12px', borderBottom: '2px solid #ddd', backgroundColor: '#f8f9fa', fontWeight: 'bold', color: '#555' },
  td: { padding: '12px', borderBottom: '1px solid #eee', verticalAlign: 'middle' },
  tr: { hover: { backgroundColor: '#f9f9f9' } }
};

function statusBadgeStyle(status) {
  const base = { padding: '5px 10px', borderRadius: '20px', fontSize: '11px', fontWeight: 'bold', display: 'inline-block' };
  if (status === 'Aprobado' || status === 'Finalizado' || status === 'Impreso') {
    return { ...base, backgroundColor: '#d4edda', color: '#155724' };
  }
  if (status === 'Pendiente' || status === 'En cola') {
    return { ...base, backgroundColor: '#fff3cd', color: '#856404' };
  }
  if (status === 'Imprimiendo') {
    return { ...base, backgroundColor: '#cce5ff', color: '#004085' };
  }
  if (status === 'Rechazado' || status === 'Fallo') {
    return { ...base, backgroundColor: '#f8d7da', color: '#721c24' };
  }
  return { ...base, backgroundColor: '#e2e3e5', color: '#383d41' };
}
