const express = require('express')
const moodle = require('../services/moodle')
const authMiddleware = require('../middleware/auth')
const router = express.Router()

// Lista todos os usuários que compartilham alguma turma comigo
router.get('/usuarios', authMiddleware, async (req, res) => {
  try {
    const token = req.user.moodleToken
    const meuId = req.user.userId

    const cursos = await moodle('core_enrol_get_users_courses', { userid: meuId }, token)
    if (!cursos || cursos.length === 0) return res.json([])

    const usuarios = new Map()

    for (const curso of cursos) {
      try {
        const inscritos = await moodle('core_enrol_get_enrolled_users', { courseid: curso.id }, token)
        for (const u of inscritos || []) {
          if (Number(u.id) === Number(meuId)) continue
          if (!usuarios.has(u.id)) {
            const papel = u.roles?.[0]?.shortname || 'student'
            usuarios.set(u.id, {
              id: u.id,
              nome: u.fullname,
              email: u.email,
              papel: papel === 'student' ? 'Aluno'
                : (papel === 'teacher' || papel === 'editingteacher') ? 'Professor'
                : papel === 'manager' ? 'Coordenador'
                : 'Usuário',
            })
          }
        }
      } catch (e) {
        // Se falhar num curso, continua nos outros
      }
    }

    res.json(Array.from(usuarios.values()).sort((a, b) => a.nome.localeCompare(b.nome)))
  } catch (e) {
    console.log('Erro ao buscar usuários do chat:', e.message)
    res.status(500).json({ erro: e.message })
  }
})

// Histórico de DM entre mim e outro usuário
router.get('/historico/:outroId', authMiddleware, (req, res) => {
  try {
    const { getHistoricoDM } = require('../socket/chat')
    const meuId = req.user.userId
    const outroId = req.params.outroId

    const mensagens = getHistoricoDM(meuId, outroId).map(m => ({
      ...m,
      minha: Number(m.deUserId) === Number(meuId),
    }))

    res.json(mensagens)
  } catch (e) {
    console.log('Erro ao buscar histórico DM:', e.message)
    res.status(500).json({ erro: e.message })
  }
})

// Histórico de mensagens de uma turma (grupo)
router.get('/historico-turma/:turmaId', authMiddleware, (req, res) => {
  try {
    const { getHistoricoGrupo } = require('../socket/chat')
    const meuId = req.user.userId

    const mensagens = getHistoricoGrupo(req.params.turmaId).map(m => ({
      ...m,
      minha: Number(m.userId) === Number(meuId),
    }))

    res.json(mensagens)
  } catch (e) {
    console.log('Erro ao buscar histórico de turma:', e.message)
    res.status(500).json({ erro: e.message })
  }
})

module.exports = router