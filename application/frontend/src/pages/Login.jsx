import { useState } from 'react'
import api from '../api'

export default function Login({ onLogin }) {
  const [form, setForm] = useState({ username: '', password: '' })
  const [erro, setErro] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)
    setErro('')
    try {
      const { data } = await api.post('/api/auth/login', form)
      sessionStorage.setItem('token', data.token)
      onLogin(data.usuario)
    } catch {
      setErro('Usuário ou senha incorretos')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{
      minHeight: '100vh',
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      fontFamily: "'Inter', system-ui, sans-serif",
      background: '#fff',
    }}>
      {/* Lado esquerdo — visual */}
      <div style={{
        background: '#000',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: '48px',
        position: 'relative',
        overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute',
          width: 400,
          height: 400,
          borderRadius: '50%',
          border: '1px solid #222',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          pointerEvents: 'none',
        }} />
        <div style={{
          position: 'absolute',
          width: 600,
          height: 600,
          borderRadius: '50%',
          border: '1px solid #1a1a1a',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          pointerEvents: 'none',
        }} />

        <div>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8,
            background: '#3DFF7F',
            borderRadius: 4,
            padding: '4px 10px',
          }}>
            <span style={{ fontSize: 11, fontWeight: 700, color: '#000', letterSpacing: 1 }}>SAPIENTIA</span>
          </div>
        </div>

        <div>
          <h1 style={{
            fontSize: 52,
            fontWeight: 800,
            color: '#fff',
            lineHeight: 1.05,
            letterSpacing: -2,
            marginBottom: 20,
          }}>
            Plataforma<br />Acadêmica
          </h1>
          <p style={{ fontSize: 14, color: '#666', lineHeight: 1.6, maxWidth: 320 }}>
            Gestão de turmas, atividades e comunicação entre alunos e professores.
          </p>
        </div>

        <div style={{ display: 'flex', gap: 16 }}>
          {['Turmas', 'Atividades', 'Chat', 'Notas'].map(item => (
            <div key={item} style={{
              padding: '6px 14px',
              border: '0.5px solid #333',
              borderRadius: 20,
              fontSize: 12,
              color: '#666',
            }}>
              {item}
            </div>
          ))}
        </div>
      </div>

      {/* Lado direito — formulário */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '48px',
      }}>
        <div style={{ width: '100%', maxWidth: 360 }}>
          <div style={{ marginBottom: 48 }}>
            <h2 style={{
              fontSize: 32,
              fontWeight: 700,
              color: '#000',
              letterSpacing: -1,
              marginBottom: 8,
            }}>
              Entrar
            </h2>
            <p style={{ fontSize: 14, color: '#888' }}>
              Use suas credenciais institucionais
            </p>
          </div>

          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: 16 }}>
              <label style={{
                display: 'block',
                fontSize: 12,
                fontWeight: 600,
                color: '#000',
                marginBottom: 8,
                letterSpacing: 0.3,
              }}>
                USUÁRIO
              </label>
              <input
                type="text"
                placeholder="seu.usuario"
                value={form.username}
                onChange={e => setForm({ ...form, username: e.target.value })}
                style={{
                  width: '100%',
                  padding: '14px 16px',
                  border: '1.5px solid #e8e8e8',
                  borderRadius: 8,
                  fontSize: 14,
                  outline: 'none',
                  boxSizing: 'border-box',
                  transition: 'border-color .15s',
                  fontFamily: 'inherit',
                }}
                onFocus={e => e.target.style.borderColor = '#3DFF7F'}
                onBlur={e => e.target.style.borderColor = '#e8e8e8'}
              />
            </div>

            <div style={{ marginBottom: 32 }}>
              <label style={{
                display: 'block',
                fontSize: 12,
                fontWeight: 600,
                color: '#000',
                marginBottom: 8,
                letterSpacing: 0.3,
              }}>
                SENHA
              </label>
              <input
                type="password"
                placeholder="••••••••"
                value={form.password}
                onChange={e => setForm({ ...form, password: e.target.value })}
                style={{
                  width: '100%',
                  padding: '14px 16px',
                  border: '1.5px solid #e8e8e8',
                  borderRadius: 8,
                  fontSize: 14,
                  outline: 'none',
                  boxSizing: 'border-box',
                  transition: 'border-color .15s',
                  fontFamily: 'inherit',
                }}
                onFocus={e => e.target.style.borderColor = '#3DFF7F'}
                onBlur={e => e.target.style.borderColor = '#e8e8e8'}
              />
            </div>

            {erro && (
              <div style={{
                marginBottom: 20,
                padding: '12px 16px',
                background: '#fff0f0',
                border: '1px solid #ffc5c5',
                borderRadius: 8,
                fontSize: 13,
                color: '#c00',
              }}>
                {erro}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%',
                padding: '16px',
                background: loading ? '#333' : '#000',
                color: '#fff',
                border: 'none',
                borderRadius: 8,
                fontSize: 14,
                fontWeight: 600,
                cursor: loading ? 'not-allowed' : 'pointer',
                letterSpacing: 0.3,
                transition: 'background .15s',
                fontFamily: 'inherit',
                position: 'relative',
                overflow: 'hidden',
              }}
              onMouseEnter={e => { if (!loading) e.target.style.background = '#3DFF7F'; if (!loading) e.target.style.color = '#000' }}
              onMouseLeave={e => { if (!loading) e.target.style.background = '#000'; if (!loading) e.target.style.color = '#fff' }}
            >
              {loading ? 'Entrando...' : 'Entrar'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}