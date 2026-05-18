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
  if (data.exception) throw new Error(data.message)
  return data
}

module.exports = moodle
