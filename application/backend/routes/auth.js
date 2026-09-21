const express = require('express')
const axios = require('axios')
const jwt = require('jsonwebtoken')
const router = express.Router()

router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body

    // 1) Valida credenciais no Moodle e pega o token PESSOAL do usuário (mobile)
    const { data: loginData } = await axios.get(`${process.env.MOODLE_URL}/login/token.php`, {
      params: { username, password, service: 'moodle_mobile_app' }
    })

    if (loginData.error) {
      return res.status(401).json({ erro: 'Usuário ou senha incorretos' })
    }

    const mobileToken = loginData.token

    // 2) Pega info do usuário usando o token DELE (não o do admin)
    const { data: info } = await axios.get(`${process.env.MOODLE_URL}/webservice/rest/server.php`, {
      params: {
        wstoken: mobileToken, // ← token do próprio usuário que logou
        moodlewsrestformat: 'json',
        wsfunction: 'core_webservice_get_site_info'
      }
    })

    if (info.exception) {
      return res.status(403).json({ erro: info.message })
    }

    // 3) Descobre o papel (aluno / professor / coordenador)
    let papel = 'aluno'
    try {
      const { data: courses } = await axios.get(`${process.env.MOODLE_URL}/webservice/rest/server.php`, {
        params: {
          wstoken: mobileToken,
          moodlewsrestformat: 'json',
          wsfunction: 'core_enrol_get_users_courses',
          userid: info.userid
        }
      })

      if (courses.length > 0) {
        const { data: enrolled } = await axios.get(`${process.env.MOODLE_URL}/webservice/rest/server.php`, {
          params: {
            wstoken: mobileToken,
            moodlewsrestformat: 'json',
            wsfunction: 'core_enrol_get_enrolled_users',
            courseid: courses[0].id
          }
        })
        const thisUser = enrolled.find(u => u.id === info.userid)
        if (thisUser?.roles?.some(r => ['editingteacher', 'teacher', 'manager'].includes(r.shortname))) {
          papel = 'professor'
        }
      }
      if (info.siteadmin) papel = 'coordenador'
    } catch (e) {
      console.log('Erro ao detectar papel:', e.message)
    }

    // 4) Gera o JWT com os dados CORRETOS do usuário logado
    const token = jwt.sign(
      {
        userId: info.userid,
        nome: info.fullname,
        moodleToken: mobileToken, // ← token pessoal do usuário
        papel
      },
      process.env.JWT_SECRET,
      { expiresIn: '8h' }
    )

    console.log(`LOGIN OK: ${username} (papel=${papel}, userId=${info.userid})`)

    res.json({ token, usuario: { id: info.userid, nome: info.fullname, papel } })
  } catch (e) {
    console.log('ERRO NO LOGIN:', e.message)
    res.status(500).json({ erro: e.message })
  }
})

module.exports = router