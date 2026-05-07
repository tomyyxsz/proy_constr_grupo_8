import ActionCard from '../ActionCard'
import './Dashboard.css'

function StudentDashboard() {
  return (
    <div className="dashboard-grid">
      <ActionCard
        icon="ti-printer"
        iconClass="icon-estudiante"
        title="Solicitar impresión"
        description="Envía una nueva solicitud de impresión 3D"
        onClick={() => {/* navegar a solicitud */}}
      />
      <ActionCard
        icon="ti-list"
        title="Mis solicitudes"
        description="Revisa el estado de tus solicitudes"
        onClick={() => {}}
      />
      <ActionCard
        icon="ti-school"
        title="Inscribirse en ayudantía"
        description="Explora y postula a ayudantías disponibles"
        onClick={() => {}}
      />
    </div>
  )
}

export default StudentDashboard