const express = require('express')
const axios = require('axios')
const jwt = require('jsonwebtoken')
const moodle = require('../services/moodle')
const router = express.Router()

router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body
    const { data } = await axios.get(`${process.env.MOODLE_URL}/login/token.php`, {
      params: { username, password, service: 'moodle_mobile_app' }
    })
    if (data.error) return res.status(401).json({ erro: 'Credenciais inválidas' })

    const info = await moodle('core_webservice_get_site_info', {}, data.token)
    const token = jwt.sign(
      { userId: info.userid, nome: info.fullname, moodleToken: data.token },
      process.env.JWT_SECRET,
      { expiresIn: '8h' }
    )
    res.json({ token, usuario: { id: info.userid, nome: info.fullname } })
  } catch (e) {
    res.status(500).json({ erro: e.message })
  }
})

module.exports = router
