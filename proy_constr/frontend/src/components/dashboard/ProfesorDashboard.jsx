import "./Dashboard.css";
import { useState, useCallback } from "react";
import ActionCard from "../ActionCard";
import CrearCurso from "../CreacionCurso";
import SolicitudImpresionForm from "../SolicitudImpresionForm";
import SolicitudesAyudante from "../SolicitudesAyudante";
import CrearGrupo from "../CreacionGrupo";
import GestionEstudiantes from "../GestionEstudiante";
import {obtenerSolicitudesProfesor} from "../../api/ApiGestionImpresion";

const API_BASE_URL = `${import.meta.env.VITE_API_URL || "http://localhost:3001"}/api/impresiones`;

function ProfesorDashboard({ user }) {
  const idUsuario = user?.id; 

  const [panelActivo, setPanelActivo] = useState(null);

  const [showCrearCurso, setShowCrearCurso] = useState(false);
  const [showSolicitudForm, setShowSolicitudForm] = useState(false);
  const [showSolicitudes, setShowSolicitudes] = useState(false);
  const [solicitudesProfesor, setSolicitudesProfesor] = useState([]);
  const [showCrearGrupo, setShowCrearGrupo] = useState(false);
  const [showGestionEstudiantes, setShowGestionEstudiantes] = useState(false);

  const toggleCreacionCurso = () => { setShowCrearCurso(!showCrearCurso); }; const toggleCreacionGrupo = () => { setShowCrearGrupo(!showCrearGrupo); }; 
  const toggleGestionEstudiantes = () => { setShowGestionEstudiantes(!showGestionEstudiantes); };

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
          onClick={() => {toggleCreacionCurso(); setPanelActivo("crearCurso")}}
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
          onClick={() => {toggleCreacionGrupo(); setPanelActivo("crearGrupo")}}
        />

        <ActionCard
          icon="ti-3d-cube-sphere"
          iconClass="icon-estudiante"
          title="Gestionar estudiantes"
          description="Asigna estudiantes a grupos de tus cursos"
          onClick={() => { toggleGestionEstudiantes(); setPanelActivo("gestionarEstudiantes"); }}
        />
      </div>

      {showCrearCurso && panelActivo === "crearCurso" && (
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

      {panelActivo === "crearGrupo" && (
        <div onClick={(e) => e.stopPropagation()}>
          <CrearGrupo onClose={() => setPanelActivo(null)} />
        </div>
      )}


      {panelActivo === "gestionarEstudiantes" && (
        <div onClick={(e) => e.stopPropagation()}>
          <GestionEstudiantes
            profesorId={user?.id}
            onClose={() => setPanelActivo(null)} />
        </div>
      )}
    </>
  );
}
export default ProfesorDashboard;