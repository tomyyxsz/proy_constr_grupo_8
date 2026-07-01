// dashboard para estudiante con acciones especificas de estudiante
import { useState, useEffect, useCallback } from "react";
import ActionCard from "../ActionCard";
import SolicitudImpresionForm from "../SolicitudImpresionForm";
import "./Dashboard.css";
import SolicitudesEstudiante from "../SolicitudesEstudiante";

const API_BASE_URL = `${import.meta.env.VITE_API_URL || "http://localhost:3001"}/api/impresiones`;

function StudentDashboard({ user }) {
  const [showSolicitudForm, setShowSolicitudForm] = useState(false);
  const [showSolicitudes, setShowSolicitudes] = useState(false);
  const [solicitudesEstudiante, setSolicitudesEstudiante] = useState(null);
  const [error, setError] = useState(null);

  const fetchSolicitudes = useCallback(async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/usuario/${user.id}`); //conexion con el backend
      console.log("URL de la API:", `${API_BASE_URL}/usuario/${user.id}`);
      if (!response.ok) {
        throw new Error("Error al conectar con el servidor");
      }
      const data = await response.json();
      setSolicitudesEstudiante(data);
    } catch (err) {
      setError(err.message);
      setSolicitudesEstudiante([]);
    }
  }, [user.id]);

  useEffect(() => {
    fetchSolicitudes();
  }, [fetchSolicitudes]);

  useEffect(() => {
    if (showSolicitudes) {
      fetchSolicitudes();
    }
  }, [showSolicitudes, fetchSolicitudes]);

  const handleSolicitudSuccess = async () => {
    await fetchSolicitudes();
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
            <ActionCard
              icon="ti-school"
              iconClass="icon-estudiante"
              title="Inscribirse en ayudantía"
              description="Postula a una ayudantía disponible"
              onClick={() => {}}
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

export default StudentDashboard;