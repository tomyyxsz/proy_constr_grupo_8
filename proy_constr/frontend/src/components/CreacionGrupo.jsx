// parecido a crear curso, solo que se busca crear un grupo para un curso ya existe,
// se debe vincular con el backend mediante la api a realizar, pero primero hay que cargar los cursos del profesor
// luego de cargar los cursos deberia aparecer para crear un grupo, luego de crear el grupo,
// se debe poder agregar estudiantes al grupo, que deberian estar cargados y mostrarse en una lista para ir agregando y asignando al grupo
// la rutas para eso ya estan en backend/src/CreacionGrupo.js

import { useState, useEffect } from "react";
// import { crearGrupo as crearGrupoApi, obtenerCursos } from "../api/ApiCreacionGrupo";
import {
  crearGrupo as crearGrupoApi,
  obtenerCursos, agregarEstudianteAGrupo,
} from "../api/ApiCreacionGrupo";
//import "./CreacionGrupo.css";
import Swal from "sweetalert2";

export default function CreacionGrupo({ onClose }) {
  const [nombreGrupo, setNombreGrupo] = useState("");
  const [cursoId, setCursoId] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMensaje, setErrorMensaje] = useState("");
  const [exitoMensaje, setExitoMensaje] = useState("");
  const [cursos, setCursos] = useState([]);
  const [cargandoCursos, setCargandoCursos] = useState(true);

  const usuarioGuardado =
    typeof window !== "undefined" ? localStorage.getItem("user") : null;
  const usuario = usuarioGuardado ? JSON.parse(usuarioGuardado) : null;
  const profesorId = usuario?.id || "";

  useEffect(() => {
    const cargarCursos = async () => {
      try {
        const data = await obtenerCursos(profesorId);
        setCursos(data);
        console.log("Cursos obtenidos:", data);
      } catch (error) {
        setErrorMensaje(error.message || "No se pudieron cargar los cursos.");
      } finally {
        setCargandoCursos(false);
      }
    };
    cargarCursos();
  }, [profesorId]);

  const manejarSubmit = async (e) => {
    e.preventDefault();
    setErrorMensaje("");
    setExitoMensaje("");

    if (!nombreGrupo.trim()) {
      setErrorMensaje("Debe ingresar el nombre del grupo.");
      return;
    }

    if (!cursoId.trim()) {
      setErrorMensaje("Debe seleccionar un curso para el grupo.");
      return;
    }

    if (!profesorId) {
      setErrorMensaje("No se encontró el profesor autenticado.");
      return;
    }

    setIsSubmitting(true);

    try {
      await crearGrupoApi({
        refCurso: cursoId,
        nombreGrupo,
      });
      setExitoMensaje("Grupo creado exitosamente.");
    } catch (error) {
      setErrorMensaje(error.message || "Error al crear el grupo.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="creacion-grupo-container">
      <h2>Crear Grupo</h2>
      {errorMensaje && <p className="error">{errorMensaje}</p>}
      {exitoMensaje && <p className="exito">{exitoMensaje}</p>}
      <form onSubmit={manejarSubmit}>
        <div className="form-group">
          <label htmlFor="nombreGrupo">Nombre del Grupo:</label>
          <input
            type="text"
            id="nombreGrupo"
            value={nombreGrupo}
            onChange={(e) => setNombreGrupo(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label htmlFor="cursoId">Curso:</label>
          {cargandoCursos ? (
            <p>Cargando cursos...</p>
          ) : (
            <select
              id="cursoId"
              value={cursoId}
              onChange={(e) => setCursoId(e.target.value)}
            >
              <option value="">Seleccione un curso</option>
              {cursos.cursos.map((curso) => (
                <option key={curso.idCurso} value={curso.idCurso}>
                  {curso.nombreCurso}
                </option>
              ))}
            </select>
          )}
        </div>
        <button type="submit" data-testid="crearGrupo" disabled={isSubmitting}>
          {isSubmitting ? "Creando..." : "Crear Grupo"}
        </button>
        <button type="button" onClick={onClose}>
          Cancelar
        </button>
      </form>
    </div>
  );
}

