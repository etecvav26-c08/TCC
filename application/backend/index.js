const express = require('express')
const cors = require('cors')
const http = require('http')
const { Server } = require('socket.io')
require('dotenv').config()

const authRoutes = require('./routes/auth')
const turmasRoutes = require('./routes/turmas')
const atividadesRoutes = require('./routes/atividades')
const chatRoutes = require('./routes/chat')

const app = express()
const server = http.createServer(app)
const io = new Server(server, {
  cors: { origin: 'http://localhost:5173' }
})

app.use(cors({ origin: 'http://localhost:5173' }))
app.use(express.json())

app.use('/api/auth', authRoutes)
app.use('/api/turmas', turmasRoutes)
app.use('/api/atividades', atividadesRoutes)
app.use('/api/chat', chatRoutes)

require('./socket/chat')(io)

server.listen(process.env.PORT || 3001, () => {
  console.log(`Servidor rodando na porta ${process.env.PORT || 3001}`)
})
