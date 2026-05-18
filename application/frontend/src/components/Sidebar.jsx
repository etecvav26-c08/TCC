import { useNavigate, useLocation } from 'react-router-dom'

const itens = [
  { path: '/dashboard', icon: '⌂', label: 'Dashboard' },
  { path: '/turmas', icon: '◫', label: 'Turmas' },
  { path: '/atividades', icon: '◻', label: 'Atividades' },
  { path: '/notas', icon: '◈', label: 'Notas' },
  { path: '/chat', icon: '◉', label: 'Chat' },
  { path: '/calendario', icon: '◷', label: 'Calendário' },
  { path: '/feedbacks', icon: '◆', label: 'Feedbacks' },
  { path: '/mensagens', icon: '◎', label: 'Mensagens' },
]

export default function Sidebar({ usuario, onLogout }) {
  const navigate = useNavigate()
  const location = useLocation()

  return (
    <aside style={{
      width: 220, minHeight: '100vh', borderRight: '0.5px solid #e0e0e0',
      display: 'flex', flexDirection: 'column', padding: '24px 0'
    }}>
      <div style={{ padding: '0 20px 24px', borderBottom: '0.5px solid #e0e0e0', marginBottom: 16 }}>
        <div style={{ fontSize: 20, fontWeight: 500, letterSpacing: -1 }}>EduPlat</div>
        <div style={{ fontSize: 11, color: '#888', marginTop: 2 }}>Plataforma acadêmica</div>
      </div>

      <div style={{ fontSize: 10, color: '#aaa', padding: '0 20px 8px', textTransform: 'uppercase', letterSpacing: 1 }}>Principal</div>
      {itens.slice(0, 4).map(item => (
        <div
          key={item.path}
          onClick={() => navigate(item.path)}
          style={{
            display: 'flex', alignItems: 'center', gap: 10,
            padding: '10px 20px', fontSize: 13, cursor: 'pointer',
            color: location.pathname === item.path ? '#000' : '#666',
            borderLeft: location.pathname === item.path ? '2px solid #000' : '2px solid transparent',
            background: location.pathname === item.path ? '#f5f5f5' : 'transparent',
            fontWeight: location.pathname === item.path ? 500 : 400
          }}
        >
          <span>{item.icon}</span> {item.label}
        </div>
      ))}

      <div style={{ fontSize: 10, color: '#aaa', padding: '16px 20px 8px', textTransform: 'uppercase', letterSpacing: 1 }}>Comunicação</div>
      {itens.slice(4).map(item => (
        <div
          key={item.path}
          onClick={() => navigate(item.path)}
          style={{
            display: 'flex', alignItems: 'center', gap: 10,
            padding: '10px 20px', fontSize: 13, cursor: 'pointer',
            color: location.pathname === item.path ? '#000' : '#666',
            borderLeft: location.pathname === item.path ? '2px solid #000' : '2px solid transparent',
            background: location.pathname === item.path ? '#f5f5f5' : 'transparent',
            fontWeight: location.pathname === item.path ? 500 : 400
          }}
        >
          <span>{item.icon}</span> {item.label}
        </div>
      ))}

      <div style={{ marginTop: 'auto', padding: '16px 20px', borderTop: '0.5px solid #e0e0e0' }}>
        <div style={{ fontSize: 13, fontWeight: 500 }}>{usuario?.nome}</div>
        <div style={{ fontSize: 11, color: '#888', marginBottom: 10 }}>Aluno</div>
        <button onClick={onLogout} style={{ fontSize: 12, color: '#666', background: 'none', border: '0.5px solid #ddd', borderRadius: 6, padding: '6px 12px', cursor: 'pointer' }}>
          Sair
        </button>
      </div>
    </aside>
  )
}
