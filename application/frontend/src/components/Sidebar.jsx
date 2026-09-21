import { useNavigate, useLocation } from 'react-router-dom'

const GREEN = '#3DFF7F'

const menuAluno = [
  { section: 'Principal', itens: [
    { path: '/dashboard', icon: '▣', label: 'Dashboard' },
    { path: '/turmas', icon: '◫', label: 'Turmas' },
    { path: '/atividades', icon: '◻', label: 'Atividades' },
    { path: '/notas', icon: '◈', label: 'Notas' },
  ]},
  { section: 'Comunicação', itens: [
    { path: '/chat', icon: '◉', label: 'Mensagens' },
    { path: '/calendario', icon: '◷', label: 'Calendário' },
    { path: '/feedbacks', icon: '◆', label: 'Feedbacks' },
  ]}
]

const menuProfessor = [
  { section: 'Principal', itens: [
    { path: '/dashboard', icon: '▣', label: 'Dashboard' },
    { path: '/turmas', icon: '◫', label: 'Minhas Turmas' },
    { path: '/atividades', icon: '◻', label: 'Atividades' },
  ]},
  { section: 'Comunicação', itens: [
    { path: '/chat', icon: '◉', label: 'Mensagens' },
    { path: '/calendario', icon: '◷', label: 'Calendário' },
  ]}
]

const menuCoordenador = [
  { section: 'Gestão', itens: [
    { path: '/dashboard', icon: '▣', label: 'Dashboard' },
    { path: '/turmas', icon: '◫', label: 'Painel de Turmas' },
    { path: '/avaliar', icon: '✎', label: 'Avaliar Turmas' },
    { path: '/notas', icon: '◈', label: 'Notas' },
  ]},
  { section: 'Comunicação', itens: [
    { path: '/chat', icon: '◉', label: 'Mensagens' },
    { path: '/calendario', icon: '◷', label: 'Calendário' },
  ]}
]

export default function Sidebar({ usuario, onLogout }) {
  const navigate = useNavigate()
  const location = useLocation()
  const papel = usuario?.papel || 'aluno'
  const menu = papel === 'professor' ? menuProfessor : papel === 'coordenador' ? menuCoordenador : menuAluno

  return (
    <aside style={{
      width: 220, minHeight: '100vh', background: '#000',
      display: 'flex', flexDirection: 'column',
      fontFamily: "'Inter', system-ui, sans-serif",
    }}>
      <div style={{ padding: '28px 20px 24px' }}>
        <div style={{
          display: 'inline-flex', alignItems: 'center',
          background: GREEN, borderRadius: 4, padding: '4px 10px', marginBottom: 6,
        }}>
          <span style={{ fontSize: 11, fontWeight: 800, color: '#000', letterSpacing: 1 }}>SAPIENTIA</span>
        </div>
        <div style={{ fontSize: 11, color: '#444', marginTop: 4 }}>Plataforma acadêmica</div>
      </div>

      <div style={{ borderTop: '1px solid #111', marginBottom: 8 }} />

      {menu.map(({ section, itens }) => (
        <div key={section} style={{ marginBottom: 8 }}>
          <div style={{ fontSize: 10, fontWeight: 600, color: '#444', padding: '12px 20px 6px', letterSpacing: 1.2, textTransform: 'uppercase' }}>
            {section}
          </div>
          {itens.map(item => {
            const ativo = location.pathname === item.path
            return (
              <div
                key={item.path}
                onClick={() => navigate(item.path)}
                style={{
                  display: 'flex', alignItems: 'center', gap: 10,
                  padding: '10px 20px', fontSize: 13,
                  fontWeight: ativo ? 600 : 400, cursor: 'pointer',
                  color: ativo ? '#000' : '#555',
                  background: ativo ? GREEN : 'transparent',
                  borderRadius: ativo ? '0 20px 20px 0' : 0,
                  marginRight: ativo ? 12 : 0, transition: 'all .12s',
                }}
                onMouseEnter={e => { if (!ativo) e.currentTarget.style.color = '#fff' }}
                onMouseLeave={e => { if (!ativo) e.currentTarget.style.color = '#555' }}
              >
                <span style={{ fontSize: 14 }}>{item.icon}</span>
                {item.label}
              </div>
            )
          })}
        </div>
      ))}

      <div style={{ marginTop: 'auto', borderTop: '1px solid #111', padding: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
          <div style={{
            width: 34, height: 34, borderRadius: '50%', background: GREEN,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 12, fontWeight: 700, color: '#000', flexShrink: 0,
          }}>
            {usuario?.nome?.charAt(0) || 'U'}
          </div>
          <div>
            <div style={{ fontSize: 12, fontWeight: 600, color: '#fff' }}>{usuario?.nome}</div>
            <div style={{ fontSize: 10, color: '#444', textTransform: 'capitalize' }}>{papel}</div>
          </div>
        </div>
        <button onClick={onLogout} style={{
          width: '100%', padding: '8px', background: 'transparent',
          border: '1px solid #222', borderRadius: 6, color: '#555',
          fontSize: 12, cursor: 'pointer', fontFamily: 'inherit', transition: 'all .12s',
        }}
          onMouseEnter={e => { e.target.style.borderColor = GREEN; e.target.style.color = GREEN }}
          onMouseLeave={e => { e.target.style.borderColor = '#222'; e.target.style.color = '#555' }}
        >
          Sair
        </button>
      </div>
    </aside>
  )
}