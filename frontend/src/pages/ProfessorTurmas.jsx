import { useState, useEffect } from 'react'
import api from '../api'

const GREEN = '#3DFF7F'
const MOODLE_URL = 'http://localhost' // ⚠️ troca se o seu Moodle estiver em outra URL

function formatarTamanho(bytes) {
  if (!bytes) return ''
  if (bytes < 1024) return bytes + ' B'
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB'
}

export default function ProfessorTurmas() {
  const [turmas, setTurmas] = useState([])
  const [turmaSelecionada, setTurmaSelecionada] = useState(null)
  const [atividades, setAtividades] = useState([])
  const [atividadeSelecionada, setAtividadeSelecionada] = useState(null)
  const [alunos, setAlunos] = useState([])
  const [submissoes, setSubmissoes] = useState([]) // submissões da atividade selecionada
  const [notas, setNotas] = useState({})
  const [feedbacks, setFeedbacks] = useState({})
  const [loading, setLoading] = useState(true)
  const [salvando, setSalvando] = useState(null)
  const [sucesso, setSucesso] = useState(null)
  const [aba, setAba] = useState('atividades')

  useEffect(() => {
    api.get('/api/professor/turmas')
      .then(({ data }) => { setTurmas(data); if (data.length > 0) selecionarTurma(data[0]) })
      .finally(() => setLoading(false))
  }, [])

  async function selecionarTurma(turma) {
    setTurmaSelecionada(turma)
    setAtividadeSelecionada(null)
    setSubmissoes([])
    const [atv, als] = await Promise.all([
      api.get(`/api/professor/turmas/${turma.id}/atividades`).then(r => r.data).catch(() => []),
      api.get(`/api/professor/turmas/${turma.id}/alunos`).then(r => r.data).catch(() => []),
    ])
    setAtividades(atv)
    setAlunos(als)
  }

  // Quando o professor escolhe uma atividade na aba "Dar Notas",
  // buscamos as submissões dela (arquivos enviados pelos alunos)
  async function carregarSubmissoes(atividade) {
    setAtividadeSelecionada(atividade)
    if (!atividade) { setSubmissoes([]); return }
    try {
      const { data } = await api.get(`/api/professor/atividades/${atividade.id}/submissoes`)
      setSubmissoes(data)
    } catch (e) {
      console.log('Erro ao buscar submissões:', e)
      setSubmissoes([])
    }
  }

  function submissoesDoAluno(alunoId) {
    const sub = submissoes.find(s => Number(s.userid) === Number(alunoId))
    return sub?.arquivos || []
  }

  async function darNota(alunoId) {
    if (!atividadeSelecionada) return
    setSalvando(alunoId)
    try {
      await api.post(`/api/professor/atividades/${atividadeSelecionada.id}/nota`, {
        userId: alunoId,
        nota: parseFloat(notas[alunoId]) || 0,
        feedback: feedbacks[alunoId] || '',
      })
      setSucesso(alunoId)
      setTimeout(() => setSucesso(null), 3000)
    } catch {
      alert('Erro ao salvar nota')
    } finally {
      setSalvando(null)
    }
  }

  function abrirMoodleParaCriarAtividade() {
    if (!turmaSelecionada) return
    window.open(
      `${MOODLE_URL}/course/modedit.php?add=assign&type=&course=${turmaSelecionada.id}&section=1&return=0`,
      '_blank'
    )
  }

  async function recarregarAtividades() {
    if (!turmaSelecionada) return
    const { data } = await api.get(`/api/professor/turmas/${turmaSelecionada.id}/atividades`)
    setAtividades(data)
  }

  return (
    <div style={{ fontFamily: "'Inter', system-ui, sans-serif" }}>
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ fontSize: 36, fontWeight: 800, letterSpacing: -1.5, color: '#000', marginBottom: 4 }}>
          Minhas Turmas
        </h1>
        <p style={{ color: '#888', fontSize: 14 }}>
          {turmas.length} turma{turmas.length !== 1 ? 's' : ''}
        </p>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: 60, color: '#aaa' }}>Carregando...</div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: '220px 1fr', gap: 16 }}>

          {/* Lista de turmas */}
          <div style={{ border: '1px solid #f0f0f0', borderRadius: 12, overflow: 'hidden', height: 'fit-content' }}>
            {turmas.map((t, i) => (
              <div
                key={t.id}
                onClick={() => selecionarTurma(t)}
                style={{
                  padding: '14px 16px',
                  cursor: 'pointer',
                  borderBottom: i < turmas.length - 1 ? '1px solid #f5f5f5' : 'none',
                  background: turmaSelecionada?.id === t.id ? '#000' : 'transparent',
                  color: turmaSelecionada?.id === t.id ? '#fff' : '#333',
                  transition: 'all .1s',
                }}
              >
                <div style={{ fontSize: 13, fontWeight: 600 }}>{t.fullname}</div>
                <div style={{ fontSize: 11, color: turmaSelecionada?.id === t.id ? GREEN : '#aaa', marginTop: 2 }}>
                  {t.shortname}
                </div>
              </div>
            ))}
          </div>

          {turmaSelecionada && (
            <div>
              {/* Abas */}
              <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
                {[
                  { valor: 'atividades', label: `Atividades (${atividades.length})` },
                  { valor: 'alunos', label: `Alunos (${alunos.length})` },
                  { valor: 'notas', label: 'Dar Notas' },
                ].map(a => (
                  <button
                    key={a.valor}
                    onClick={() => setAba(a.valor)}
                    style={{
                      padding: '8px 18px',
                      borderRadius: 20,
                      border: 'none',
                      fontSize: 13,
                      fontWeight: aba === a.valor ? 600 : 400,
                      background: aba === a.valor ? '#000' : '#f5f5f5',
                      color: aba === a.valor ? '#fff' : '#666',
                      cursor: 'pointer',
                      fontFamily: 'inherit',
                    }}
                  >
                    {a.label}
                  </button>
                ))}
              </div>

              {/* Aba: Atividades */}
              {aba === 'atividades' && (
                <div>
                  <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
                    <button
                      onClick={abrirMoodleParaCriarAtividade}
                      style={{
                        padding: '10px 20px', background: GREEN, color: '#000',
                        border: 'none', borderRadius: 8, fontSize: 13, fontWeight: 700,
                        cursor: 'pointer', fontFamily: 'inherit',
                      }}
                    >
                      + Nova atividade
                    </button>
                    <button
                      onClick={recarregarAtividades}
                      style={{
                        padding: '10px 20px', background: '#f5f5f5', color: '#666',
                        border: 'none', borderRadius: 8, fontSize: 13, fontWeight: 600,
                        cursor: 'pointer', fontFamily: 'inherit',
                      }}
                    >
                      ↻ Recarregar
                    </button>
                  </div>

                  <div style={{ border: '1px solid #f0f0f0', borderRadius: 12, overflow: 'hidden' }}>
                    {atividades.length === 0 ? (
                      <div style={{ padding: 32, textAlign: 'center', color: '#aaa', fontSize: 13 }}>
                        Nenhuma atividade ainda.<br />
                        Clique em "+ Nova atividade" para criar (abre no Moodle).
                      </div>
                    ) : (
                      atividades.map((a, i) => (
                        <div
                          key={a.id}
                          style={{
                            padding: '16px 20px',
                            borderBottom: i < atividades.length - 1 ? '1px solid #f5f5f5' : 'none',
                            display: 'flex', alignItems: 'center', gap: 16,
                          }}
                        >
                          <div style={{ width: 6, height: 6, borderRadius: '50%', background: GREEN, flexShrink: 0 }} />
                          <div style={{ flex: 1 }}>
                            <div style={{ fontSize: 14, fontWeight: 500, color: '#000' }}>{a.nome}</div>
                            <div style={{ fontSize: 12, color: '#888', marginTop: 2 }}>Prazo: {a.prazo}</div>
                          </div>
                          <button
                            onClick={() => { carregarSubmissoes(a); setAba('notas') }}
                            style={{
                              padding: '6px 14px', background: '#000', color: '#fff',
                              border: 'none', borderRadius: 6, fontSize: 12,
                              cursor: 'pointer', fontFamily: 'inherit',
                            }}
                          >
                            Dar notas
                          </button>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}

              {/* Aba: Alunos */}
              {aba === 'alunos' && (
                <div style={{ border: '1px solid #f0f0f0', borderRadius: 12, overflow: 'hidden' }}>
                  {alunos.length === 0 ? (
                    <div style={{ padding: 32, textAlign: 'center', color: '#aaa', fontSize: 13 }}>
                      Nenhum aluno matriculado.
                    </div>
                  ) : (
                    alunos.map((a, i) => (
                      <div
                        key={a.id}
                        style={{
                          padding: '14px 20px',
                          borderBottom: i < alunos.length - 1 ? '1px solid #f5f5f5' : 'none',
                          display: 'flex', alignItems: 'center', gap: 12,
                        }}
                      >
                        <div style={{
                          width: 36, height: 36, borderRadius: '50%', background: '#000',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          fontSize: 13, fontWeight: 700, color: GREEN, flexShrink: 0,
                        }}>
                          {a.nome?.charAt(0)}
                        </div>
                        <div>
                          <div style={{ fontSize: 13, fontWeight: 500, color: '#000' }}>{a.nome}</div>
                          <div style={{ fontSize: 12, color: '#888' }}>{a.email}</div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}

              {/* Aba: Dar Notas */}
              {aba === 'notas' && (
                <div>
                  <div style={{ marginBottom: 16 }}>
                    <label style={{ fontSize: 11, fontWeight: 600, color: '#888', display: 'block', marginBottom: 8 }}>
                      ATIVIDADE
                    </label>
                    <select
                      value={atividadeSelecionada?.id || ''}
                      onChange={e => carregarSubmissoes(atividades.find(a => a.id === parseInt(e.target.value)) || null)}
                      style={{
                        padding: '10px 14px', border: '1px solid #e0e0e0', borderRadius: 8,
                        fontSize: 13, width: '100%', fontFamily: 'inherit', background: '#fff',
                      }}
                    >
                      <option value="">Selecione uma atividade</option>
                      {atividades.map(a => (
                        <option key={a.id} value={a.id}>{a.nome}</option>
                      ))}
                    </select>
                  </div>

                  {atividadeSelecionada && (
                    <div style={{ border: '1px solid #f0f0f0', borderRadius: 12, overflow: 'hidden' }}>
                      <div style={{
                        padding: '14px 20px', background: '#000', color: '#fff',
                        display: 'flex', justifyContent: 'space-between',
                      }}>
                        <span style={{ fontSize: 13, fontWeight: 600 }}>{atividadeSelecionada.nome}</span>
                        <span style={{ fontSize: 11, color: GREEN }}>Prazo: {atividadeSelecionada.prazo}</span>
                      </div>

                      {alunos.length === 0 ? (
                        <div style={{ padding: 24, textAlign: 'center', color: '#aaa', fontSize: 13 }}>
                          Nenhum aluno matriculado nessa turma.
                        </div>
                      ) : (
                        alunos.map((aluno, i) => {
                          const arquivos = submissoesDoAluno(aluno.id)
                          return (
                            <div
                              key={aluno.id}
                              style={{
                                padding: '16px 20px',
                                borderBottom: i < alunos.length - 1 ? '1px solid #f5f5f5' : 'none',
                              }}
                            >
                              {/* Linha 1: avatar + nome + nota + feedback + salvar */}
                              <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                                <div style={{
                                  width: 36, height: 36, borderRadius: '50%', background: '#f5f5f5',
                                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                                  fontSize: 13, fontWeight: 700, color: '#000', flexShrink: 0,
                                }}>
                                  {aluno.nome?.charAt(0)}
                                </div>
                                <div style={{ flex: 1, minWidth: 0 }}>
                                  <div style={{ fontSize: 13, fontWeight: 500, color: '#000' }}>{aluno.nome}</div>
                                  <div style={{ fontSize: 11, color: '#aaa' }}>
                                    {arquivos.length === 0 ? 'Sem envio' : `${arquivos.length} arquivo(s)`}
                                  </div>
                                </div>
                                <input
                                  type="number" min="0" max="10" step="0.5" placeholder="Nota"
                                  value={notas[aluno.id] || ''}
                                  onChange={e => setNotas(prev => ({ ...prev, [aluno.id]: e.target.value }))}
                                  style={{
                                    width: 72, padding: '8px 10px', border: '1px solid #e0e0e0',
                                    borderRadius: 6, fontSize: 13, textAlign: 'center', fontFamily: 'inherit',
                                  }}
                                />
                                <input
                                  type="text" placeholder="Feedback (opcional)"
                                  value={feedbacks[aluno.id] || ''}
                                  onChange={e => setFeedbacks(prev => ({ ...prev, [aluno.id]: e.target.value }))}
                                  style={{
                                    flex: 2, padding: '8px 12px', border: '1px solid #e0e0e0',
                                    borderRadius: 6, fontSize: 13, fontFamily: 'inherit',
                                  }}
                                />
                                <button
                                  onClick={() => darNota(aluno.id)}
                                  disabled={salvando === aluno.id || !notas[aluno.id]}
                                  style={{
                                    padding: '8px 16px',
                                    background: sucesso === aluno.id ? GREEN : '#000',
                                    color: sucesso === aluno.id ? '#000' : '#fff',
                                    border: 'none', borderRadius: 6, fontSize: 12, fontWeight: 600,
                                    cursor: 'pointer', fontFamily: 'inherit', whiteSpace: 'nowrap',
                                    opacity: !notas[aluno.id] ? 0.4 : 1,
                                  }}
                                >
                                  {salvando === aluno.id ? '...' : sucesso === aluno.id ? '✓ Salvo' : 'Salvar'}
                                </button>
                              </div>

                              {/* Linha 2: arquivos enviados (se houver) */}
                              {arquivos.length > 0 && (
                                <div style={{
                                  marginTop: 12, marginLeft: 50,
                                  padding: '10px 14px', background: '#fafafa',
                                  borderRadius: 8, border: '1px solid #f0f0f0',
                                }}>
                                  <div style={{
                                    fontSize: 10, fontWeight: 700, color: '#888',
                                    textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8,
                                  }}>
                                    Arquivos enviados
                                  </div>
                                  {arquivos.map((arq, idx) => (
                                    <a
                                      key={idx}
                                      href={arq.url}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      style={{
                                        display: 'flex', alignItems: 'center', gap: 10,
                                        padding: '8px 10px', background: '#fff',
                                        border: '1px solid #e8e8e8', borderRadius: 6,
                                        fontSize: 12, color: '#000', textDecoration: 'none',
                                        marginBottom: idx < arquivos.length - 1 ? 6 : 0,
                                      }}
                                    >
                                      <span style={{ fontSize: 16 }}>📎</span>
                                      <span style={{ flex: 1, fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                        {arq.nome}
                                      </span>
                                      <span style={{ color: '#aaa', fontSize: 11 }}>
                                        {formatarTamanho(arq.tamanho)}
                                      </span>
                                      <span style={{ color: GREEN, fontSize: 11, fontWeight: 600 }}>
                                        Abrir ↗
                                      </span>
                                    </a>
                                  ))}
                                </div>
                              )}
                            </div>
                          )
                        })
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  )
}