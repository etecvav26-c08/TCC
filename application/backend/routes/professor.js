const express = require('express')
const moodle = require('../services/moodle')
const authMiddleware = require('../middleware/auth')
const router = express.Router()

// Pega todas as turmas do professor logado
router.get('/turmas', authMiddleware, async (req, res) => {
  try {
    const cursos = await moodle('core_enrol_get_users_courses', { userid: req.user.userId }, req.user.moodleToken)
    res.json(cursos || [])
  } catch (e) { res.status(500).json({ erro: e.message }) }
})

// Traz a galera matriculada numa turma específica
router.get('/turmas/:id/alunos', authMiddleware, async (req, res) => {
  try {
    const alunos = await moodle('core_enrol_get_enrolled_users', { courseid: req.params.id }, req.user.moodleToken)
    res.json((alunos || []).map(u => ({
      id: u.id,
      nome: u.fullname,
      email: u.email,
      papel: u.roles?.[0]?.shortname || 'student',
    })))
  } catch (e) { res.status(500).json({ erro: e.message }) }
})

// Lista as tarefas que já foram criadas nessa turma
router.get('/turmas/:id/atividades', authMiddleware, async (req, res) => {
  try {
    const data = await moodle('mod_assign_get_assignments', { 'courseids[0]': req.params.id }, req.user.moodleToken)
    res.json((data.courses?.[0]?.assignments || []).map(a => ({
      id: a.id,
      nome: a.name,
      descricao: a.intro?.replace(/<[^>]*>/g, '') || '',
      prazo: a.duedate ? new Date(a.duedate * 1000).toLocaleDateString('pt-BR') : 'Sem prazo',
      duedate: a.duedate,
    })))
  } catch (e) { res.status(500).json({ erro: e.message }) }
})

// Lista as submissões de uma atividade (com os arquivos enviados por cada aluno)
router.get('/atividades/:id/submissoes', authMiddleware, async (req, res) => {
  try {
    const token = req.user.moodleToken

    const data = await moodle('mod_assign_get_submissions', {
      'assignmentids[0]': req.params.id,
    }, token)

    const submissions = data.assignments?.[0]?.submissions || []

    const resultado = submissions.map(s => ({
      userid: s.userid,
      status: s.status, // 'submitted' | 'new' | 'draft'
      tentativa: s.attemptnumber,
      arquivos: (s.plugins || [])
        .filter(p => p.type === 'file')
        .flatMap(p => (p.fileareas || []).flatMap(fa =>
          (fa.files || []).map(f => {
            // O Moodle devolve o fileurl SEM token. Precisamos anexar
            // pra que o navegador consiga baixar o arquivo.
            const separador = f.fileurl.includes('?') ? '&' : '?'
            return {
              nome: f.filename,
              url: `${f.fileurl}${separador}token=${token}`,
              tamanho: f.filesize,
              mimetype: f.mimetype,
              enviado: f.timemodified,
            }
          })
        )),
    }))

    res.json(resultado)
  } catch (e) {
    console.log('Erro ao buscar submissões:', e.message)
    res.status(500).json({ erro: e.message })
  }
})

// Salva a nota (e feedback) de um aluno numa tarefa
router.post('/atividades/:id/nota', authMiddleware, async (req, res) => {
  try {
    const { userId, nota, feedback } = req.body
    if (!userId || nota === undefined) {
      return res.status(400).json({ erro: 'userId e nota são obrigatórios' })
    }

    const token = req.user.moodleToken

    // 1) Descobre qual tentativa o aluno enviou (0, 1, 2...)
    // A API do save_grade exige o número real, não aceita -1 em todo caso.
    let attemptnumber = 0
    try {
      const subs = await moodle('mod_assign_get_submissions', {
        'assignmentids[0]': req.params.id,
      }, token)

      const minhas = (subs.assignments?.[0]?.submissions || [])
        .filter(s => Number(s.userid) === Number(userId))

      if (minhas.length > 0) {
        // Pega a última tentativa (maior attemptnumber)
        attemptnumber = Math.max(...minhas.map(s => s.attemptnumber))
      }
    } catch (e) {
      console.log('Não consegui pegar attemptnumber, usando 0:', e.message)
    }

    // 2) Salva a nota com o attemptnumber correto
    await moodle('mod_assign_save_grade', {
      assignmentid: req.params.id,
      userid: userId,
      grade: nota,
      attemptnumber,
      addattempt: 0,
      workflowstate: 'graded',
      applytoall: 0,
      'plugindata[assignfeedbackcomments_editor][text]': feedback || '',
      'plugindata[assignfeedbackcomments_editor][format]': 1,
    }, token)

    res.json({ sucesso: true })
  } catch (e) {
    console.log('ERRO ao salvar nota:', e.message)
    res.status(500).json({ erro: e.message })
  }
})

module.exports = router