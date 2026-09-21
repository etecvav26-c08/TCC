import { useState, useEffect } from 'react'
import api from '../api'

const GREEN = '#3DFF7F'

export default function CoordenadorPainel() {
  const [aba, setAba] = useState('turmas')
  const [turmas, setTurmas] = useState([])
  const [turmaSelecionada, setTurmaSelecionada] = useState(null)
  const [participantes, setParticipantes] = useState([])
  const [loading, setLoading] = useState(true)
  const [salvando, setSalvando] = useState(false)
  const [sucesso, setSucesso] = useState('')
  const [formTurma, setFormTurma] = useState({ nome: '', shortname: '', descricao: '' })
  const [busca, setBusca] = useState('')
  const [resultados, setResultados] = useState([])
  const [papelMatricula, setPapelMatricula] = useState('aluno')
  const [buscando, setBuscando] = useState(false)

  useEffect(() => { carregarTurmas() }, [])

  async function carregarTurmas() {
    setLoading(true)
    try { const { data } = await api.get('/api/coordenador/turmas'); setTurmas(data) }
    finally { setLoading(false) }
  }

  async function selecionarTurma(turma) {
    setTurmaSelecionada(turma); setAba('participantes')
    const { data } = await api.get(`/api/coordenador/turmas/${turma.id}/participantes`)
    setParticipantes(data)
  }

  async function criarTurma(e) {
    e.preventDefault()
    if (!formTurma.nome || !formTurma.shortname) return
    setSalvando(true)
    try {
      await api.post('/api/coordenador/turmas', formTurma)
      setSucesso('Turma criada!')
      setFormTurma({ nome: '', shortname: '', descricao: '' })
      await carregarTurmas()
      setTimeout(() => setSucesso(''), 3000)
    } catch { setSucesso('Erro ao criar turma') } finally { setSalvando(false) }
  }

  async function buscarUsuarios(valor) {
    setBusca(valor)
    if (valor.length < 2) { setResultados([]); return }
    setBuscando(true)
    try { const { data } = await api.get(`/api/coordenador/usuarios?busca=${valor}`); setResultados(data) }
    finally { setBuscando(false) }
  }

  async function matricular(usuario) {
    if (!turmaSelecionada) return
    setSalvando(true)
    try {
      await api.post(`/api/coordenador/turmas/${turmaSelecionada.id}/matricular`, { userId: usuario.id, papel: papelMatricula })
      setSucesso(`${usuario.nome} matriculado!`)
      setBusca(''); setResultados([])
      const { data } = await api.get(`/api/coordenador/turmas/${turmaSelecionada.id}/participantes`)
      setParticipantes(data)
      setTimeout(() => setSucesso(''), 3000)
    } catch { setSucesso('Erro ao matricular') } finally { setSalvando(false) }
  }

  return (
    <div style={{ fontFamily: "'Inter', system-ui, sans-serif" }}>
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ fontSize: 36, fontWeight: 800, letterSpacing: -1.5, color: '#000', marginBottom: 4 }}>Painel do Coordenador</h1>
        <p style={{ color: '#888', fontSize: 14 }}>{turmas.length} turmas cadastradas</p>
      </div>

      {sucesso && (
        <div style={{ marginBottom: 20, padding: '12px 16px', background: sucesso.startsWith('Erro') ? '#fff0f0' : '#f0fff4', border: `1px solid ${sucesso.startsWith('Erro') ? '#fca5a5' : '#86efac'}`, borderRadius: 8, fontSize: 13, color: sucesso.startsWith('Erro') ? '#c00' : '#15803d' }}>
          {sucesso}
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '260px 1fr', gap: 16 }}>
        <div>
          <div style={{ fontSize: 12, fontWeight: 600, color: '#888', marginBottom: 10, letterSpacing: 1, textTransform: 'uppercase' }}>Turmas</div>
          <div style={{ border: '1px solid #f0f0f0', borderRadius: 12, overflow: 'hidden', marginBottom: 12 }}>
            {loading ? <div style={{ padding: 20, color: '#aaa', fontSize: 13 }}>Carregando...</div> :
            turmas.map((t, i) => (
              <div key={t.id} onClick={() => selecionarTurma(t)} style={{
                padding: '12px 16px', cursor: 'pointer',
                borderBottom: i < turmas.length - 1 ? '1px solid #f5f5f5' : 'none',
                background: turmaSelecionada?.id === t.id ? '#000' : 'transparent',
                color: turmaSelecionada?.id === t.id ? '#fff' : '#333', transition: 'all .1s',
              }}>
                <div style={{ fontSize: 13, fontWeight: 600 }}>{t.fullname}</div>
                <div style={{ fontSize: 11, color: turmaSelecionada?.id === t.id ? GREEN : '#aaa', marginTop: 2 }}>{t.shortname}</div>
              </div>
            ))}
          </div>
          <button onClick={() => { setTurmaSelecionada(null); setAba('criar') }} style={{
            width: '100%', padding: '10px', background: GREEN, color: '#000',
            border: 'none', borderRadius: 8, fontSize: 13, fontWeight: 700,
            cursor: 'pointer', fontFamily: 'inherit',
          }}>+ Nova turma</button>
        </div>

        <div>
          {turmaSelecionada && (
            <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
              {[{ valor: 'participantes', label: 'Participantes' }, { valor: 'matricular', label: 'Matricular' }].map(a => (
                <button key={a.valor} onClick={() => setAba(a.valor)} style={{
                  padding: '8px 18px', borderRadius: 20, border: 'none', fontSize: 13,
                  fontWeight: aba === a.valor ? 600 : 400,
                  background: aba === a.valor ? '#000' : '#f5f5f5',
                  color: aba === a.valor ? '#fff' : '#666', cursor: 'pointer', fontFamily: 'inherit',
                }}>{a.label}</button>
              ))}
            </div>
          )}

          {aba === 'criar' && (
            <div style={{ border: '1px solid #f0f0f0', borderRadius: 12, padding: 24 }}>
              <div style={{ fontSize: 16, fontWeight: 700, color: '#000', marginBottom: 20 }}>Nova turma</div>
              <form onSubmit={criarTurma}>
                {[{ label: 'NOME DA TURMA', key: 'nome', placeholder: 'Ex: Matemática 3º Ano' }, { label: 'NOME CURTO', key: 'shortname', placeholder: 'Ex: MAT3A' }, { label: 'DESCRIÇÃO', key: 'descricao', placeholder: 'Opcional...' }].map(f => (
                  <div key={f.key} style={{ marginBottom: 16 }}>
                    <label style={{ fontSize: 11, fontWeight: 600, color: '#888', display: 'block', marginBottom: 6, letterSpacing: 1 }}>{f.label}</label>
                    <input value={formTurma[f.key]} onChange={e => setFormTurma(prev => ({ ...prev, [f.key]: e.target.value }))} placeholder={f.placeholder} style={{ width: '100%', padding: '12px 14px', border: '1px solid #e0e0e0', borderRadius: 8, fontSize: 13, fontFamily: 'inherit', boxSizing: 'border-box' }} />
                  </div>
                ))}
                <button type="submit" disabled={salvando} style={{ width: '100%', padding: '14px', background: '#000', color: '#fff', border: 'none', borderRadius: 8, fontSize: 14, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>
                  {salvando ? 'Criando...' : 'Criar turma'}
                </button>
              </form>
            </div>
          )}

          {aba === 'participantes' && turmaSelecionada && (
            <div style={{ border: '1px solid #f0f0f0', borderRadius: 12, overflow: 'hidden' }}>
              <div style={{ padding: '14px 20px', background: '#000', color: '#fff', fontSize: 13, fontWeight: 600 }}>
                {turmaSelecionada.fullname} — {participantes.length} participante{participantes.length !== 1 ? 's' : ''}
              </div>
              {participantes.length === 0 ? <div style={{ padding: 32, textAlign: 'center', color: '#aaa', fontSize: 13 }}>Nenhum participante.</div> :
              participantes.map((p, i) => (
                <div key={p.id} style={{ padding: '12px 20px', borderBottom: i < participantes.length - 1 ? '1px solid #f5f5f5' : 'none', display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{ width: 34, height: 34, borderRadius: '50%', background: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700, color: GREEN, flexShrink: 0 }}>{p.nome?.charAt(0)}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 13, fontWeight: 500, color: '#000' }}>{p.nome}</div>
                    <div style={{ fontSize: 11, color: '#888' }}>{p.email}</div>
                  </div>
                  <div style={{ display: 'flex', gap: 4 }}>
                    {p.papeis.map(r => (
                      <span key={r} style={{ fontSize: 10, padding: '2px 8px', borderRadius: 20, background: r === 'editingteacher' || r === 'teacher' ? '#000' : '#f0f0f0', color: r === 'editingteacher' || r === 'teacher' ? GREEN : '#666', fontWeight: 600 }}>
                        {r === 'editingteacher' || r === 'teacher' ? 'Professor' : r === 'student' ? 'Aluno' : r}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {aba === 'matricular' && turmaSelecionada && (
            <div style={{ border: '1px solid #f0f0f0', borderRadius: 12, padding: 24 }}>
              <div style={{ fontSize: 16, fontWeight: 700, color: '#000', marginBottom: 20 }}>Matricular em {turmaSelecionada.fullname}</div>
              <div style={{ marginBottom: 16 }}>
                <label style={{ fontSize: 11, fontWeight: 600, color: '#888', display: 'block', marginBottom: 6, letterSpacing: 1 }}>PAPEL</label>
                <div style={{ display: 'flex', gap: 8 }}>
                  {['aluno', 'professor'].map(p => (
                    <button key={p} onClick={() => setPapelMatricula(p)} style={{
                      padding: '8px 20px', borderRadius: 20, border: 'none', fontSize: 13,
                      fontWeight: papelMatricula === p ? 600 : 400,
                      background: papelMatricula === p ? '#000' : '#f5f5f5',
                      color: papelMatricula === p ? '#fff' : '#666',
                      cursor: 'pointer', fontFamily: 'inherit', textTransform: 'capitalize',
                    }}>{p}</button>
                  ))}
                </div>
              </div>
              <div style={{ marginBottom: 16, position: 'relative' }}>
                <label style={{ fontSize: 11, fontWeight: 600, color: '#888', display: 'block', marginBottom: 6, letterSpacing: 1 }}>BUSCAR USUÁRIO</label>
                <input value={busca} onChange={e => buscarUsuarios(e.target.value)} placeholder="Digite o nome..." style={{ width: '100%', padding: '12px 14px', border: '1px solid #e0e0e0', borderRadius: 8, fontSize: 13, fontFamily: 'inherit', boxSizing: 'border-box' }} />
                {resultados.length > 0 && (
                  <div style={{ position: 'absolute', top: '100%', left: 0, right: 0, background: '#fff', border: '1px solid #e0e0e0', borderRadius: 8, boxShadow: '0 4px 16px rgba(0,0,0,.08)', zIndex: 10, overflow: 'hidden' }}>
                    {resultados.map((u, i) => (
                      <div key={u.id} onClick={() => matricular(u)} style={{ padding: '12px 16px', borderBottom: i < resultados.length - 1 ? '1px solid #f5f5f5' : 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 10 }}
                        onMouseEnter={e => e.currentTarget.style.background = '#f9f9f9'}
                        onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                      >
                        <div style={{ width: 32, height: 32, borderRadius: '50%', background: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700, color: GREEN, flexShrink: 0 }}>{u.nome?.charAt(0)}</div>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontSize: 13, fontWeight: 500, color: '#000' }}>{u.nome}</div>
                          <div style={{ fontSize: 11, color: '#888' }}>{u.email}</div>
                        </div>
                        <div style={{ fontSize: 11, color: GREEN, fontWeight: 600 }}>+ {papelMatricula}</div>
                      </div>
                    ))}
                  </div>
                )}
                {buscando && <div style={{ marginTop: 8, fontSize: 12, color: '#aaa' }}>Buscando...</div>}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
