/* eslint-disable max-lines-per-function */
import { useState } from "react";
import { aprobarSolicitud } from "../api/ApiGestionImpresion.js";
import { rechazarSolicitud } from "../api/ApiGestionImpresion.js";
import { completarSolicitud } from "../api/ApiGestionImpresion.js";
import Swal from "sweetalert2";
import './Solicitudes.css'
//import { actualizarObservacionAyudante } from "../api/ApiGestionImpresion.js";

export default function SolicitudesAyudante({ onClose, solicitudes = null, onRefresh, idAyudante = 1 }) {

  const ESTADOS_DISPONIBLES = ["PENDIENTE","EN_PROGRESO","COMPLETADA","RECHAZADA",];

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
    // verificacion de cambios de estado, si es el mismo no hace nada
    if (nuevoEstado === estadoActual) { setCasillaEstados(null); return; }
    
    //si ya fue completada no deberia poder
    if (estadoActual === "COMPLETADA") {
      setCasillaEstados(null);
      Swal.fire({ icon: "error",
        title: "Acción bloqueada",
        text: `Esta solicitud ya fue finalizada como ${estadoActual}. No puedes modificar su flujo.`,
      });
      return;
    }

    // no se puede saltar estados, por ej de pendiente a completada de una
    if (estadoActual === 'PENDIENTE' && nuevoEstado === 'COMPLETADA') {
      setCasillaEstados(null);
      Swal.fire({ icon: 'warning', title: 'Flujo incorrecto', text: 'Primero debes cambiar el estado a EN_PROGRESO para iniciar la impresion'
      });
      return;
    }
 
    // no se puede regresar de estados, por ej de completada a pendiente
    if (estadoActual === 'EN_PROGRESO' && nuevoEstado === 'PENDIENTE') {
      setCasillaEstados(null);
      Swal.fire({
        icon: 'warning',
        title: 'Cambio inválido',
        text: 'La solicitud ya está en cola de impresión activa, no puede volver a estar pendiente.'
      });
      return;
    }

    setCasillaEstados(null);
    setEstadoActualizandose(id);

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
      if (nuevoEstado === ESTADOS_DISPONIBLES[2]) { // COMPLETADA
        response = await Swal.fire({
          title: 'Confirmación de finalización',
          text: '¿Estás seguro de que deseas marcar esta solicitud como COMPLETADA?',
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#28a745',
          cancelButtonColor: '#d33',
          confirmButtonText: 'Sí, marcar como COMPLETADA',
        }).then(async (result) => {
          if (result.isConfirmed) {
            return await completarSolicitud(id, idAyudante, emailEnviar);
          }
        });
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
    if (casillaEstados === id) { setCasillaEstados(null); } else { setCasillaEstados(id); }
  };

  return (
    <div className="modal-backdrop">
      <div className="modal-content">
        <div className="modal-header">
          <h2>Gestión de Solicitudes - Impresión 3D</h2>
          <button onClick={onClose} className="modal-close-button">
            ✕
          </button>
        </div>

        <hr style={{ margin: "15px 0" }} />

        {/* Renderizado condicional */}
        {isLoading ? (
          <p>Cargando panel de solicitudes...</p>
        ) : listaReal === null ? (
          <div style={{ color: "orange", padding: "10px", backgroundColor: "#fff3cd", borderRadius: "5px",}}>
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
          <div className="modal-table-container">
            <table className="modal-table">
              <thead>
                <tr>
                  <th className="modal-th">ID</th>
                  <th className="modal-th">Estudiante</th>
                  <th className="modal-th">Modelo / Archivo</th>
                  <th className="modal-th">Email</th>
                  <th className="modal-th">Tipo de Solicitud</th>
                  <th className="modal-th">Curso</th>
                  <th className="modal-th">Estado </th>
                </tr>
              </thead>
              <tbody>
                {listaReal.map((solicitud) => {
                  const esFilaCargando = estadoActualizandose === solicitud.idImpresion;
                  const esMenuAbierto = casillaEstados === solicitud.idImpresion;

                  return (
                    <tr key={solicitud.idImpresion} className="modal-tr">
                      <td className="modal-td"> <strong>#{solicitud.id}</strong> </td>
                      <td className="modal-td"> {solicitud.solicitanteNombre || "No especificado"}</td>
                      <td className="modal-td">{solicitud.urlModelo3d}</td>
                      <td className="modal-td"> {solicitud.solicitanteEmail || "No especificado"}</td>
                      <td className="modal-td">{solicitud.tipoSolicitud}</td>
                      <td className="modal-td"> 
                        {solicitud.tipoSolicitud ==="ACADEMICA"
                          ? (solicitud.curso?.nombreCurso || "No especificado") : "N/A"}
                      </td>
                      {/* celda para estado */}
                      <td className="modal-td" style={{ position: "relative" }}>
                        <button onClick={() => toggleApertura(solicitud.idImpresion)} disabled={esFilaCargando} className={`btn-status-selector ${String(
                          solicitud.estadoImpresion || "PENDIENTE",
                        ) .toLowerCase().replace("_", "-")}`} >
                          {esFilaCargando? "..." : solicitud.estadoImpresion || "PENDIENTE"}
                          <span style={{ fontSize: "9px" }}> {esMenuAbierto ? "▲" : "▼"} </span>
                        </button>

                        {/* menu flotante */}
                        {esMenuAbierto && (
                          <div className="menu-abierto">
                            <div className="menu-abierto-title">Cambiar estado:</div>
                            {ESTADOS_DISPONIBLES.map((estadoOpcion) => {
                              // comprobar si el estado de la opcion a seleccionar es el mismo que el actual
                              const esActivo =
                                estadoOpcion === solicitud.estadoImpresion;

                              return (
                                <button
                                  key={estadoOpcion}
                                  onClick={() =>
                                    handleCambiarEstado( solicitud.idImpresion,estadoOpcion,solicitud.estadoImpresion,
                                      solicitud.solicitanteEmail,
                                    )
                                  }
                                  className={`dropdown-item status-badge ${estadoOpcion.toLowerCase().replace("_", "-")} ${esActivo ? "active-option" : ""}`}
                                >
                                  {estadoOpcion}
                                  {esActivo && " ✓"}
                                </button>
                              );
                            })}
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