import { useEffect, useState } from 'react'
import api from '../api'

const GREEN = '#3DFF7F'

function StatCard({ numero, label, destaque }) {
  return (
    <div style={{
      padding: '24px',
      background: destaque ? GREEN : '#000',
      borderRadius: 12,
      border: destaque ? 'none' : '1px solid #f0f0f0',
    }}>
    <div style={{
      fontSize: 42,
      fontWeight: 800,
      letterSpacing: -2,
      color: destaque ? '#000' : GREEN,
      lineHeight: 1,
      marginBottom: 8,
    }}>
        {numero}
      </div>
      <div style={{
        fontSize: 12,
        color: destaque ? '#000' : '#888',
        fontWeight: destaque ? 600 : 400,
        textTransform: 'uppercase',
        letterSpacing: 0.8,
      }}>
        {label}
      </div>
    </div>
  )
}

export default function Dashboard({ usuario }) {
  const [turmas, setTurmas] = useState([])
  const [atividades, setAtividades] = useState([])
  const [media, setMedia] = useState('—')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      api.get('/api/turmas').then(r => r.data).catch(() => []),
      api.get('/api/atividades').then(r => r.data).catch(() => []),
      api.get('/api/notas').then(r => r.data).catch(() => []),
    ]).then(([turmasData, atividadesData, notasData]) => {
      setTurmas(turmasData)
      setAtividades(atividadesData)

      const comNota = notasData.filter(n => n.notaNum > 0)
      if (comNota.length > 0) {
        const m = comNota.reduce((s, n) => s + n.notaNum, 0) / comNota.length
        setMedia(m.toFixed(1).replace('.', ','))
      }
    }).finally(() => setLoading(false))
  }, [])

  const hora = new Date().getHours()
  const saudacao = hora < 12 ? 'Bom dia' : hora < 18 ? 'Boa tarde' : 'Boa noite'

  const pendentes = atividades.filter(a => a.status === 'pendente')
  const proximas = pendentes.slice(0, 3)

  // Pega até 4 atividades recentes (entregues ou corrigidas) pra "Atividade recente"
  const recentes = atividades
    .filter(a => a.status === 'entregue' || a.status === 'corrigido')
    .slice(0, 4)

  return (
    <div style={{ fontFamily: "'Inter', system-ui, sans-serif" }}>

      {/* Header */}
      <div style={{ marginBottom: 40 }}>
        <div style={{
          display: 'inline-block',
          background: '#f5f5f5',
          borderRadius: 20,
          padding: '4px 12px',
          fontSize: 12,
          color: '#888',
          marginBottom: 12,
        }}>
          {new Date().toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' })}
        </div>
        <h1 style={{
          fontSize: 40,
          fontWeight: 800,
          color: '#000',
          letterSpacing: -2,
          lineHeight: 1.1,
          margin: 0,
        }}>
          {saudacao},<br />{usuario?.nome?.split(' ')[0]}
        </h1>
      </div>

      {/* Stats */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: 12,
        marginBottom: 32,
      }}>
        <StatCard numero={loading ? '—' : turmas.length} label="Turmas ativas" destaque />
        <StatCard numero={loading ? '—' : pendentes.length} label="Entregas pendentes" />
        <StatCard numero={loading ? '—' : media} label="Média geral" />
        <StatCard numero="—" label="Novas mensagens" />
      </div>

      {/* Grid principal */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>

        {/* Próximas entregas */}
        <div style={{
          background: '#000',
          borderRadius: 12,
          padding: '24px',
          color: '#fff',
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 20,
          }}>
            <span style={{ fontSize: 14, fontWeight: 600 }}>Próximas entregas</span>
            <span style={{
              fontSize: 11,
              background: '#111',
              padding: '3px 10px',
              borderRadius: 20,
              color: '#666',
            }}>esta semana</span>
          </div>

          {loading ? (
            <div style={{ fontSize: 13, color: '#555', padding: '12px 0' }}>Carregando...</div>
          ) : proximas.length === 0 ? (
            <div style={{ fontSize: 13, color: '#555', padding: '12px 0' }}>
              🎉 Nenhuma entrega pendente!
            </div>
          ) : (
            proximas.map((a, i) => {
              const duetimestamp = a.duetimestamp
              const agora = Date.now() / 1000
              const diasRestantes = duetimestamp ? Math.ceil((duetimestamp - agora) / 86400) : null
              const urgente = diasRestantes !== null && diasRestantes <= 2

              return (
                <div key={a.id} style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                  padding: '12px 0',
                  borderTop: i > 0 ? '1px solid #111' : 'none',
                }}>
                  <div style={{
                    width: 6,
                    height: 6,
                    borderRadius: '50%',
                    background: urgente ? GREEN : '#444',
                    flexShrink: 0,
                  }} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 13, color: '#fff', marginBottom: 2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{a.name}</div>
                    <div style={{ fontSize: 11, color: '#555' }}>{a.curso} · {a.duedate}</div>
                  </div>
                  {urgente && (
                    <span style={{
                      fontSize: 10,
                      background: GREEN,
                      color: '#000',
                      borderRadius: 20,
                      padding: '2px 8px',
                      fontWeight: 700,
                      flexShrink: 0,
                    }}>{diasRestantes === 0 ? 'hoje' : diasRestantes === 1 ? 'amanhã' : `${diasRestantes}d`}</span>
                  )}
                </div>
              )
            })
          )}
        </div>

        {/* Turmas */}
        <div style={{
          border: '1px solid #f0f0f0',
          borderRadius: 12,
          padding: '24px',
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 20,
          }}>
            <span style={{ fontSize: 14, fontWeight: 600, color: '#000' }}>Suas turmas</span>
          </div>

          {loading ? (
            <div style={{ fontSize: 13, color: '#aaa', padding: '12px 0' }}>Carregando...</div>
          ) : turmas.length === 0 ? (
            <div style={{ fontSize: 13, color: '#aaa', padding: '12px 0' }}>Nenhuma turma encontrada</div>
          ) : (
            turmas.slice(0, 3).map((t, i) => (
              <div key={t.id} style={{
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                padding: '12px 0',
                borderTop: i > 0 ? '1px solid #f5f5f5' : 'none',
              }}>
                <div style={{
                  width: 36,
                  height: 36,
                  background: '#000',
                  borderRadius: 8,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 12,
                  fontWeight: 700,
                  color: GREEN,
                  flexShrink: 0,
                }}>
                  {t.shortname?.slice(0, 2) || t.fullname?.slice(0, 2)}
                </div>
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontSize: 13, fontWeight: 500, color: '#000', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{t.fullname}</div>
                  <div style={{ fontSize: 11, color: '#888' }}>{t.shortname}</div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Atividade recente */}
        <div style={{
          border: '1px solid #f0f0f0',
          borderRadius: 12,
          padding: '24px',
          gridColumn: '1 / -1',
        }}>
          <div style={{ fontSize: 14, fontWeight: 600, color: '#000', marginBottom: 16 }}>
            Atividade recente
          </div>
          {loading ? (
            <div style={{ fontSize: 13, color: '#aaa' }}>Carregando...</div>
          ) : recentes.length === 0 ? (
            <div style={{ fontSize: 13, color: '#aaa' }}>Nada por aqui ainda. Entregue uma atividade pra começar.</div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
              {recentes.map((a) => (
                <div key={a.id} style={{
                  padding: '16px',
                  background: a.status === 'corrigido' ? '#f0fff4' : '#f8f8f8',
                  borderRadius: 10,
                  borderLeft: a.status === 'corrigido' ? `3px solid ${GREEN}` : 'none',
                }}>
                  <div style={{ fontSize: 12, color: '#000', marginBottom: 6, lineHeight: 1.4, fontWeight: 500 }}>
                    {a.name}
                  </div>
                  <div style={{ fontSize: 11, color: '#888', marginBottom: 4 }}>{a.curso}</div>
                  <div style={{ fontSize: 10, color: a.status === 'corrigido' ? '#15803d' : '#aaa', fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.5 }}>
                    {a.status === 'corrigido' ? `Corrigida${a.nota ? ` · ${a.nota}` : ''}` : 'Entregue'}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}