import './App.css'
import { useState } from 'react'
import InicioSesion from './InicioSesion'


function App() {
  const [count, setCount] = useState(0)


  return (
    <div>
      <h1>Hola Mundo</h1>
      <p>Contador: {count}</p>
      <button onClick={() => setCount(count + 1)}>
        Incrementar
      </button>
      <InicioSesion />
    </div>
  )
}

export default App