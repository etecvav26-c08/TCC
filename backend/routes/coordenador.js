const express = require('express')
const moodle = require('../services/moodle')
const authMiddleware = require('../middleware/auth')
const router = express.Router()

router.get('/turmas', authMiddleware, async (req, res) => {
  try {
    const data = await moodle('core_course_get_courses', {}, req.user.moodleToken)
    res.json((data || []).filter(c => c.id !== 1))
  } catch (e) { res.status(500).json({ erro: e.message }) }
})

router.post('/turmas', authMiddleware, async (req, res) => {
  try {
    const { nome, shortname, descricao } = req.body
    if (!nome || !shortname) return res.status(400).json({ erro: 'Nome e nome curto são obrigatórios' })
    const result = await moodle('core_course_create_courses', {
      'courses[0][fullname]': nome, 'courses[0][shortname]': shortname,
      'courses[0][categoryid]': 1, 'courses[0][summary]': descricao || '',
      'courses[0][summaryformat]': 1, 'courses[0][format]': 'topics', 'courses[0][visible]': 1,
    }, req.user.moodleToken)
    res.json({ sucesso: true, turma: result[0] })
  } catch (e) { res.status(500).json({ erro: e.message }) }
})

router.get('/usuarios', authMiddleware, async (req, res) => {
  try {
    const { busca } = req.query
    if (!busca || busca.length < 2) return res.json([])
    const data = await moodle('core_user_get_users', {
      'criteria[0][key]': 'firstname', 'criteria[0][value]': `%${busca}%`,
    }, req.user.moodleToken)
    res.json((data.users || []).map(u => ({ id: u.id, nome: u.fullname, email: u.email, usuario: u.username })))
  } catch (e) { res.status(500).json({ erro: e.message }) }
})

router.post('/turmas/:id/matricular', authMiddleware, async (req, res) => {
  try {
    const { userId, papel } = req.body
    if (!userId) return res.status(400).json({ erro: 'userId é obrigatório' })
    await moodle('enrol_manual_enrol_users', {
      'enrolments[0][roleid]': papel === 'professor' ? 3 : 5,
      'enrolments[0][userid]': userId,
      'enrolments[0][courseid]': req.params.id,
    }, process.env.MOODLE_TOKEN)
    res.json({ sucesso: true })
  } catch (e) { res.status(500).json({ erro: e.message }) }
})

router.get('/turmas/:id/participantes', authMiddleware, async (req, res) => {
  try {
    const data = await moodle('core_enrol_get_enrolled_users', { courseid: req.params.id }, req.user.moodleToken)
    res.json((data || []).map(u => ({
      id: u.id, nome: u.fullname, email: u.email,
      papeis: u.roles?.map(r => r.shortname) || [],
    })))
  } catch (e) { res.status(500).json({ erro: e.message }) }
})

module.exports = router
