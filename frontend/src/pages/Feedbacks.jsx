import { useState, useEffect } from 'react'
import api from '../api'

const GREEN = '#3DFF7F'

// Define a cor da nota: verde (≥7), amarelo (5-6.9) ou vermelho (<5)
function corDaNota(notaStr) {
  const numero = parseFloat(String(notaStr).replace(',', '.'))
  if (isNaN(numero)) return '#888'
  if (numero >= 7) return GREEN
  if (numero >= 5) return '#f59e0b'
  return '#ef4444'
}

export default function Feedbacks() {
  const [feedbacks, setFeedbacks] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get('/api/atividades')
      .then(({ data }) => {
        // Só interessam as atividades corrigidas que têm nota ou feedback
        const corrigidas = data.filter(
          a => a.status === 'corrigido' && (a.nota || a.feedback)
        )
        setFeedbacks(corrigidas)
      })
      .catch(() => setFeedbacks([]))
      .finally(() => setLoading(false))
  }, [])

  // Média das notas (ignora feedbacks sem nota)
  const notasValidas = feedbacks
    .map(f => parseFloat(String(f.nota).replace(',', '.')))
    .filter(n => !isNaN(n))
  const media = notasValidas.length > 0
    ? (notasValidas.reduce((s, n) => s + n, 0) / notasValidas.length).toFixed(1).replace('.', ',')
    : null

  return (
    <div style={{ fontFamily: "'Inter', system-ui, sans-serif" }}>

      {/* Cabeçalho */}
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ fontSize: 36, fontWeight: 800, letterSpacing: -1.5, marginBottom: 4, color: '#000' }}>
          Feedbacks
        </h1>
        <p style={{ color: '#888', fontSize: 14 }}>
          {loading
            ? 'Carregando...'
            : feedbacks.length === 0
              ? 'Nenhum feedback recebido ainda'
              : `${feedbacks.length} feedback${feedbacks.length > 1 ? 's' : ''} recebido${feedbacks.length > 1 ? 's' : ''}`}
        </p>
      </div>

      {/* Estado de carregamento */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: 60, color: '#aaa', fontSize: 14 }}>
          Carregando feedbacks...
        </div>
      ) : feedbacks.length === 0 ? (
        /* Estado vazio */
        <div style={{ textAlign: 'center', padding: 60, color: '#aaa', fontSize: 14 }}>
          <div style={{ fontSize: 40, marginBottom: 12 }}>📭</div>
          <div>Quando um professor corrigir uma atividade sua,</div>
          <div>o feedback aparece aqui.</div>
        </div>
      ) : (
        <>
          {/* Card de destaque: média + total */}
          <div style={{
            background: '#000',
            borderRadius: 12,
            padding: '28px 32px',
            marginBottom: 16,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
            <div>
              <div style={{
                fontSize: 11, color: '#666',
                textTransform: 'uppercase', letterSpacing: 1.2,
                marginBottom: 10,
              }}>
                Média das correções
              </div>
              <div style={{
                fontSize: 56, fontWeight: 800, color: GREEN,
                letterSpacing: -3, lineHeight: 1,
              }}>
                {media || '—'}
              </div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{
                fontSize: 11, color: '#666',
                textTransform: 'uppercase', letterSpacing: 1.2,
                marginBottom: 10,
              }}>
                Total de feedbacks
              </div>
              <div style={{
                fontSize: 56, fontWeight: 800, color: '#fff',
                letterSpacing: -3, lineHeight: 1,
              }}>
                {feedbacks.length}
              </div>
            </div>
          </div>

          {/* Lista de feedbacks */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {feedbacks.map(f => {
              const cor = corDaNota(f.nota)
              return (
                <div
                  key={f.id}
                  style={{
                    border: '1px solid #f0f0f0',
                    borderRadius: 12,
                    padding: 24,
                    borderLeft: `4px solid ${cor}`,
                    background: '#fff',
                  }}
                >
                  {/* Topo: nome da atividade + curso + nota */}
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    gap: 20,
                    marginBottom: f.feedback ? 14 : 0,
                  }}>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{
                        fontSize: 16, fontWeight: 700, color: '#000',
                        marginBottom: 4, letterSpacing: -0.3,
                      }}>
                        {f.name}
                      </div>
                      <div style={{ fontSize: 12, color: '#888' }}>
                        {f.curso}
                      </div>
                    </div>
                    <div style={{ textAlign: 'right', flexShrink: 0 }}>
                      <div style={{
                        fontSize: 36, fontWeight: 800, color: cor,
                        letterSpacing: -2, lineHeight: 1,
                      }}>
                        {f.nota || '—'}
                      </div>
                      <div style={{
                        fontSize: 10, color: '#aaa',
                        textTransform: 'uppercase', letterSpacing: 1,
                        marginTop: 4,
                      }}>
                        Nota
                      </div>
                    </div>
                  </div>

                  {/* Feedback do professor */}
                  {f.feedback ? (
                    <div style={{
                      padding: '14px 18px',
                      background: '#fafafa',
                      borderRadius: 8,
                      fontSize: 13,
                      color: '#444',
                      lineHeight: 1.6,
                      borderLeft: `3px solid ${cor}`,
                    }}>
                      "{f.feedback}"
                    </div>
                  ) : (
                    <div style={{
                      fontSize: 13,
                      color: '#aaa',
                      fontStyle: 'italic',
                    }}>
                      Sem comentário do professor.
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </>
      )}
    </div>
  )
}