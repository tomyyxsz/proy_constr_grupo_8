import './App.css'
import Footer from './Footer'
import { useState } from 'react'


function App() {
  const [count, setCount] = useState(0)


  return (
    <div>
      <h1>Hola Mundo</h1>
      <p>Contador: {count}</p>
      <button onClick={() => setCount(count + 1)}>
        Incrementar
      </button>
      <Footer />
    </div>
  )
}

export default App
