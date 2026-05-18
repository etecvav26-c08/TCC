import { useEffect, useState } from 'react'
import api from '../api'

export default function Turmas() {
  const [turmas, setTurmas] = useState([])

  useEffect(() => {
    api.get('/api/turmas').then(({ data }) => setTurmas(data))
  }, [])

  return (
    <div>
      <h1 style={{ fontSize: 28, fontWeight: 500, letterSpacing: -1, marginBottom: 4 }}>Turmas</h1>
      <p style={{ color: '#888', fontSize: 14, marginBottom: 32 }}>{turmas.length} turmas ativas</p>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 16 }}>
        {turmas.map(t => (
          <div key={t.id} style={{
            padding: 24, border: '0.5px solid #e0e0e0', borderRadius: 12,
            borderLeft: '3px solid #000', cursor: 'pointer',
            transition: 'background .15s'
          }}
            onMouseEnter={e => e.currentTarget.style.background = '#fafafa'}
            onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
          >
            <div style={{ fontSize: 16, fontWeight: 500, marginBottom: 4 }}>{t.fullname}</div>
            <div style={{ fontSize: 12, color: '#888', marginBottom: 12 }}>{t.shortname}</div>
            <div style={{ display: 'flex', gap: 8 }}>
              <span style={{ fontSize: 11, padding: '3px 10px', border: '0.5px solid #ddd', borderRadius: 20, color: '#666' }}>
                Ver atividades →
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
