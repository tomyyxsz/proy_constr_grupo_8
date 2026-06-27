import StudentDashboard from '../components/dashboard/StudentDashboard'
import AyudanteDashboard from '../components/dashboard/AyudanteDashboard'
import ProfesorDashboard from '../components/dashboard/ProfesorDashboard'
import SolicitanteDashboard from '../components/dashboard/SolicitanteDashboard'
import './Home.css'

const DASHBOARDS = {
  ESTUDIANTE: StudentDashboard,
  AYUDANTE: AyudanteDashboard,
  PROFESOR: ProfesorDashboard,
  SOLICITANTE: SolicitanteDashboard,
}

function Home({ user}) {
  const DashboardComponent = DASHBOARDS[user?.role]

  return (
    <div className="home-page">
      <div className="home-wrapper">
        <div className="home-welcome">
          <div className="home-welcome-info">
            <h2>Hola, {user?.name}</h2>
            <span className={`home-role-badge role-${user?.role?.toLowerCase()}`}>
              {user?.role}
            </span>
          </div>
        </div>
        {DashboardComponent
          ? <DashboardComponent user={user} />
          : <p className="home-role-error">Rol no reconocido: {user?.role}</p>
        }
      </div>
    </div>
  )
}

export default Home