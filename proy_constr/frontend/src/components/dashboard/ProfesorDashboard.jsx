import ActionCard from '../ActionCard'

function ProfesorDashboard() {
  return (
    <div className="dashboard-grid">
      <ActionCard
        icon="ti-books"
        title="Mis cursos"
        description="Gestiona tus cursos y secciones"
        onClick={() => {}}
      />
      <ActionCard
        icon="ti-clipboard-check"
        title="Solicitudes pendientes"
        description="Revisa solicitudes que requieren tu aprobación"
        onClick={() => {}}
      />
      <ActionCard
        icon="ti-users"
        title="Gestionar ayudantías"
        description="Asigna y supervisa a tus ayudantes"
        onClick={() => {}}
      />
    </div>
  )
}

export default ProfesorDashboard