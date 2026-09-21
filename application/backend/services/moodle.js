const axios = require('axios')
require('dotenv').config()

async function moodle(wsfunction, params = {}, token = null) {
  const { data } = await axios.get(
    `${process.env.MOODLE_URL}/webservice/rest/server.php`,
    {
      params: {
        wstoken: token || process.env.MOODLE_TOKEN,
        moodlewsrestformat: 'json',
        wsfunction,
        ...params
      }
    }
  )

  // Algumas funções do Moodle (como mod_assign_save_grade)
  // retornam null quando dão certo. Se a gente tentar ler .exception
  // de um null, o Node quebra com "Cannot read properties of null".
  if (data && data.exception) {
    throw new Error(data.message || data.exception)
  }

  return data
}

module.exports = moodle