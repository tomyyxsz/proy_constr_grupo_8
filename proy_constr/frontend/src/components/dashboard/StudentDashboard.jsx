import ActionCard from '../ActionCard'
import './Dashboard.css'

function StudentDashboard() {
  return (
    <div className="dashboard-grid">
      <ActionCard
        
        iconClass="icon-estudiante"
        title="Solicitar impresión"
        description=" "
        onClick={() => {}}
      />
      <ActionCard
        
        title="Mis solicitudes"
        description="Revisa el estado de tus solicitudes"
        onClick={() => {}}
      />
      <ActionCard
        
        title="Inscribirse en ayudantía"
        description=" "
        onClick={() => {}}
      />
    </div>
  )
}

export default StudentDashboard