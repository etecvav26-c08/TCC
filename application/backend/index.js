const express = require('express')
const cors = require('cors')
const http = require('http')
const { Server } = require('socket.io')
require('dotenv').config()

const authRoutes = require('./routes/auth')
const turmasRoutes = require('./routes/turmas')
const atividadesRoutes = require('./routes/atividades')
const notasRoutes = require('./routes/notas')
const calendarioRoutes = require('./routes/calendario')
const chatRoutes = require('./routes/chat')
const professorRoutes = require('./routes/professor')
const coordenadorRoutes = require('./routes/coordenador')

const app = express()
const server = http.createServer(app)
const io = new Server(server, { cors: { origin: 'http://localhost:5173' } })

app.use(cors({ origin: 'http://localhost:5173' }))
app.use(express.json())

app.use('/api/auth', authRoutes)
app.use('/api/turmas', turmasRoutes)
app.use('/api/atividades', atividadesRoutes)
app.use('/api/notas', notasRoutes)
app.use('/api/calendario', calendarioRoutes)
app.use('/api/chat', chatRoutes)
app.use('/api/professor', professorRoutes)
app.use('/api/coordenador', coordenadorRoutes)

require('./socket/chat')(io)

server.listen(process.env.PORT || 3001, () => {
  console.log(`Backend rodando na porta ${process.env.PORT || 3001}`)
})
