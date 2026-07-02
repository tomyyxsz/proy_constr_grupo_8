import { useState } from "react";
import ActionCard from "../ActionCard";
import CrearCurso from "../CreacionCurso";

function ProfesorDashboard() {
  const [showCrearCurso, setShowCrearCurso] = useState(false);

  return (
    <>
      <div className="dashboard-grid">
        <ActionCard
          icon="ti-books"
          title="Crear curso"
          description="Crear curso y cargar estudiantes"
          onClick={() => setShowCrearCurso(true)}
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

      {showCrearCurso && (
        <CrearCurso
          onClose={() => setShowCrearCurso(false)}
        />
      )}
    </>
  );
}

export default ProfesorDashboard;