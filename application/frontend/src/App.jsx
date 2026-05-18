import { useState } from 'react'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'

export default function App() {
  const [usuario, setUsuario] = useState(null)

  if (!usuario) return <Login onLogin={setUsuario} />
  return <Dashboard usuario={usuario} />
}
