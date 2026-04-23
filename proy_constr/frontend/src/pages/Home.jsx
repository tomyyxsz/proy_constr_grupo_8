import { Header } from '../components/Header'
import  Footer  from '../components/Footer'



export default function Home({ user }) {
  return (
    <div>
      <Header />
      <h1>Hola {user.name}</h1> 
      {/* contenido */}
      
      <Footer />
    </div>
  )
}