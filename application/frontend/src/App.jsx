import { useState } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Turmas from './pages/Turmas'
import ProfessorTurmas from './pages/ProfessorTurmas'
import CoordenadorPainel from './pages/CoordenadorPainel'
import Atividades from './pages/Atividades'
import Notas from './pages/Notas'
import Chat from './pages/Chat'
import Calendario from './pages/Calendario'
import Feedbacks from './pages/Feedbacks'
import Layout from './components/Layout'

export default function App() {
  const [usuario, setUsuario] = useState(null)

  function logout() {
    sessionStorage.removeItem('token')
    setUsuario(null)
  }

  if (!usuario) return <Login onLogin={setUsuario} />

  const papel = usuario?.papel || 'aluno'

  return (
    <BrowserRouter>
      <Layout usuario={usuario} onLogout={logout}>
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" />} />

          <Route path="/dashboard" element={<Dashboard usuario={usuario} />} />

          <Route path="/turmas" element={
            papel === 'professor' ? <ProfessorTurmas /> :
            papel === 'coordenador' ? <CoordenadorPainel /> :
            <Turmas />
          } />

          <Route path="/avaliar" element={
            papel === 'professor' || papel === 'coordenador'
              ? <ProfessorTurmas />
              : <Navigate to="/dashboard" />
          } />

          <Route path="/atividades" element={<Atividades usuario={usuario} />} />
          <Route path="/notas" element={<Notas />} />
          <Route path="/chat" element={<Chat usuario={usuario} />} />
          <Route path="/calendario" element={<Calendario />} />
          <Route path="/feedbacks" element={<Feedbacks />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  )
}