import { useState } from "react";
import { aprobarSolicitud } from "../api/ApiGestionImpresion.js";
import { rechazarSolicitud } from "../api/ApiGestionImpresion.js";
import Swal from "sweetalert2";
//import { actualizarObservacionAyudante } from "../api/ApiGestionImpresion.js";

export default function SolicitudesAyudante({ onClose, solicitudes = null, onRefresh, idAyudante = 1 }) {

  const ESTADOS_DISPONIBLES = [
    "PENDIENTE",
    "EN_PROGRESO",
    "COMPLETADA",
    "RECHAZADA",
  ];


  const [casillaEstados, setCasillaEstados] = useState(null);
  const [estadoActualizandose, setEstadoActualizandose] = useState(null);
  


  const isLoading = solicitudes === null;
  //Filtro de seguridad: Extraemos el arreglo real sin importar cómo venga del backend
  const listaReal = Array.isArray(solicitudes)
    ? solicitudes
    : solicitudes && Array.isArray(solicitudes.data)
      ? solicitudes.data
      : solicitudes && Array.isArray(solicitudes.solicitudes)
        ? solicitudes.solicitudes
        : null;



        
  const handleCambiarEstado = async (id, nuevoEstado, estadoActual, emailEnviar) => {
    // Si hacen clic en el mismo estado, cerramos y no hacemos nada.
    if (nuevoEstado === estadoActual) {
      setCasillaEstados(null);
      return;
      
    }
    setCasillaEstados(null); // menu cerrado x default
    setEstadoActualizandose(id); // se marca la fila
    try {
      let response;

      if (nuevoEstado === ESTADOS_DISPONIBLES[3]) { // RECHAZADA
        const { value:motivo } = await Swal.fire({
          title: 'Motivo de rechazo',
          input: 'textarea',
          inputLabel: 'Por favor, ingresa el motivo del rechazo:',
          inputPlaceholder: 'Escribe el motivo aquí...',
          showCancelButton: true,
          confirmButtonColor: '#d33',
          confirmButtonText:'Confirmar rechazo',
        });
        if (!motivo) {
          return
        }

        response = await rechazarSolicitud(id, idAyudante, motivo, emailEnviar);
      }
      if (nuevoEstado === ESTADOS_DISPONIBLES[1] || nuevoEstado === ESTADOS_DISPONIBLES[0]) { // EN_PROGRESO
        const { value : observacion } = await Swal.fire({
          title: 'Observación (opcional)',
          input: 'textarea',
          inputLabel: 'Si deseas, puedes agregar una observación para el estudiante:',
          inputPlaceholder: 'Escribe tu observación aquí...',
          showCancelButton: true,
          confirmButtonColor: '#28a745',
          confirmButtonText:'Confirmar aprobacion',
        });
        console.log("estado actual:" , estadoActual);
        console.log ("estado antiguo:" , nuevoEstado);
        response = await aprobarSolicitud(id, idAyudante, observacion, emailEnviar);
      }
      if (response.status === 200){
        console.log("Solicitud actualizada correctamente.");
        if (onRefresh) {
          onRefresh(); // funcion de refresco para actualizar datos
        }
      }

    } catch (error) {
      console.error("Error al actualizar el estado de la solicitud:", error);

    } finally {
      setEstadoActualizandose(null); // se desmarca la fila
    };}
    
  const toggleApertura = (id) => {
    if (casillaEstados === id) {
      setCasillaEstados(null);
    } else {
      setCasillaEstados(id);
    }
  };

  return (
    <div className="modal-backdrop" style={modalStyles.backdrop}>
      <div className="modal-content" style={modalStyles.content}>
        <div style={modalStyles.header}>
          <h2>Gestión de Solicitudes - Impresión 3D</h2>
          <button onClick={onClose} style={modalStyles.closeButton}>
            ✕
          </button>
        </div>

        <hr style={{ margin: "15px 0" }} />

        {/* Renderizado condicional */}
        {isLoading ? (
          <p>Cargando panel de solicitudes...</p>
        ) : listaReal === null ? (
          <div
            style={{
              color: "orange",
              padding: "10px",
              backgroundColor: "#fff3cd",
              borderRadius: "5px",
            }}
          >
            Los datos recibidos no tienen un formato válido.
            <small
              style={{ display: "block", marginTop: "5px", color: "#666" }}
            >
              Se recibió: {JSON.stringify(solicitudes)}
            </small>
          </div>
        ) : listaReal.length === 0 ? (
          <p>No hay solicitudes de diseño 3D pendientes de gestión.</p>
        ) : (
          <div style={modalStyles.tableContainer}>
            <table style={modalStyles.table}>
              <thead>
                <tr>
                  <th style={modalStyles.th}>ID</th>
                  <th style={modalStyles.th}>Estudiante</th>
                  <th style={modalStyles.th}>Modelo / Archivo</th>
                  <th style={modalStyles.th}>Email</th>
                  <th style={modalStyles.th}>Tipo de Solicitud</th>
                  <th style={modalStyles.th}>Estado </th>
                </tr>
              </thead>
              <tbody>
                {listaReal.map((solicitud) => {
                  const esFilaCargando = estadoActualizandose === solicitud.id;
                  const esMenuAbierto = casillaEstados === solicitud.id;

                  return (
                    <tr key={solicitud.idImpresion} style={modalStyles.tr}>
                      <td style={modalStyles.td}>
                        <strong>#{solicitud.id}</strong>
                      </td>
                      <td style={modalStyles.td}>
                        {solicitud.solicitanteNombre || "No especificado"}
                      </td>
                      <td style={modalStyles.td}>{solicitud.urlModelo3d}</td>
                      <td style={modalStyles.td}>
                        {solicitud.solicitanteEmail || "No especificado"}
                      </td>
                      <td style={modalStyles.td}>{solicitud.tipoSolicitud}</td>
                      
                      {/* celda para estado */}
                      <td style={{ ...modalStyles.td, position: "relative" }}>
                        <button
                          onClick={() => toggleApertura(solicitud.id)}
                          disabled={esFilaCargando}
                          style={{
                            ...statusBadgeStyle(solicitud.estadoImpresion),
                            cursor: esFilaCargando ? "wait" : "pointer",
                            border: "1px solid currentColor",
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "6px",
                            opacity: esFilaCargando ? 0.5 : 1,
                          }}
                        >
                          {esFilaCargando ? "..." : (solicitud.estadoImpresion || "PENDIENTE")}
                          <span style={{ fontSize: "9px" }}>{esMenuAbierto ? "▲" : "▼"}</span>
                        </button>

                        {/* menu flotante */}
                        {esMenuAbierto && (
                          <div >
                            <div >Cambiar estado:</div>
                            {ESTADOS_DISPONIBLES.map((estadoOpcion) => (
                              <button
                                key={estadoOpcion}
                                onClick={() => handleCambiarEstado(solicitud.idImpresion, estadoOpcion, solicitud.estado, solicitud.solicitanteEmail)}
                                style={{
                                  fontWeight: estadoOpcion === solicitud.estado ? "bold" : "normal",
                                  backgroundColor: estadoOpcion === solicitud.estado ? "#f0f0f0" : "transparent",
                                }}
                              >
                                {estadoOpcion}
                                {estadoOpcion === solicitud.estado && " ✓"}
                              </button>
                            ))}
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })}
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
    position: "fixed",
    top: 0,
    left: 0,
    width: "100vw",
    height: "100vh",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
  },
  content: {
    backgroundColor: "#fff",
    padding: "20px",
    borderRadius: "8px",
    width: "95%",
    maxWidth: "850px",
    maxHeight: "80vh",
    overflowY: "auto",
    boxShadow: "0 4px 15px rgba(0,0,0,0.2)",
    color: "#333",
    fontFamily: "sans-serif",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  closeButton: {
    background: "none",
    border: "none",
    fontSize: "22px",
    cursor: "pointer",
    color: "#666",
  },
  tableContainer: { marginTop: "15px" },
  table: { width: "100%", borderCollapse: "collapse", textAlign: "left" },
  th: {
    padding: "12px",
    borderBottom: "2px solid #ddd",
    backgroundColor: "#f8f9fa",
    fontWeight: "bold",
    color: "#555",
  },
  td: {
    padding: "12px",
    borderBottom: "1px solid #eee",
    verticalAlign: "middle",
  },
  tr: { hover: { backgroundColor: "#f9f9f9" } },
};

function statusBadgeStyle(status) {
  const base = {
    padding: "5px 10px",
    borderRadius: "20px",
    fontSize: "11px",
    fontWeight: "bold",
    display: "inline-block",
  };
  if (
    status === "Aprobado" ||
    status === "Finalizado" ||
    status === "Impreso"
  ) {
    return { ...base, backgroundColor: "#d4edda", color: "#155724" };
  }
  if (status === "Pendiente" || status === "En cola") {
    return { ...base, backgroundColor: "#fff3cd", color: "#856404" };
  }
  if (status === "Imprimiendo") {
    return { ...base, backgroundColor: "#cce5ff", color: "#004085" };
  }
  if (status === "Rechazado" || status === "Fallo") {
    return { ...base, backgroundColor: "#f8d7da", color: "#721c24" };
  }
  return { ...base, backgroundColor: "#e2e3e5", color: "#383d41" };
}

