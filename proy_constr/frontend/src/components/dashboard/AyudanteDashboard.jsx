import { useState, useEffect } from 'react'
import ActionCard from '../ActionCard'
import SolicitudesAyudante from '../SolicitudesAyudante'
import {obtenerTodasLasSolicitudes} from "../../api/ApiGestionImpresion.js";

function AyudanteDashboard( ) {
  const [showSolicitudes, setShowSolicitudes] = useState(false)
  const [solicitudes, setSolicitudes] = useState(null) 
  const [error, setError] = useState(null)
  const API_BASE_URL = `${import.meta.env.VITE_API_URL || "http://localhost:3001"}/api/impresiones`;


  const rawUser = localStorage.getItem('user');
  const usuarioLogueado = rawUser ? JSON.parse(rawUser) : null;
  useEffect(() => {
    const fetchDatos = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}`) //conexion con el backend
        if (!response.ok) {
          throw new Error('Error al conectar con el servidor')//lanzar error
        }

        const data = await response.json()
        setSolicitudes(data) //Guardamos los datos en el estado
      } catch (err) {
        setError(err.message)
        setSolicitudes([]) // no queda cargando para siempre
      }
    }

    fetchDatos()
  }) 

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

      <div className="dashboard-grid">
        <ActionCard
          icon="ti-3d-cube-sphere"
          title="Mis solicitudes"
          description="Filtrar y gestionar solicitudes de impresion 3D"
          onClick={() => setShowSolicitudes(true)}
        />
        <ActionCard
          icon="ti-filter"
          title="Filtrar solicitudes"
          description="Ver todas las solicitudes pendientes"
          onClick={() => setShowSolicitudes(true)}
        />
        <ActionCard
          icon="ti-calendar"
          title="Reservas de sala"
          description=" "
          onClick={() => {}}
        />
      </div>

      {showSolicitudes && (
        <SolicitudesAyudante
          onClose={() => setShowSolicitudes(false)}
          solicitudes={solicitudes} // Le pasamos los datos reales cargados de la API
          onRefresh={async () => {
            // funcion para refrescar datos despues de aprobar/rechazar solicitud
            try {
              const dataActualizada = await obtenerTodasLasSolicitudes();
              console.log("Datos actualizados después de la acción:", dataActualizada);
              setSolicitudes(dataActualizada);
            } catch (err) {
              setError("Error al refrescar los datos: " + err.message);
            }
          }}
          idAyudante = {usuarioLogueado?.id} // Pasamos el ID del ayudante logueado para las acciones de aprobar/rechazar
        />
      )}
    </>
  );
}

export default AyudanteDashboard