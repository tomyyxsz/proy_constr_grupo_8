// deberia mostrar una tabla con todos los estudiantes de un profesor,
// mostrando el nombre, correo, curso al que pertenece, y si pertenece a un curso mostrar a que grupo del curso pertenece
// si no tiene grupo mostrar un boton para asignarlo a un grupo, que al hacer click abra un modal con un select de todos los grupos del curso al que pertenece el estudiante

import { useState, useEffect } from "react";
import {
  obtenerAlumnosProfesor,
  agregarEstudianteAGrupo,
  obtenerGruposCurso,
} from "../api/ApiCreacionGrupo.js";
import Swal from "sweetalert2";
import "./GestionEstudiante.css";

export default function GestionEstudiante({ profesorId, onClose }) {
  const [estudiantes, setEstudiantes] = useState([]);
  const [gruposCurso, setGruposCurso] = useState({});
  const [cargando, setCargando] = useState(true);
  const [errorMensaje, setErrorMensaje] = useState("");
  const [grupoSeleccionado, setGrupoSeleccionado] = useState("");
  const [estudianteSeleccionado, setEstudianteSeleccionado] = useState(null);

  useEffect(() => {
    const cargarEstudiantes = async () => {
      try {
        const data = await obtenerAlumnosProfesor(profesorId);
        setEstudiantes(data.estudiantes);
        // Cargar los grupos de cada curso al que pertenece el estudiante
        const gruposPorCurso = {};
        for (const estudiante of data.estudiantes) {
          if (estudiante.refCurso) {
            const grupos = await obtenerGruposCurso(estudiante.refCurso);
            gruposPorCurso[estudiante.refCurso] = grupos;
          }
        }
        setGruposCurso(gruposPorCurso);
      } catch (error) {
        setErrorMensaje(
          error.message || "No se pudieron cargar los estudiantes.",
        );
      } finally {
        setCargando(false);
      }
    };
    cargarEstudiantes();
  }, [profesorId]);

  const manejarAsignarGrupo = async () => {
    if (!grupoSeleccionado || !estudianteSeleccionado) {
      Swal.fire("Error", "Debe seleccionar un grupo y un estudiante.", "error");
      return;
    }

    try {
      await agregarEstudianteAGrupo({
        refGrupo: grupoSeleccionado,
        refEstudiante: estudianteSeleccionado.id,
      });
      Swal.fire(
        "Éxito",
        "Estudiante asignado al grupo correctamente.",
        "success",
      );

      // actualizar para ver el cambio
      const data = await obtenerAlumnosProfesor(profesorId);
      setEstudiantes(data.estudiantes);

      setGrupoSeleccionado("");
      setEstudianteSeleccionado(null);
    } catch (error) {
      Swal.fire(
        "Error",
        error.message || "No se pudo asignar el estudiante al grupo.",
        "error",
      );
    }
  };
  // el html deberia ser igual a lo que sale al mostrar las solicitudes, una ventana modal con tabla de estudiantes, y un boton para asignar grupo, que abra otro modal con un select de grupos del curso al que pertenece el estudiante
  return (
    <div className="modal-backdrop">
      <div className="gestion-estudiante-container">
        <div className="modal-header">
          <h2>Gestión de Estudiantes</h2>
          <button
            className="modal-close-button"
            onClick={() => {
              onClose();
            }}
          >
            X
          </button>
        </div>

        {cargando ? (
          <p>Cargando estudiantes...</p>
        ) : errorMensaje ? (
          <p className="error">{errorMensaje}</p>
        ) : (
          <table className="estudiantes-table">
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Correo</th>
                <th>Curso</th>
                <th>Grupo</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {estudiantes.map((estudiante) => (
                <tr key={estudiante.id}>
                  <td>{estudiante.nombre}</td>
                  <td>{estudiante.correo}</td>
                  <td>{estudiante.cursoNombre || "N/A"}</td>
                  <td>{estudiante.grupo || "Sin grupo"}</td>
                  <td>
                    {!estudiante.grupo && (
                      <button
                        onClick={() => {
                          setEstudianteSeleccionado(estudiante);
                          setGrupoSeleccionado("");
                        }}
                      >
                        Asignar Grupo
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        {estudianteSeleccionado && (
          <div
            className="modal-overlay"
            onClick={() => {
              setEstudianteSeleccionado(null);
            }}
          >
            <div className="modal-content">
              <h3>Asignar Grupo a {estudianteSeleccionado.nombre}</h3>
              <select
                value={grupoSeleccionado}
                onChange={(e) => setGrupoSeleccionado(e.target.value)}
              >
                <option value="">Seleccione un grupo</option>
                {gruposCurso[estudianteSeleccionado.refCurso]?.map((grupo) => (
                  <option key={grupo.idGrupoCurso} value={grupo.idGrupoCurso}>
                    {grupo.nombreGrupo}
                  </option>
                ))}
              </select>
              <button onClick={manejarAsignarGrupo}>Asignar</button>
              <button
                onClick={() => {
                  setEstudianteSeleccionado(null);
                  setGrupoSeleccionado("");
                }}
              >
                Cancelar
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
