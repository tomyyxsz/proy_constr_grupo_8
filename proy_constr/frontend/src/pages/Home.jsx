import { Header } from '../components/Header'
import Footer from '../components/Footer'
import StudentDashboard from '../components/dashboard/StudentDashboard'
import AyudanteDashboard from '../components/dashboard/AyudanteDashboard'
import ProfesorDashboard from '../components/dashboard/ProfesorDashboard'
import './Home.css'

const DASHBOARDS = {
  ESTUDIANTE: StudentDashboard,
  AYUDANTE: AyudanteDashboard,
  PROFESOR: ProfesorDashboard,
}

function Home({ user, onLogout}) {
  const DashboardComponent = DASHBOARDS[user?.role]

  return (
    <div className="home-page">
      <Header user={user} onLogout={onLogout} />
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
      <Footer />
    </div>
  )
}

export default Home