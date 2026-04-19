import './App.css'
import Footer from './Footer'
import { useState } from 'react'
import InicioSesion from './InicioSesion'

import { Header } from './Header'


function App() {
  const [count, setCount] = useState(0)


  return (
    <>
      <Header isAuthenticated={false} />
    
      <div>
        <h1>Hola Mundo</h1>
        <p>Contador: {count}</p>
        <button onClick={() => setCount(count + 1)}>
        Incrementar
      </button>
      <Footer />
      <InicioSesion />

    </div>
        </button>
      </div>
    </>
  )
}

export default App