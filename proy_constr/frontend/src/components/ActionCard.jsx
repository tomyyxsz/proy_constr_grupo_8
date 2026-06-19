//Tarjeta de accion para el dashboard recibe icono titulo descricion y una fucion de clic 
const ActionCard = ({ icon, iconClass = '', title, description, onClick }) => {
  return (
    <button className="action-card" onClick={onClick}>
      <span className={`action-card-icon ${iconClass}`}>
        <i className={`ti ${icon}`} />
      </span>
      <h3>{title}</h3>
      <p>{description}</p>
    </button>
  )
}
export default ActionCard