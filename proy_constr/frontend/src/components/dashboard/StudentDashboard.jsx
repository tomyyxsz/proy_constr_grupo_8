// dashboard para estudiante con acciones especificas de estudiante
import { useState } from 'react'
import ActionCard from '../ActionCard'
import SolicitudImpresionForm from '../SolicitudImpresionForm'
import './Dashboard.css'

function StudentDashboard({ user }) {
  const [showSolicitudForm, setShowSolicitudForm] = useState(false)


  const handleSolicitudSuccess = () => {
    console.log('Solicitud enviada exitosamente')
  }

  return (
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
            onClick={() => {}}
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

   
      <SolicitudImpresionForm
        user={user}
        isOpen={showSolicitudForm}
        onClose={() => setShowSolicitudForm(false)}
        onSuccess={handleSolicitudSuccess}
      />
    </div>
  )
}

export default StudentDashboard