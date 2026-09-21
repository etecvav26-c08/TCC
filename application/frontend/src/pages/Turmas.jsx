import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../api'

const GREEN = '#3DFF7F'

export default function Turmas() {
  const [turmas, setTurmas] = useState([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    api.get('/api/turmas')
      .then(({ data }) => setTurmas(data))
      .catch(() => setTurmas([
        { id: 1, fullname: 'Matemática', shortname: 'MAT01', summary: 'Álgebra, geometria e cálculo.' },
        { id: 2, fullname: 'Física', shortname: 'FIS01', summary: 'Mecânica e termodinâmica.' },
        { id: 3, fullname: 'Português', shortname: 'POR01', summary: 'Gramática e literatura.' },
        { id: 4, fullname: 'História', shortname: 'HIS01', summary: 'História geral e do Brasil.' },
      ]))
      .finally(() => setLoading(false))
  }, [])

  return (
    <div style={{ fontFamily: "'Inter', system-ui, sans-serif" }}>
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ fontSize: 36, fontWeight: 800, letterSpacing: -1.5, marginBottom: 4, color: '#000' }}>
          Turmas
        </h1>
        <p style={{ color: '#888', fontSize: 14 }}>
          {loading ? 'Carregando...' : `${turmas.length} turma${turmas.length !== 1 ? 's' : ''} ativa${turmas.length !== 1 ? 's' : ''}`}
        </p>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: 60, color: '#aaa', fontSize: 14 }}>Carregando turmas...</div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 12 }}>
          {turmas.map((t, i) => (
            <div
              key={t.id}
              style={{
                border: '1px solid #f0f0f0',
                borderRadius: 12,
                overflow: 'hidden',
                cursor: 'pointer',
                transition: 'transform .12s, box-shadow .12s',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.transform = 'translateY(-2px)'
                e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,.08)'
              }}
              onMouseLeave={e => {
                e.currentTarget.style.transform = 'none'
                e.currentTarget.style.boxShadow = 'none'
              }}
            >
              {/* Topo colorido */}
              <div style={{
                height: 6,
                background: i % 2 === 0 ? '#000' : GREEN,
              }} />

              <div style={{ padding: '20px' }}>
                {/* Sigla */}
                <div style={{
                  width: 40,
                  height: 40,
                  background: '#000',
                  borderRadius: 8,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 13,
                  fontWeight: 700,
                  color: GREEN,
                  marginBottom: 14,
                }}>
                  {t.shortname?.slice(0, 3) || t.fullname?.slice(0, 2)}
                </div>

                <div style={{ fontSize: 16, fontWeight: 700, color: '#000', marginBottom: 6 }}>
                  {t.fullname}
                </div>
                <div style={{ fontSize: 12, color: '#888', marginBottom: 16, lineHeight: 1.5 }}>
                  {t.summary?.replace(/<[^>]*>/g, '').slice(0, 80) || t.shortname}
                </div>

                <div style={{ display: 'flex', gap: 8 }}>
                  <button
                    onClick={() => navigate('/atividades')}
                    style={{
                      flex: 1,
                      padding: '8px',
                      background: '#000',
                      color: '#fff',
                      border: 'none',
                      borderRadius: 6,
                      fontSize: 12,
                      fontWeight: 600,
                      cursor: 'pointer',
                      fontFamily: 'inherit',
                    }}
                  >
                    Atividades
                  </button>
                  <button
                    onClick={() => navigate('/chat')}
                    style={{
                      padding: '8px 12px',
                      background: '#f5f5f5',
                      color: '#555',
                      border: 'none',
                      borderRadius: 6,
                      fontSize: 12,
                      cursor: 'pointer',
                      fontFamily: 'inherit',
                    }}
                  >
                    Chat
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
