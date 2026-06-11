import { useState } from 'react'
import ActionCard from '../ActionCard'


function AyudanteDashboard({ solicitudes = null }) {
  const [showSolicitudes, setShowSolicitudes] = useState(false)

  return (
    <>
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
        <SolicitudesAyudanteModal
          onClose={() => setShowSolicitudes(false)}
          solicitudes={solicitudes}
        />
      )}
    </>
  )
}

export default AyudanteDashboard