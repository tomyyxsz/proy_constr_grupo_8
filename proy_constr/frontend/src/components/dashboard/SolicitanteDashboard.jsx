// dashboard para solicitante, no tiene tantas acciones como un estudiante, no deberia
// poder ver cursos (no esta inscrito a ninguno) pero si sus solicitudes de impresion
import { useState, useEffect } from "react";
import ActionCard from "../ActionCard";
import SolicitudImpresionForm from "../SolicitudImpresionForm";
import "./Dashboard.css";
import SolicitudesEstudiante from "../SolicitudesEstudiante";

const API_BASE_URL = `${import.meta.env.VITE_API_URL || "http://localhost:3001"}/api/impresiones`;

function SolicitanteDashboard({ user }) {
  const [showSolicitudForm, setShowSolicitudForm] = useState(false);
  const [showSolicitudes, setShowSolicitudes] = useState(false);
  const [solicitudesEstudiante, setSolicitudesEstudiante] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSolicitudes = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/estudiante/${user.id}`); //conexion con el backend
        console.log("URL de la API:", `${API_BASE_URL}/estudiante/${user.id}`);
        if (!response.ok) {
          throw new Error("Error al conectar con el servidor");
        }
        const data = await response.json();
        setSolicitudesEstudiante(data);
      } catch (err) {
        setError(err.message);
        setSolicitudesEstudiante([]);
      }
    };

    fetchSolicitudes();
  }, [user.id]);

  const handleSolicitudSuccess = () => {
    console.log("Solicitud enviada exitosamente");
  };

  return (
    <>
      {error && (
        <div
          style={{
            color: "red",
            padding: "10px",
            backgroundColor: "#fde8e8",
            marginBottom: "15px",
            borderRadius: "5px",
          }}
        >
          No se pudieron sincronizar los datos: {error}
        </div>
      )}

      <div className="dashboard-with-panel">
        <div className="dashboard-main">
          <div className="dashboard-grid">
            <ActionCard
              icon="ti-3d-cube-sphere"
              iconClass="icon-estudiante"
              title="Solicitar impresión"
              description="Crea una nueva solicitud de impresión 3D"
              onClick={() => setShowSolicitudForm(true)}
            />
            <ActionCard
              icon="ti-clipboard-list"
              iconClass="icon-estudiante"
              title="Mis solicitudes"
              description="Revisa el estado de tus solicitudes"
              onClick={() => setShowSolicitudes(true)}
            />
          </div>
        </div>

        {showSolicitudes && (
          <SolicitudesEstudiante
            onClose={() => setShowSolicitudes(false)}
            solicitudes={solicitudesEstudiante}
          />
        )}
        {showSolicitudForm && (
          <SolicitudImpresionForm
            user={user}
            isOpen={showSolicitudForm}
            onClose={() => setShowSolicitudForm(false)}
            onSuccess={handleSolicitudSuccess}
          />
        )}
      </div>
    </>
  );
}

export default SolicitanteDashboard;
