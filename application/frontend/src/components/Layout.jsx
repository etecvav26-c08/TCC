import Sidebar from './Sidebar'

export default function Layout({ usuario, onLogout, children }) {
  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <Sidebar usuario={usuario} onLogout={onLogout} />
      <main style={{ flex: 1, padding: '32px 40px', maxWidth: 900 }}>
        {children}
      </main>
    </div>
  )
}
