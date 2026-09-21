import { useState, useEffect, useRef } from 'react'
import api from '../api'

const GREEN = '#3DFF7F'
const badge = {
  pendente: { background: '#fff8e1', color: '#b45309', border: '1px solid #fcd34d' },
  entregue: { background: '#f0fdf4', color: '#15803d', border: '1px solid #86efac' },
  corrigido: { background: '#f5f5f5', color: '#555', border: '1px solid #ddd' },
}

export default function Atividades({ usuario }) {
  const [atividades, setAtividades] = useState([])
  const [loading, setLoading] = useState(true)
  const [filtro, setFiltro] = useState('todos')
  const [enviando, setEnviando] = useState(null)
  const [sucesso, setSucesso] = useState(null)
  const [erro, setErro] = useState(null)
  const [aberta, setAberta] = useState(null)
  const fileRef = useRef()

  useEffect(() => { carregarAtividades() }, [])

  async function carregarAtividades() {
    setLoading(true)
    try {
      const { data } = await api.get('/api/atividades')
      setAtividades(data)
    } catch {
      setAtividades([
        { id: 1, name: 'Trabalho de matemática', duedate: '19/06', status: 'pendente', curso: 'Matemática', descricao: 'Resolver os exercícios do capítulo 3.' },
        { id: 2, name: 'Relatório de física', duedate: '22/06', status: 'pendente', curso: 'Física', descricao: 'Escrever relatório do experimento.' },
        { id: 3, name: 'Seminário de história', duedate: '15/06', status: 'entregue', curso: 'História', descricao: '' },
        { id: 4, name: 'Redação de português', duedate: 'Corrigida', status: 'corrigido', curso: 'Português', nota: '9,0', feedback: 'Excelente estrutura argumentativa!' },
      ])
    } finally { setLoading(false) }
  }

  async function entregar(atividadeId, arquivo) {
    setEnviando(atividadeId)
    setErro(null)
    try {
      const formData = new FormData()
      formData.append('arquivo', arquivo)
      await api.post(`/api/atividades/${atividadeId}/entregar`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })
      setSucesso(atividadeId)
      setTimeout(() => { setSucesso(null); carregarAtividades() }, 2000)
    } catch {
      setErro(atividadeId)
      setTimeout(() => setErro(null), 3000)
    } finally { setEnviando(null) }
  }

  const filtradas = filtro === 'todos' ? atividades : atividades.filter(a => a.status === filtro)
  const pendentes = atividades.filter(a => a.status === 'pendente').length

  // Só alunos podem entregar atividades
  const podeEntregar = usuario?.papel === 'aluno'

  return (
    <div style={{ fontFamily: "'Inter', system-ui, sans-serif" }}>
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ fontSize: 36, fontWeight: 800, letterSpacing: -1.5, color: '#000', marginBottom: 4 }}>Atividades</h1>
        <p style={{ color: '#888', fontSize: 14 }}>
          {loading ? 'Carregando...' : pendentes > 0 ? `${pendentes} pendente${pendentes > 1 ? 's' : ''}` : 'Tudo em dia!'}
        </p>
      </div>

      <div style={{ display: 'flex', gap: 8, marginBottom: 24 }}>
        {[
          { valor: 'todos', label: 'Todas' },
          { valor: 'pendente', label: 'Pendentes' },
          { valor: 'entregue', label: 'Entregues' },
          { valor: 'corrigido', label: 'Corrigidas' },
        ].map(f => (
          <button
            key={f.valor}
            onClick={() => setFiltro(f.valor)}
            style={{
              padding: '6px 16px',
              borderRadius: 20,
              border: 'none',
              fontSize: 13,
              cursor: 'pointer',
              fontFamily: 'inherit',
              fontWeight: filtro === f.valor ? 600 : 400,
              background: filtro === f.valor ? '#000' : '#f5f5f5',
              color: filtro === f.valor ? '#fff' : '#666',
            }}
          >
            {f.label}
          </button>
        ))}
      </div>

      <input
        ref={fileRef}
        type="file"
        style={{ display: 'none' }}
        onChange={e => {
          if (e.target.files[0] && aberta) entregar(aberta, e.target.files[0])
        }}
      />

      {loading ? (
        <div style={{ textAlign: 'center', padding: 60, color: '#aaa', fontSize: 14 }}>Carregando...</div>
      ) : filtradas.length === 0 ? (
        <div style={{ textAlign: 'center', padding: 60, color: '#aaa', fontSize: 14 }}>
          Nenhuma atividade {filtro !== 'todos' ? `com status "${filtro}"` : ''} por aqui.
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {filtradas.map(a => (
            <div key={a.id} style={{ border: '1px solid #f0f0f0', borderRadius: 12, overflow: 'hidden' }}>
              <div style={{ padding: '16px 20px', display: 'flex', alignItems: 'center', gap: 14 }}>
                <div style={{
                  width: 8, height: 8, borderRadius: '50%', flexShrink: 0,
                  background: a.status === 'pendente' ? '#000' : '#ddd',
                }} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 14, fontWeight: 600, color: '#000', marginBottom: 3 }}>{a.name}</div>
                  <div style={{ fontSize: 12, color: '#888' }}>{a.curso} · {a.duedate}</div>
                </div>
                <span style={{
                  fontSize: 11, padding: '4px 12px', borderRadius: 20,
                  fontWeight: 500, ...badge[a.status],
                }}>
                  {a.status}
                </span>
              </div>

              {a.descricao && (
                <div style={{ padding: '0 20px 12px', fontSize: 13, color: '#666', lineHeight: 1.5 }}>
                  {a.descricao}
                </div>
              )}

              {a.status === 'corrigido' && (a.nota || a.feedback) && (
                <div style={{
                  margin: '0 20px 16px', padding: '12px 16px', background: '#f9f9f9',
                  borderRadius: 8, borderLeft: `3px solid ${GREEN}`,
                }}>
                  {a.nota && (
                    <div style={{ fontSize: 13, fontWeight: 600, color: '#000', marginBottom: 4 }}>
                      Nota: {a.nota}
                    </div>
                  )}
                  {a.feedback && (
                    <div style={{ fontSize: 13, color: '#555' }}>{a.feedback}</div>
                  )}
                </div>
              )}

              {/* Botão de entregar: só aparece pra aluno com atividade pendente */}
              {a.status === 'pendente' && podeEntregar && (
                <div style={{ padding: '0 20px 16px' }}>
                  <button
                    onClick={() => { setAberta(a.id); fileRef.current.click() }}
                    disabled={enviando === a.id}
                    style={{
                      padding: '10px 20px',
                      background: sucesso === a.id ? GREEN : erro === a.id ? '#fee2e2' : '#000',
                      color: sucesso === a.id ? '#000' : erro === a.id ? '#c00' : '#fff',
                      border: 'none',
                      borderRadius: 8,
                      fontSize: 13,
                      fontWeight: 600,
                      cursor: 'pointer',
                      fontFamily: 'inherit',
                    }}
                  >
                    {enviando === a.id
                      ? 'Enviando...'
                      : sucesso === a.id
                        ? '✓ Enviado!'
                        : erro === a.id
                          ? 'Erro ao enviar'
                          : '📎 Entregar atividade'}
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}