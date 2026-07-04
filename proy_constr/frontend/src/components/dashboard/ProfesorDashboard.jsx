import "./Dashboard.css";
import { useState, useCallback } from "react";
import ActionCard from "../ActionCard";
import CrearCurso from "../CreacionCurso";
import SolicitudImpresionForm from "../SolicitudImpresionForm";
import SolicitudesAyudante from "../SolicitudesAyudante";
import CrearGrupo from "../CreacionGrupo";
import {obtenerSolicitudesProfesor} from "../../api/ApiGestionImpresion";

const API_BASE_URL = `${import.meta.env.VITE_API_URL || "http://localhost:3001"}/api/impresiones`;

function ProfesorDashboard({ user }) {
  const idUsuario = user?.id; 

  const [showCrearCurso, setShowCrearCurso] = useState(false);
  const [showSolicitudForm, setShowSolicitudForm] = useState(false);
  const [showSolicitudes, setShowSolicitudes] = useState(false);
  const [solicitudesProfesor, setSolicitudesProfesor] = useState([]);
  const [showCrearGrupo, setShowCrearGrupo] = useState(false);

  const toggleCreacionCurso = () => { setShowCrearCurso(!showCrearCurso); }; const toggleCreacionGrupo = () => { setShowCrearGrupo(!showCrearGrupo); }; 

  const fetchSolicitudes = useCallback(async () => {
    if (!idUsuario) return; // Usamos la variable extraída
    
    try {

      const datos = await obtenerSolicitudesProfesor(idUsuario);
      setSolicitudesProfesor(datos);
      
    } catch (err) {
      console.error("Error al obtener solicitudes del profesor:", err);
      setSolicitudesProfesor([]);
    }
  }, [idUsuario]);



  const handleSolicitudSuccess = async () => {
    await fetchSolicitudes();
    console.log("Solicitud enviada exitosamente");
  };

  return (
    <>
      <div className="dashboard-grid">
        <ActionCard
          icon="ti-books"
          title="Crear curso"
          description="Crear curso y cargar estudiantes"
          onClick={() => toggleCreacionCurso()}
        />

        <ActionCard
          icon="ti-clipboard-check"
          title="Solicitudes pendientes"
          description="Revisa solicitudes que requieren tu aprobación"
          onClick={() => {setShowSolicitudes(true)
            fetchSolicitudes();
          }}
        />

        <ActionCard
          icon="ti-users"
          title="Gestionar ayudantías"
          description="Asigna y supervisa a tus ayudantes"
          onClick={() => {}}
        />

        <ActionCard
          icon="ti-3d-cube-sphere"
          iconClass="icon-estudiante"
          title="Solicitar impresión"
          description="Crea una nueva solicitud de impresión 3D como docente"
          onClick={() => setShowSolicitudForm(true)}
        />

        <ActionCard
          icon="ti-3d-cube-sphere"
          iconClass="icon-estudiante"
          title="Crear grupo"
          description="Crea un nuevo grupo para uno de tus cursos"
          onClick={() => toggleCreacionGrupo()}
        />
      </div>

      {showCrearCurso && (
        <div onClick={(e) => e.stopPropagation()}>
          <CrearCurso onClose={() => setShowCrearCurso(false)} />
        </div>
      )}

      {showSolicitudForm && (
        <SolicitudImpresionForm
          user={user}
          isOpen={showSolicitudForm}
          onClose={() => setShowSolicitudForm(false)}
          onSuccess={handleSolicitudSuccess}
        />
      )}

      {showSolicitudes && (
        <SolicitudesAyudante
          onClose={() => setShowSolicitudes(false)}
          solicitudes={solicitudesProfesor}
          onRefresh={fetchSolicitudes}
        />
      )}

      {showCrearGrupo && (
        <div onClick={(e) => e.stopPropagation()}>
          <CrearGrupo onClose={() => setShowCrearGrupo(false)} />
        </div>
      )}
    </>
  );
}
export default ProfesorDashboard;