module.exports = (io) => {
  io.on('connection', (socket) => {
    socket.on('entrar-turma', (turmaId) => {
      socket.join(`turma-${turmaId}`)
    })

    socket.on('mensagem', ({ turmaId, texto, usuario }) => {
      io.to(`turma-${turmaId}`).emit('mensagem', {
        texto,
        usuario,
        hora: new Date().toISOString()
      })
    })

    socket.on('disconnect', () => {})
  })
}
