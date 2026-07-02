import { useEffect, useState } from "react";
import { crearCurso as crearCursoApi, obtenerSemestres } from "../api/ApiCreacionCurso";

export default function CreacionCurso({ onClose }) {
  const [nombreCurso, setNombreCurso] = useState("");
  const [semestreId, setSemestreId] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMensaje, setErrorMensaje] = useState("");
  const [exitoMensaje, setExitoMensaje] = useState("");
  const [semestres, setSemestres] = useState([]);
  const [cargandoSemestres, setCargandoSemestres] = useState(true);

  const usuarioGuardado = typeof window !== "undefined" ? localStorage.getItem("user") : null;
  const usuario = usuarioGuardado ? JSON.parse(usuarioGuardado) : null;
  const profesorId = usuario?.id || "";

  useEffect(() => {
    const cargarSemestres = async () => {
      try {
        const data = await obtenerSemestres();
        setSemestres(data);
      } catch (error) {
        setErrorMensaje(error.message || "No se pudieron cargar los semestres.");
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

    try {
      setIsSubmitting(true);
      await crearCursoApi({
        nombreCurso: nombreCurso.trim(),
        semestreId: semestreId.trim(),
        profesorId,
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
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Crear Curso</h2>

        <form onSubmit={manejarSubmit}>
          <label htmlFor="nombreCurso">Nombre del Curso</label>
          <input
            id="nombreCurso"
            data-testid="nombreCurso"
            type="text"
            value={nombreCurso}
            onChange={(e) => setNombreCurso(e.target.value)}
          />

          <label htmlFor="semestreId">Semestre</label>
          <select
            id="semestreId"
            data-testid="semestreId"
            value={semestreId}
            onChange={(e) => setSemestreId(e.target.value)}
            disabled={cargandoSemestres}
          >
            <option value="">{cargandoSemestres ? "Cargando semestres..." : "Seleccione un semestre"}</option>
            {semestres.map((semestre) => (
              <option key={semestre.idSemestre} value={semestre.idSemestre}>
                {semestre.anio} - Periodo {semestre.periodo} ({semestre.estadoSemestre})
              </option>
            ))}
          </select>

          <input type="hidden" value={profesorId} />

          {errorMensaje ? <p role="alert">{errorMensaje}</p> : null}
          {exitoMensaje ? <p>{exitoMensaje}</p> : null}

          <button data-testid="crearCurso" type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Creando..." : "Crear Curso"}
          </button>
          <button type="button" onClick={onClose}>
            Cancelar
          </button>
        </form>
      </div>
    </div>
  );
}