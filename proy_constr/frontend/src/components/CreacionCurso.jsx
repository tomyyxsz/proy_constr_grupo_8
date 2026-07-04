import { useEffect, useState } from "react";
import {
  crearCurso as crearCursoApi,
  obtenerSemestres,
} from "../api/ApiCreacionCurso";
import "./CreacionCurso.css";
import Swal from "sweetalert2";

export default function CreacionCurso({ onClose }) {
  const [nombreCurso, setNombreCurso] = useState("");
  const [semestreId, setSemestreId] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMensaje, setErrorMensaje] = useState("");
  const [exitoMensaje, setExitoMensaje] = useState("");
  const [semestres, setSemestres] = useState([]);
  const [cargandoSemestres, setCargandoSemestres] = useState(true);
  const [archivoCSV, setArchivoCSV] = useState(null);

  const usuarioGuardado =
    typeof window !== "undefined" ? localStorage.getItem("user") : null;
  const usuario = usuarioGuardado ? JSON.parse(usuarioGuardado) : null;
  const profesorId = usuario?.id || "";

  useEffect(() => {
    const cargarSemestres = async () => {
      try {
        const data = await obtenerSemestres();
        setSemestres(data);
      } catch (error) {
        setErrorMensaje(
          error.message || "No se pudieron cargar los semestres.",
        );
      } finally {
        setCargandoSemestres(false);
      }
    };

    cargarSemestres();
  }, []);

  const manejarSubmit = async (e) => {
    e.preventDefault();
    setErrorMensaje("");
    setExitoMensaje("");

    if (!nombreCurso.trim()) {
      alert("Debe ingresar nombre");
      setErrorMensaje("Debe ingresar el nombre del curso.");
      return;
    }

    if (!semestreId.trim()) {
      alert("Debe ingresar el semestre del curso.");
      setErrorMensaje("Debe ingresar el semestre del curso.");
      return;
    }

    if (!profesorId) {
      setErrorMensaje("No se encontró el profesor autenticado.");
      return;
    }
    if (!archivoCSV) {
      setErrorMensaje("Debe seleccionar un archivo CSV de estudiantes.");
      return;
    }

    try {
      setIsSubmitting(true);
      const datosCurso = new FormData();
      datosCurso.append("nombreCurso", nombreCurso.trim());
      datosCurso.append("semestreId", semestreId.trim());
      datosCurso.append("profesorId", profesorId);
      datosCurso.append("archivoCSV", archivoCSV);

      await crearCursoApi({
        nombreCurso: nombreCurso.trim(),
        semestreId: semestreId.trim(),
        profesorId,
        archivoCSV,
      });

      // mostrar mensaje de exito usando swal
      await Swal.fire({
        icon: "success",
        title: "Curso creado correctamente",
        text: `Se ha creado el curso "${nombreCurso}" y se han importado los estudiantes desde el archivo CSV.`,
      });
      setExitoMensaje("Curso creado correctamente.");
      setNombreCurso("");
      setSemestreId("");
      if (onClose) {
        onClose();
      }
    } catch (error) {
      setErrorMensaje(error.message || "No se pudo crear el curso.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="modal-backdrop">
      <div className="modal-overlay">
        <div className="modal-content">
          <h2>Crear Curso</h2>

          <form className="form" onSubmit={manejarSubmit}>
            <label className="form-label" htmlFor="nombreCurso">
              Nombre del Curso
            </label>
            <input
              className="input"
              id="nombreCurso"
              data-testid="nombreCurso"
              type="text"
              value={nombreCurso}
              onChange={(e) => setNombreCurso(e.target.value)}
            />

            <label className="form-label" htmlFor="semestreId">
              Semestre
            </label>
            <select
              className="input"
              id="semestreId"
              data-testid="semestreId"
              value={semestreId}
              onChange={(e) => setSemestreId(e.target.value)}
              disabled={cargandoSemestres}
            >
              <option value="">
                {cargandoSemestres
                  ? "Cargando semestres..."
                  : "Seleccione un semestre"}
              </option>
              {semestres.map((semestre) => (
                <option key={semestre.idSemestre} value={semestre.idSemestre}>
                  {semestre.anio} - Periodo {semestre.periodo} (
                  {semestre.estadoSemestre})
                </option>
              ))}
            </select>

            <label className="form-label" htmlFor="cursoCSV">
              Archivo CSV de Estudiantes
            </label>
            <input
              className="input"
              id="cursoCSV"
              type="file"
              accept=".csv"
              onChange={(e) => {
                const file = e.target.files[0];
                setArchivoCSV(file);
              }}
            ></input>
            <input type="hidden" value={profesorId} />

            {errorMensaje ? <p role="alert">{errorMensaje}</p> : null}
            {exitoMensaje ? <p>{exitoMensaje}</p> : null}

            <button
              className="createButton"
              data-testid="crearCurso"
              type="submit"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Creando..." : "Crear Curso"}
            </button>
            <button className="cancelButton" type="button" onClick={onClose}>
              Cancelar
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
