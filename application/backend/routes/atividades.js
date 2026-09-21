const express = require('express')
const axios = require('axios')
const FormData = require('form-data')
const moodle = require('../services/moodle')
const authMiddleware = require('../middleware/auth')
const multer = require('multer')
const router = express.Router()

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 50 * 1024 * 1024 }, // 50 MB
})

// Deixa a nota bonitinha: "9.50000" vira "9,5" | "10.00000" vira "10"
function formatarNota(valor) {
  if (valor === null || valor === undefined) return null
  const numero = parseFloat(valor)
  if (isNaN(numero)) return valor // se não for número, devolve como veio
  // Se for inteiro (10, 8, 7), mostra sem decimal. Senão, 1 casa com vírgula.
  return Number.isInteger(numero) ? String(numero) : numero.toFixed(1).replace('.', ',')
}

// ============================================
// Lista todas as atividades do aluno logado
// ============================================
router.get('/', authMiddleware, async (req, res) => {
  try {
    const token = req.user.moodleToken
    const userId = req.user.userId

    const cursos = await moodle('core_enrol_get_users_courses', { userid: userId }, token)
    if (!cursos || cursos.length === 0) return res.json([])

    const params = {}
    cursos.forEach((c, i) => { params[`courseids[${i}]`] = c.id })

    const assignData = await moodle('mod_assign_get_assignments', params, token)
    const atividades = []

    for (const course of assignData.courses || []) {
      for (const assign of course.assignments || []) {
        let status = 'pendente'
        let nota = null
        let feedback = null

        try {
          const sub = await moodle('mod_assign_get_submission_status', { assignid: assign.id }, token)
          if (sub.lastattempt?.submission?.status === 'submitted') {
            status = 'entregue'
          }
          if (sub.feedback?.grade?.grade && sub.feedback.grade.grade !== '-') {
            status = 'corrigido'
            nota = formatarNota(sub.feedback.grade.grade)
            feedback = sub.feedback.plugins?.find(p => p.type === 'comments')?.editorfields?.[0]?.text || null
          }
        } catch (e) {
          // Se falhar, mantém como pendente
        }

        atividades.push({
          id: assign.id,
          cmid: assign.cmid,
          name: assign.name,
          descricao: assign.intro?.replace(/<[^>]*>/g, '') || '',
          curso: course.fullname,
          cursoId: course.id,
          duedate: assign.duedate
            ? new Date(assign.duedate * 1000).toLocaleDateString('pt-BR')
            : 'Sem prazo',
          duetimestamp: assign.duedate,
          status,
          nota,
          feedback,
        })
      }
    }

    atividades.sort((a, b) => (a.duetimestamp || 0) - (b.duetimestamp || 0))
    res.json(atividades)
  } catch (e) {
    res.status(500).json({ erro: e.message })
  }
})

// ============================================
// Entrega uma atividade (upload de arquivo)
// ============================================
router.post('/:id/entregar', authMiddleware, upload.single('arquivo'), async (req, res) => {
  try {
    const token = req.user.moodleToken

    if (!req.file) {
      return res.status(400).json({ erro: 'Nenhum arquivo enviado' })
    }

    // PASSO 1: Usa o endpoint /webservice/upload.php do Moodle
    // (o core_files_upload não funciona com token de aluno comum).
    // Esse endpoint aceita multipart/form-data e devolve o itemid do draft.
    const form = new FormData()
    form.append('token', token)
    form.append('filearea', 'draft')
    form.append('itemid', '0')
    form.append('filename', req.file.originalname)
    form.append('file', req.file.buffer, {
      filename: req.file.originalname,
      contentType: req.file.mimetype || 'application/octet-stream',
    })

    const { data: uploadData } = await axios.post(
      `${process.env.MOODLE_URL}/webservice/upload.php`,
      form,
      { headers: form.getHeaders(), maxBodyLength: Infinity }
    )

    console.log('Resposta do upload.php:', JSON.stringify(uploadData, null, 2))

    // O Moodle retorna um array. Se vier erro, vem como objeto com "error".
    if (!Array.isArray(uploadData) || !uploadData[0]?.itemid) {
      const msg = uploadData?.error || uploadData?.message || 'Falha no upload pro Moodle'
      throw new Error(msg)
    }

    const draftItemId = uploadData[0].itemid

    // PASSO 2: Vincula o arquivo do rascunho à submissão da tarefa.
    await moodle('mod_assign_save_submission', {
      assignmentid: req.params.id,
      'plugindata[files_filemanager]': draftItemId,
    }, token)

    res.json({ sucesso: true, mensagem: 'Atividade entregue com sucesso!' })
  } catch (e) {
    console.log('ERRO ao entregar atividade:', e.message)
    res.status(500).json({ erro: e.message })
  }
})

module.exports = router