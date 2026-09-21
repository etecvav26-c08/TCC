import { useState, useEffect, useRef } from 'react'
import { io } from 'socket.io-client'
import api from '../api'

const socket = io('http://localhost:3001')
const GREEN = '#3DFF7F'

export default function Chat({ usuario }) {
  const [turmas, setTurmas] = useState([])
  const [usuarios, setUsuarios] = useState([])
  const [conversaAtiva, setConversaAtiva] = useState(null)
  const [conversas, setConversas] = useState({}) // chave: "turma-1" ou "dm-4"
  const [naoLidas, setNaoLidas] = useState({})
  const [texto, setTexto] = useState('')
  const [loading, setLoading] = useState(true)
  const [carregandoHistorico, setCarregandoHistorico] = useState(false)
  const bottomRef = useRef()
  const conversaAtivaRef = useRef(null)

  useEffect(() => { conversaAtivaRef.current = conversaAtiva }, [conversaAtiva])

  // Identifica-se no socket
  useEffect(() => {
    if (usuario?.id) socket.emit('identificar', usuario.id)
  }, [usuario?.id])

  // Carrega turmas + usuários
  useEffect(() => {
    Promise.all([
      api.get('/api/turmas').then(r => r.data).catch(() => []),
      api.get('/api/chat/usuarios').then(r => r.data).catch(() => []),
    ]).then(([t, u]) => {
      setTurmas(t)
      setUsuarios(u)
    }).finally(() => setLoading(false))
  }, [])

  // Entra em TODAS as salas de turma automaticamente.
  // Assim, mesmo que o usuário esteja vendo uma conversa DM,
  // ele continua recebendo mensagens dos grupos.
  useEffect(() => {
    if (turmas.length === 0) return
    turmas.forEach(t => socket.emit('entrar-turma', t.id))
  }, [turmas])

  // Handlers globais de mensagens em tempo real
  useEffect(() => {
    const handlerDM = (msg) => {
      const chave = `dm-${msg.deUserId}`
      setConversas(prev => ({
        ...prev,
        [chave]: [...(prev[chave] || []), { ...msg, minha: false }],
      }))

      const ativa = conversaAtivaRef.current
      if (!(ativa?.tipo === 'dm' && Number(ativa.id) === Number(msg.deUserId))) {
        setNaoLidas(prev => ({ ...prev, [chave]: true }))
      }
    }

    const handlerTurma = (msg) => {
      const chave = `turma-${msg.turmaId}`

      setConversas(prev => {
        const existentes = prev[chave] || []

        // Evita duplicação: se a última mensagem tem o mesmo texto, hora e autor,
        // não adiciona de novo (o backend agora manda pro remetente também).
        if (existentes.length > 0) {
          const ultima = existentes[existentes.length - 1]
          const mesmaMsg =
            ultima.texto === msg.texto &&
            ultima.usuario === msg.usuario &&
            ultima.hora === msg.hora
          if (mesmaMsg) return prev
        }

        const minha = Number(msg.userId) === Number(usuario.id)
        return {
          ...prev,
          [chave]: [...existentes, { ...msg, minha }],
        }
      })

      const ativa = conversaAtivaRef.current
      const ehMinha = Number(msg.userId) === Number(usuario.id)
      if (!ehMinha && !(ativa?.tipo === 'turma' && Number(ativa.id) === Number(msg.turmaId))) {
        setNaoLidas(prev => ({ ...prev, [chave]: true }))
      }
    }

    socket.on('dm', handlerDM)
    socket.on('mensagem-turma', handlerTurma)
    return () => {
      socket.off('dm', handlerDM)
      socket.off('mensagem-turma', handlerTurma)
    }
  }, [usuario?.id])

  // Ao trocar de conversa: limpa não lidas e carrega histórico
  useEffect(() => {
    if (!conversaAtiva) return

    const chave = `${conversaAtiva.tipo}-${conversaAtiva.id}`

    setNaoLidas(prev => {
      const copia = { ...prev }
      delete copia[chave]
      return copia
    })

    // Carrega histórico se ainda não temos
    if (!conversas[chave]) {
      setCarregandoHistorico(true)
      const url = conversaAtiva.tipo === 'turma'
        ? `/api/chat/historico-turma/${conversaAtiva.id}`
        : `/api/chat/historico/${conversaAtiva.id}`

      api.get(url)
        .then(({ data }) => {
          setConversas(prev => ({ ...prev, [chave]: data }))
        })
        .catch(() => {
          setConversas(prev => ({ ...prev, [chave]: [] }))
        })
        .finally(() => setCarregandoHistorico(false))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [conversaAtiva])

  // Auto-scroll
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [conversas, conversaAtiva])

  function enviar() {
    if (!texto.trim() || !conversaAtiva) return

    const chave = `${conversaAtiva.tipo}-${conversaAtiva.id}`
    const hora = new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })

    const novaMsg = {
      texto,
      usuario: usuario?.nome || 'Usuário',
      hora,
      minha: true,
    }

    if (conversaAtiva.tipo === 'turma') {
      socket.emit('mensagem-turma', {
        turmaId: conversaAtiva.id,
        texto,
        usuario: usuario?.nome,
        userId: usuario.id,
      })
      novaMsg.userId = usuario.id
      novaMsg.turmaId = conversaAtiva.id
    } else {
      socket.emit('dm', {
        deUserId: usuario.id,
        paraUserId: conversaAtiva.id,
        texto,
        usuario: usuario?.nome,
      })
      novaMsg.deUserId = usuario.id
      novaMsg.paraUserId = conversaAtiva.id
    }

    // Adiciona localmente. O handler do socket vai checar e NÃO duplicar
    // (porque o backend manda pro remetente também).
    setConversas(prev => ({
      ...prev,
      [chave]: [...(prev[chave] || []), novaMsg],
    }))

    setTexto('')
  }

  const chaveAtiva = conversaAtiva ? `${conversaAtiva.tipo}-${conversaAtiva.id}` : null
  const mensagensAtivas = chaveAtiva ? (conversas[chaveAtiva] || []) : []

  function selecionarTurma(t) {
    setConversaAtiva({ tipo: 'turma', id: t.id, nome: t.fullname, meta: t.shortname })
  }

  function selecionarUsuario(u) {
    setConversaAtiva({ tipo: 'dm', id: u.id, nome: u.nome, meta: u.papel })
  }

  if (loading) {
    return (
      <div style={{ fontFamily: "'Inter', system-ui, sans-serif", padding: 60, textAlign: 'center', color: '#aaa' }}>
        Carregando...
      </div>
    )
  }

  return (
    <div style={{ fontFamily: "'Inter', system-ui, sans-serif" }}>
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ fontSize: 36, fontWeight: 800, letterSpacing: -1.5, marginBottom: 4, color: '#000' }}>
          Mensagens
        </h1>
        <p style={{ color: '#888', fontSize: 14 }}>
          Converse com suas turmas e com colegas individualmente
        </p>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: '260px 1fr',
        gap: 0,
        border: '1px solid #f0f0f0',
        borderRadius: 12,
        overflow: 'hidden',
        height: 560,
      }}>
        {/* Sidebar */}
        <div style={{ borderRight: '1px solid #f0f0f0', overflowY: 'auto' }}>

          {/* Turmas */}
          <div style={{
            padding: '14px 16px',
            fontSize: 11, fontWeight: 700, color: '#888',
            textTransform: 'uppercase', letterSpacing: 1,
            borderBottom: '1px solid #f5f5f5',
          }}>
            Turmas · {turmas.length}
          </div>
          {turmas.length === 0 ? (
            <div style={{ padding: '12px 16px', fontSize: 12, color: '#bbb' }}>Sem turmas</div>
          ) : (
            turmas.map(t => {
              const ativa = conversaAtiva?.tipo === 'turma' && conversaAtiva.id === t.id
              const chave = `turma-${t.id}`
              const ultima = (conversas[chave] || []).slice(-1)[0]
              const temNaoLida = naoLidas[chave]
              return (
                <div
                  key={`t-${t.id}`}
                  onClick={() => selecionarTurma(t)}
                  style={{
                    padding: '12px 16px',
                    cursor: 'pointer',
                    borderBottom: '1px solid #f5f5f5',
                    background: ativa ? '#f8f8f8' : 'transparent',
                    borderLeft: ativa ? `3px solid ${GREEN}` : '3px solid transparent',
                    transition: 'all .1s',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{
                      width: 36, height: 36, borderRadius: 8,
                      background: '#000', flexShrink: 0,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: 12, fontWeight: 700, color: GREEN,
                    }}>
                      {t.shortname?.slice(0, 2) || '··'}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{
                        fontSize: 13, fontWeight: temNaoLida ? 700 : 600, color: '#000',
                        overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                      }}>
                        {t.fullname}
                      </div>
                      <div style={{
                        fontSize: 11, color: '#888',
                        overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                      }}>
                        {ultima ? `${ultima.usuario}: ${ultima.texto}` : 'Grupo da turma'}
                      </div>
                    </div>
                    {temNaoLida && (
                      <div style={{ width: 8, height: 8, borderRadius: '50%', background: GREEN, flexShrink: 0 }} />
                    )}
                  </div>
                </div>
              )
            })
          )}

          {/* Contatos */}
          <div style={{
            padding: '14px 16px',
            fontSize: 11, fontWeight: 700, color: '#888',
            textTransform: 'uppercase', letterSpacing: 1,
            borderBottom: '1px solid #f5f5f5',
            borderTop: '1px solid #eee',
          }}>
            Contatos · {usuarios.length}
          </div>
          {usuarios.length === 0 ? (
            <div style={{ padding: '12px 16px', fontSize: 12, color: '#bbb' }}>Sem contatos</div>
          ) : (
            usuarios.map(u => {
              const ativa = conversaAtiva?.tipo === 'dm' && conversaAtiva.id === u.id
              const chave = `dm-${u.id}`
              const ultima = (conversas[chave] || []).slice(-1)[0]
              const temNaoLida = naoLidas[chave]
              return (
                <div
                  key={`u-${u.id}`}
                  onClick={() => selecionarUsuario(u)}
                  style={{
                    padding: '12px 16px',
                    cursor: 'pointer',
                    borderBottom: '1px solid #f5f5f5',
                    background: ativa ? '#f8f8f8' : 'transparent',
                    borderLeft: ativa ? `3px solid ${GREEN}` : '3px solid transparent',
                    transition: 'all .1s',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{
                      width: 36, height: 36, borderRadius: '50%',
                      background: '#000', flexShrink: 0,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: 12, fontWeight: 700, color: GREEN,
                    }}>
                      {u.nome?.charAt(0)}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{
                        fontSize: 13, fontWeight: temNaoLida ? 700 : 600, color: '#000',
                        overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                      }}>
                        {u.nome}
                      </div>
                      <div style={{
                        fontSize: 11, color: '#888',
                        overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                      }}>
                        {ultima ? ultima.texto : u.papel}
                      </div>
                    </div>
                    {temNaoLida && (
                      <div style={{ width: 8, height: 8, borderRadius: '50%', background: GREEN, flexShrink: 0 }} />
                    )}
                  </div>
                </div>
              )
            })
          )}
        </div>

        {/* Conversa ativa */}
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          {conversaAtiva ? (
            <>
              <div style={{
                padding: '14px 20px',
                borderBottom: '1px solid #f5f5f5',
                display: 'flex', alignItems: 'center', gap: 12,
              }}>
                <div style={{
                  width: 32, height: 32,
                  borderRadius: conversaAtiva.tipo === 'turma' ? 8 : '50%',
                  background: '#000', flexShrink: 0,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 12, fontWeight: 700, color: GREEN,
                }}>
                  {conversaAtiva.tipo === 'turma'
                    ? (conversaAtiva.meta?.slice(0, 2) || '··')
                    : conversaAtiva.nome?.charAt(0)}
                </div>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 600, color: '#000' }}>
                    {conversaAtiva.nome}
                  </div>
                  <div style={{ fontSize: 11, color: '#888' }}>
                    {conversaAtiva.tipo === 'turma' ? 'Grupo da turma' : conversaAtiva.meta}
                  </div>
                </div>
              </div>

              <div style={{
                flex: 1, overflowY: 'auto', padding: 20,
                display: 'flex', flexDirection: 'column', gap: 12,
                background: '#fafafa',
              }}>
                {carregandoHistorico ? (
                  <div style={{
                    flex: 1, display: 'flex',
                    alignItems: 'center', justifyContent: 'center',
                    color: '#bbb', fontSize: 13,
                  }}>
                    Carregando conversa...
                  </div>
                ) : mensagensAtivas.length === 0 ? (
                  <div style={{
                    flex: 1, display: 'flex',
                    alignItems: 'center', justifyContent: 'center',
                    color: '#bbb', fontSize: 13, textAlign: 'center',
                  }}>
                    <div>
                      <div style={{ fontSize: 32, marginBottom: 8 }}>
                        {conversaAtiva.tipo === 'turma' ? '👥' : '💬'}
                      </div>
                      {conversaAtiva.tipo === 'turma'
                        ? 'Nenhuma mensagem no grupo ainda.'
                        : `Nenhuma mensagem com ${conversaAtiva.nome?.split(' ')[0]} ainda.`}
                      <br />
                      <span style={{ fontSize: 12 }}>
                        {conversaAtiva.tipo === 'turma' ? 'Comece a conversa!' : 'Diga "oi"!'}
                      </span>
                    </div>
                  </div>
                ) : (
                  mensagensAtivas.map((m, i) => (
                    <div key={i} style={{ display: 'flex', justifyContent: m.minha ? 'flex-end' : 'flex-start' }}>
                      <div style={{ maxWidth: '70%' }}>
                        <div style={{
                          padding: '10px 14px',
                          borderRadius: 10,
                          fontSize: 13,
                          lineHeight: 1.5,
                          background: m.minha ? '#000' : '#fff',
                          color: m.minha ? '#fff' : '#000',
                          border: m.minha ? 'none' : '1px solid #eee',
                        }}>
                          {m.texto}
                        </div>
                        <div style={{
                          fontSize: 11, color: '#aaa', marginTop: 4,
                          textAlign: m.minha ? 'right' : 'left',
                        }}>
                          {m.minha ? 'Você' : m.usuario} · {m.hora}
                        </div>
                      </div>
                    </div>
                  ))
                )}
                <div ref={bottomRef} />
              </div>

              <div style={{
                padding: 16, borderTop: '1px solid #f0f0f0',
                display: 'flex', gap: 8, background: '#fff',
              }}>
                <input
                  value={texto}
                  onChange={e => setTexto(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && enviar()}
                  placeholder={
                    conversaAtiva.tipo === 'turma'
                      ? `Mensagem para ${conversaAtiva.nome}...`
                      : `Mensagem para ${conversaAtiva.nome?.split(' ')[0]}...`
                  }
                  style={{
                    flex: 1, padding: '10px 14px',
                    border: '1px solid #e0e0e0', borderRadius: 8,
                    fontSize: 13, fontFamily: 'inherit', outline: 'none',
                  }}
                />
                <button
                  onClick={enviar}
                  disabled={!texto.trim()}
                  style={{
                    padding: '10px 20px',
                    background: texto.trim() ? '#000' : '#f0f0f0',
                    color: texto.trim() ? '#fff' : '#aaa',
                    border: 'none', borderRadius: 8,
                    fontSize: 13, fontWeight: 600,
                    cursor: texto.trim() ? 'pointer' : 'not-allowed',
                    fontFamily: 'inherit',
                  }}
                >
                  Enviar
                </button>
              </div>
            </>
          ) : (
            <div style={{
              flex: 1, display: 'flex',
              alignItems: 'center', justifyContent: 'center',
              color: '#bbb', fontSize: 13, textAlign: 'center',
            }}>
              <div>
                <div style={{ fontSize: 40, marginBottom: 8 }}>💬</div>
                Selecione uma turma ou um contato
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}