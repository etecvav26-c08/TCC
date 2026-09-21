const express = require('express')
const moodle = require('../services/moodle')
const authMiddleware = require('../middleware/auth')
const router = express.Router()

router.get('/', authMiddleware, async (req, res) => {
  try {
    const turmas = await moodle(
      'core_enrol_get_users_courses',
      { userid: req.user.userId },
      req.user.moodleToken
    )
    res.json(turmas)
  } catch (e) {
    res.status(500).json({ erro: e.message })
  }
})

module.exports = router
