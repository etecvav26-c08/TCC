import { useState } from 'react'
import api from '../api'

export default function Login({ onLogin }) {
  const [form, setForm] = useState({ username: '', password: '' })
  const [erro, setErro] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)
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
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ width: 360, padding: '40px', border: '0.5px solid #e0e0e0', borderRadius: 12 }}>
        <h1 style={{ fontSize: 24, fontWeight: 500, marginBottom: 8 }}>EduPlat</h1>
        <p style={{ color: '#888', fontSize: 14, marginBottom: 32 }}>Plataforma acadêmica</p>
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: 16 }}>
            <label style={{ fontSize: 13, color: '#555', display: 'block', marginBottom: 6 }}>Usuário</label>
            <input
              type="text"
              placeholder="seu.usuario"
              value={form.username}
              onChange={e => setForm({ ...form, username: e.target.value })}
              style={{ width: '100%', padding: '10px 12px', border: '0.5px solid #ddd', borderRadius: 8, fontSize: 14 }}
            />
          </div>
          <div style={{ marginBottom: 24 }}>
            <label style={{ fontSize: 13, color: '#555', display: 'block', marginBottom: 6 }}>Senha</label>
            <input
              type="password"
              placeholder="••••••••"
              value={form.password}
              onChange={e => setForm({ ...form, password: e.target.value })}
              style={{ width: '100%', padding: '10px 12px', border: '0.5px solid #ddd', borderRadius: 8, fontSize: 14 }}
            />
          </div>
          {erro && <p style={{ color: 'red', fontSize: 13, marginBottom: 16 }}>{erro}</p>}
          <button
            type="submit"
            disabled={loading}
            style={{ width: '100%', padding: '12px', background: '#000', color: '#fff', border: 'none', borderRadius: 8, fontSize: 14, cursor: 'pointer' }}
          >
            {loading ? 'Entrando...' : 'Entrar'}
          </button>
        </form>
      </div>
    </div>
  )
}
