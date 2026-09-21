const express = require('express')
const moodle = require('../services/moodle')
const authMiddleware = require('../middleware/auth')
const router = express.Router()

router.get('/', authMiddleware, async (req, res) => {
  try {
    const token = req.user.moodleToken
    const now = Math.floor(Date.now() / 1000)
    const future = now + (60 * 24 * 60 * 60)

    const data = await moodle('core_calendar_get_action_events_by_timesort', {
      timesortfrom: now,
      timesortto: future,
      limitnum: 50,
    }, token)

    console.log('CALENDÁRIO - eventos do Moodle:', JSON.stringify(data, null, 2))

    const eventos = (data.events || []).map(e => ({
      id: e.id,
      titulo: e.name,
      descricao: (e.description || '').replace(/<[^>]*>/g, ''),
      data: new Date(e.timesort * 1000).toLocaleDateString('pt-BR'),
      hora: new Date(e.timesort * 1000).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
      dia: new Date(e.timesort * 1000).getDate(),
      mes: new Date(e.timesort * 1000).toLocaleString('pt-BR', { month: 'short' }).replace('.', ''),
      timestamp: e.timesort,
      tipo: e.modulename || e.eventtype || 'default',
      curso: e.course?.fullname || null,
    }))

    eventos.sort((a, b) => a.timestamp - b.timestamp)
    res.json(eventos)
  } catch (e) {
    console.log('ERRO CALENDÁRIO:', e.message)
    res.status(500).json({ erro: e.message })
  }
})

module.exports = router