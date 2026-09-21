// Histórico em memória (DM e grupos).
const historicoDM = new Map()      // chave: "menorId-maiorId" | valor: [msgs]
const historicoGrupo = new Map()   // chave: turmaId          | valor: [msgs]

function chaveDM(idA, idB) {
  const a = Number(idA)
  const b = Number(idB)
  return a < b ? `${a}-${b}` : `${b}-${a}`
}

function getHistoricoDM(userIdA, userIdB) {
  return historicoDM.get(chaveDM(userIdA, userIdB)) || []
}

function getHistoricoGrupo(turmaId) {
  return historicoGrupo.get(String(turmaId)) || []
}

module.exports = (io) => {
  io.on('connection', (socket) => {
    // Identificar-se com o próprio user id (pra receber DMs)
    socket.on('identificar', (userId) => {
      if (userId) socket.join(`user-${userId}`)
    })

    // Entrar numa sala de turma
    socket.on('entrar-turma', (turmaId) => {
      if (turmaId) socket.join(`turma-${turmaId}`)
    })

    // Sair de uma sala de turma
    socket.on('sair-turma', (turmaId) => {
      if (turmaId) socket.leave(`turma-${turmaId}`)
    })

    // ---- MENSAGEM DIRETA ----
    socket.on('dm', ({ deUserId, paraUserId, texto, usuario }) => {
      if (!deUserId || !paraUserId || !texto) return

      const mensagem = {
        texto,
        usuario,
        deUserId: Number(deUserId),
        paraUserId: Number(paraUserId),
        hora: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
        timestamp: Date.now(),
      }

      const chave = chaveDM(deUserId, paraUserId)
      const conversa = historicoDM.get(chave) || []
      conversa.push(mensagem)
      historicoDM.set(chave, conversa)

      // Só pro destinatário (o remetente já tem localmente)
      io.to(`user-${paraUserId}`).emit('dm', mensagem)
    })

    // ---- MENSAGEM DE GRUPO ----
    socket.on('mensagem-turma', ({ turmaId, texto, usuario, userId }) => {
      if (!turmaId || !texto) return

      const mensagem = {
        texto,
        usuario,
        userId: Number(userId),
        turmaId: Number(turmaId),
        hora: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
        timestamp: Date.now(),
      }

      const conversa = historicoGrupo.get(String(turmaId)) || []
      conversa.push(mensagem)
      historicoGrupo.set(String(turmaId), conversa)

      // Manda pra TODOS da sala (incluindo o remetente).
      // O frontend evita duplicação checando se já tem a mensagem.
      io.to(`turma-${turmaId}`).emit('mensagem-turma', mensagem)
    })

    socket.on('disconnect', () => {})
  })
}

module.exports.getHistoricoDM = getHistoricoDM
module.exports.getHistoricoGrupo = getHistoricoGrupo