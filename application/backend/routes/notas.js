const express = require('express')
const moodle = require('../services/moodle')
const authMiddleware = require('../middleware/auth')
const router = express.Router()

// Converte uma string de nota ("9,50" ou "9.50000") para número.
// Retorna null se não for um número válido.
function paraNumero(valor) {
  if (valor === null || valor === undefined || valor === '-') return null
  const numero = parseFloat(String(valor).replace(',', '.'))
  return isNaN(numero) ? null : numero
}

// Normaliza a nota para escala 0-10.
// O Moodle às vezes manda gradeformatted="9.50" com grademax=100 (porque a
// nota já está na escala certa mas o max está errado). Por isso:
//   - Se a nota já é <= 10, mantém como está (é 9.5, não 0.95)
//   - Se a nota é > 10, aí sim precisa dividir pelo máximo e multiplicar por 10
function normalizar(nota, maximo) {
  if (nota === null) return { nota: null, maximo: 10 }

  // Já está em escala 0-10 → mantém
  if (nota <= 10) return { nota, maximo: 10 }

  // Nota > 10 → está em outra escala (geralmente 0-100)
  if (maximo && maximo > 10) {
    return { nota: (nota / maximo) * 10, maximo: 10 }
  }

  // Sem informação de máximo, assume 100
  return { nota: (nota / 100) * 10, maximo: 10 }
}

router.get('/', authMiddleware, async (req, res) => {
  try {
    const token = req.user.moodleToken
    const userId = req.user.userId

    const cursos = await moodle('core_enrol_get_users_courses', { userid: userId }, token)
    if (!cursos || cursos.length === 0) return res.json([])

    const notas = []

    for (const curso of cursos) {
      try {
        const gradeData = await moodle('gradereport_user_get_grade_items', { courseid: curso.id, userid: userId }, token)
        const items = gradeData.usergrades?.[0]?.gradeitems || []

        // Item do tipo "course" = nota final da disciplina
        const itemCurso = items.find(item => item.itemtype === 'course')
        const notaCursoBruta = paraNumero(itemCurso?.gradeformatted)
        const maxCursoBruto = paraNumero(itemCurso?.grademax)
        const normalizado = normalizar(notaCursoBruta, maxCursoBruto)

        // Itens de módulo (tarefas, quizzes, etc.)
        const itensValidos = items
          .filter(item => item.itemtype === 'mod')
          .map(item => {
            const notaBruta = paraNumero(item.gradeformatted)
            const maxBruto = paraNumero(item.grademax)
            const norm = normalizar(notaBruta, maxBruto)
            return {
              nome: item.itemname,
              nota: norm.nota !== null ? norm.nota.toFixed(1).replace('.', ',') : '—',
              notaNum: norm.nota ?? 0,
              maximo: norm.maximo,
            }
          })
          .filter(item => item.notaNum > 0)

        notas.push({
          curso: curso.fullname,
          shortname: curso.shortname,
          nota: normalizado.nota !== null ? normalizado.nota.toFixed(1).replace('.', ',') : null,
          notaNum: normalizado.nota ?? 0,
          maximo: normalizado.maximo,
          itens: itensValidos,
        })
      } catch (e) {
        notas.push({
          curso: curso.fullname,
          shortname: curso.shortname,
          nota: null,
          notaNum: 0,
          maximo: 10,
          itens: [],
        })
      }
    }

    res.json(notas)
  } catch (e) {
    res.status(500).json({ erro: e.message })
  }
})

module.exports = router