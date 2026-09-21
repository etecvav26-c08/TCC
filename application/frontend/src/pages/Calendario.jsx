import { useState, useEffect } from 'react'
import api from '../api'

const GREEN = '#3DFF7F'

const tipoConfig = {
  assign: { label: 'Entrega', cor: '#000' },
  quiz: { label: 'Prova', cor: '#7c3aed' },
  user: { label: 'Pessoal', cor: '#2563eb' },
  course: { label: 'Curso', cor: '#059669' },
  default: { label: 'Evento', cor: '#888' },
}

export default function Calendario() {
  const [eventos, setEventos] = useState([])
  const [loading, setLoading] = useState(true)

  const hoje = new Date()
  const mesAtual = hoje.getMonth()
  const anoAtual = hoje.getFullYear()
  const diaHoje = hoje.getDate()

  useEffect(() => {
    api.get('/api/calendario')
      .then(({ data }) => setEventos(data))
      .catch(() => setEventos([
        { id: 1, titulo: 'Entrega — Trabalho de matemática', dia: 19, mes: 'jun', hora: '23:59', tipo: 'assign', curso: 'Matemática', timestamp: Date.now() / 1000 + 86400 },
        { id: 2, titulo: 'Prova de física', dia: 22, mes: 'jun', hora: '14:00', tipo: 'quiz', curso: 'Física', timestamp: Date.now() / 1000 + 4 * 86400 },
        { id: 3, titulo: 'Aula ao vivo — Português', dia: 23, mes: 'jun', hora: '10:00', tipo: 'course', curso: 'Português', timestamp: Date.now() / 1000 + 5 * 86400 },
        { id: 4, titulo: 'Seminário de história', dia: 28, mes: 'jun', hora: '08:00', tipo: 'assign', curso: 'História', timestamp: Date.now() / 1000 + 10 * 86400 },
      ]))
      .finally(() => setLoading(false))
  }, [])

  // Monta o grid do mês
  const primeiroDia = new Date(anoAtual, mesAtual, 1).getDay()
  const diasNoMes = new Date(anoAtual, mesAtual + 1, 0).getDate()
  const diasComEvento = new Set(
    eventos
      .filter(e => {
        const d = new Date(e.timestamp * 1000)
        return d.getMonth() === mesAtual && d.getFullYear() === anoAtual
      })
      .map(e => new Date(e.timestamp * 1000).getDate())
  )

  const nomeMes = hoje.toLocaleString('pt-BR', { month: 'long', year: 'numeric' })

  return (
    <div style={{ fontFamily: "'Inter', system-ui, sans-serif" }}>
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ fontSize: 36, fontWeight: 800, letterSpacing: -1.5, marginBottom: 4, color: '#000' }}>
          Calendário
        </h1>
        <p style={{ color: '#888', fontSize: 14, textTransform: 'capitalize' }}>{nomeMes}</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>

        {/* Grid do mês */}
        <div style={{ border: '1px solid #f0f0f0', borderRadius: 12, padding: '24px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 4, marginBottom: 8 }}>
            {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].map(d => (
              <div key={d} style={{ textAlign: 'center', fontSize: 11, color: '#aaa', padding: '4px 0', fontWeight: 500 }}>
                {d}
              </div>
            ))}
            {Array.from({ length: primeiroDia }).map((_, i) => <div key={`e${i}`} />)}
            {Array.from({ length: diasNoMes }, (_, i) => i + 1).map(d => (
              <div key={d} style={{
                textAlign: 'center',
                fontSize: 13,
                padding: '8px 4px',
                borderRadius: 8,
                cursor: 'pointer',
                position: 'relative',
                background: d === diaHoje ? '#000' : 'transparent',
                color: d === diaHoje ? '#fff' : '#333',
                fontWeight: d === diaHoje ? 700 : 400,
              }}>
                {d}
                {diasComEvento.has(d) && d !== diaHoje && (
                  <div style={{
                    width: 4, height: 4, borderRadius: '50%',
                    background: GREEN,
                    position: 'absolute',
                    bottom: 2, left: '50%', transform: 'translateX(-50%)',
                  }} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Próximos eventos */}
        <div style={{ border: '1px solid #f0f0f0', borderRadius: 12, overflow: 'hidden' }}>
          <div style={{ padding: '16px 20px', borderBottom: '1px solid #f5f5f5', fontSize: 13, fontWeight: 600, color: '#000' }}>
            Próximos eventos
          </div>
          {loading ? (
            <div style={{ padding: 24, color: '#aaa', fontSize: 13 }}>Carregando...</div>
          ) : eventos.length === 0 ? (
            <div style={{ padding: 24, color: '#aaa', fontSize: 13 }}>Nenhum evento próximo</div>
          ) : (
            eventos.slice(0, 5).map((e, i) => {
              const config = tipoConfig[e.tipo] || tipoConfig.default
              return (
                <div key={e.id} style={{
                  display: 'flex',
                  gap: 14,
                  padding: '14px 20px',
                  borderBottom: i < Math.min(eventos.length, 5) - 1 ? '1px solid #f5f5f5' : 'none',
                  alignItems: 'center',
                }}>
                  <div style={{
                    minWidth: 40,
                    textAlign: 'center',
                    background: '#000',
                    borderRadius: 8,
                    padding: '6px 4px',
                  }}>
                    <div style={{ fontSize: 18, fontWeight: 800, color: GREEN, letterSpacing: -1, lineHeight: 1 }}>{e.dia}</div>
                    <div style={{ fontSize: 10, color: '#555' }}>{e.mes}</div>
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 13, fontWeight: 500, color: '#000', marginBottom: 3 }}>{e.titulo}</div>
                    <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                      <span style={{ fontSize: 11, color: '#888' }}>{e.hora}</span>
                      {e.curso && <span style={{ fontSize: 11, color: '#aaa' }}>· {e.curso}</span>}
                    </div>
                  </div>
                  <div style={{
                    fontSize: 10,
                    padding: '3px 8px',
                    borderRadius: 20,
                    background: config.cor,
                    color: config.cor === '#000' ? GREEN : '#fff',
                    fontWeight: 600,
                    whiteSpace: 'nowrap',
                  }}>
                    {config.label}
                  </div>
                </div>
              )
            })
          )}
        </div>

      </div>
    </div>
  )
}
