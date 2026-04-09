import './App.css'
import { useState } from 'react'
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
      </div>
    </>
  )
}

export default App
