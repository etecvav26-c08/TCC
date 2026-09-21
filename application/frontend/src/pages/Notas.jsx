import { useState, useEffect } from 'react'
import api from '../api'

const GREEN = '#3DFF7F'

function BarNotaRelativa({ valor, media }) {
  if (!media || media === 0) return null

  // Quanto essa nota representa da sua média? 100% = exatamente na média
  const razao = (valor / media) * 100
  const pct = Math.min(razao, 100) // barra cheia = 100%+

  // Cor: acima da média = verde, na média = preto, abaixo = vermelho
  let cor = '#000'
  if (razao > 105) cor = GREEN
  else if (razao < 85) cor = '#ef4444'
  else if (razao < 95) cor = '#f59e0b'

  return (
    <div style={{ height: 4, background: '#f0f0f0', borderRadius: 2, marginTop: 6, position: 'relative' }}>
      {/* Marca da média no meio (só referência visual) */}
      <div style={{
        position: 'absolute', left: '50%', top: 0, bottom: 0,
        width: 1, background: '#ddd',
      }} />
      <div style={{
        height: 4, background: cor, borderRadius: 2,
        width: `${pct}%`, transition: 'width .4s ease',
      }} />
    </div>
  )
}

export default function Notas() {
  const [notas, setNotas] = useState([])
  const [loading, setLoading] = useState(true)
  const [selecionado, setSelecionado] = useState(null)

  useEffect(() => {
    api.get('/api/notas')
      .then(({ data }) => { setNotas(data); if (data.length > 0) setSelecionado(data[0].curso) })
      .catch(() => setNotas([]))
      .finally(() => setLoading(false))
  }, [])

  const cursosComNota = notas.filter(n => n.notaNum > 0)
  const mediaNum = cursosComNota.length > 0
    ? cursosComNota.reduce((s, n) => s + n.notaNum, 0) / cursosComNota.length
    : 0
  const mediaStr = cursosComNota.length > 0 ? mediaNum.toFixed(1).replace('.', ',') : '—'

  const cursoAtivo = notas.find(n => n.curso === selecionado)

  return (
    <div style={{ fontFamily: "'Inter', system-ui, sans-serif" }}>
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ fontSize: 36, fontWeight: 800, letterSpacing: -1.5, marginBottom: 4, color: '#000' }}>
          Notas
        </h1>
        <p style={{ color: '#888', fontSize: 14 }}>Comparação com a sua média geral</p>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: 60, color: '#aaa', fontSize: 14 }}>Carregando notas...</div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>

          {/* Card preto: média geral */}
          <div style={{
            background: '#000', borderRadius: 12, padding: '32px',
            gridColumn: '1 / -1', display: 'flex',
            alignItems: 'center', justifyContent: 'space-between',
          }}>
            <div>
              <div style={{ fontSize: 13, color: '#555', marginBottom: 8, textTransform: 'uppercase', letterSpacing: 1 }}>
                Média geral
              </div>
              <div style={{ fontSize: 72, fontWeight: 800, color: GREEN, letterSpacing: -4, lineHeight: 1 }}>
                {mediaStr}
              </div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: 13, color: '#555', marginBottom: 12 }}>{notas.length} disciplinas</div>
              <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end', flexWrap: 'wrap' }}>
                {notas.map(n => (
                  <div key={n.curso} style={{
                    padding: '4px 12px', border: '1px solid #222',
                    borderRadius: 20, fontSize: 12, color: '#666',
                  }}>
                    {n.shortname}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Lista de disciplinas */}
          <div style={{ border: '1px solid #f0f0f0', borderRadius: 12, overflow: 'hidden' }}>
            {notas.map((n, i) => (
              <div
                key={n.curso}
                onClick={() => setSelecionado(n.curso)}
                style={{
                  padding: '16px 20px',
                  borderBottom: i < notas.length - 1 ? '1px solid #f5f5f5' : 'none',
                  cursor: 'pointer',
                  background: selecionado === n.curso ? '#fafafa' : 'transparent',
                  borderLeft: selecionado === n.curso ? `3px solid ${GREEN}` : '3px solid transparent',
                  transition: 'all .1s',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                  <span style={{ fontSize: 14, fontWeight: 500, color: '#000' }}>{n.curso}</span>
                  <span style={{ fontSize: 18, fontWeight: 700, color: '#000' }}>{n.nota || '—'}</span>
                </div>
                <BarNotaRelativa valor={n.notaNum} media={mediaNum} />
              </div>
            ))}
          </div>

          {/* Detalhe da disciplina selecionada */}
          <div style={{ border: '1px solid #f0f0f0', borderRadius: 12, padding: '24px' }}>
            {cursoAtivo ? (
              <>
                <div style={{ fontSize: 14, fontWeight: 600, color: '#000', marginBottom: 20 }}>
                  {cursoAtivo.curso}
                </div>
                {cursoAtivo.itens.length > 0 ? (
                  cursoAtivo.itens.map((item, i) => (
                    <div key={i} style={{ marginBottom: 16 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                        <span style={{ fontSize: 13, color: '#555' }}>{item.nome}</span>
                        <span style={{ fontSize: 13, fontWeight: 600, color: '#000' }}>{item.nota}</span>
                      </div>
                      <BarNotaRelativa valor={item.notaNum} media={mediaNum} />
                    </div>
                  ))
                ) : (
                  <div style={{ color: '#aaa', fontSize: 13 }}>Nenhuma atividade avaliada ainda.</div>
                )}
              </>
            ) : (
              <div style={{ color: '#aaa', fontSize: 13 }}>Selecione uma disciplina</div>
            )}
          </div>

        </div>
      )}
    </div>
  )
}