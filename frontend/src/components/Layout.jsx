import Sidebar from './Sidebar'

export default function Layout({ usuario, onLogout, children }) {
  return (
    <div style={{
      display: 'flex',
      minHeight: '100vh',
      background: '#fff',
      fontFamily: "'Inter', system-ui, sans-serif",
    }}>
      <Sidebar usuario={usuario} onLogout={onLogout} />
      <main style={{
        flex: 1,
        padding: '40px 48px',
        overflowY: 'auto',
        maxWidth: 960,
      }}>
        {children}
      </main>
    </div>
  )
}