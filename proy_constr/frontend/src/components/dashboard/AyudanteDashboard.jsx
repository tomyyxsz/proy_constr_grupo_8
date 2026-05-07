import ActionCard from '../ActionCard'

function AyudanteDashboard() {
  return (
    <div className="dashboard-grid">
      <ActionCard
        icon="ti-3d-cube-sphere"
        title="Solicitudes de impresión"
        description=" "
        onClick={() => {}}
      />
      <ActionCard
        icon="ti-filter"
        title="Filtrar solicitudes"
        description=" "
        onClick={() => {}}
      />
      <ActionCard
        icon="ti-calendar"
        title="Reservas de sala"
        description=" "
        onClick={() => {}}
      />
    </div>
  )
}

export default AyudanteDashboard