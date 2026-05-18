import { useEffect, useState } from 'react'
import api from '../api'

export default function Dashboard({ usuario }) {
  const [turmas, setTurmas] = useState([])

  useEffect(() => {
    api.get('/api/turmas').then(({ data }) => setTurmas(data))
  }, [])

  return (
    <div style={{ padding: 32, maxWidth: 900, margin: '0 auto' }}>
      <h1 style={{ fontSize: 28, fontWeight: 500, marginBottom: 4 }}>
        Olá, {usuario.nome}
      </h1>
      <p style={{ color: '#888', fontSize: 14, marginBottom: 32 }}>Bem-vindo de volta</p>
      <h2 style={{ fontSize: 16, fontWeight: 500, marginBottom: 16 }}>Suas turmas</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16 }}>
        {turmas.map(t => (
          <div key={t.id} style={{ padding: 20, border: '0.5px solid #e0e0e0', borderRadius: 12 }}>
            <div style={{ fontSize: 15, fontWeight: 500, marginBottom: 4 }}>{t.fullname}</div>
            <div style={{ fontSize: 12, color: '#888' }}>{t.shortname}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
