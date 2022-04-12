const debug = require('debug')
const log = debug('democracyos:api:agenda')

const express = require('express')
var utils = require('lib/utils')
var restrict = utils.restrict
var staff = utils.staff
// var maintenance = utils.maintenance
const json2csv = require('json-2-csv').json2csv

const dbApi = require('lib/db-api')

const app = module.exports = express.Router()

function escapeTxt (text) {
  if (!text) return ''
  text += ''
  return text.replace(/"/g, '\'').replace(/\r/g, '').replace(/\n/g, '')
}

app.get('/agenda/:id/attendees',
  restrict,
  staff,
  function getAgenda(req, res, next) {
    log('Getting attende list')

    dbApi.agenda.get(req.params.id).then((agenda) => {
      if (agenda) {
        log('Serving agenda')
        req.agenda = agenda
        next()
      } else {
        log('No agenda found')
        res.status(404).send()
      }
    })
  },
  async function populateUser (req, res, next){
    // for every user in asistentes array, populate fields claustro and facultad
    var asistentesPromise = []
    
    req.asistentesPopulated = []
    for (let i = 0; i < req.agenda.asistentes.length; i++){
      asistentesPromise.push(dbApi.user.getFullUserById(req.agenda.asistentes[i], true))
    }
    Promise.all(asistentesPromise)
      .then((asistentes) => {
        req.asistentesPopulated = asistentes
        next()
      })
      .catch((err) => {
        log('Error populating asistentes', err)
        res.status(500).send()
      })
      
  },
  function sendCsv (req, res, next) {
    console.log(req.asistentesPopulated)
    var infoUsers = req.asistentesPopulated.map((u) => {
      return [
        u.firstName,
        u.lastName,
        u.dni,
        u.email,
        u.claustro && u.claustro.nombre ? escapeTxt(u.claustro.nombre) : '??',
        u.facultad && u.facultad.nombre ? escapeTxt(u.facultad.nombre) : '??'
      ]
    })
    var data = [[`${req.agenda.nombre} - ${req.agenda.fecha} ${req.agenda.hora}`, '', '', '', '', ''], ['Nombre', 'Apellido', 'DNI', 'Email', 'Claustro', 'Facultad']]
    data = data.concat(infoUsers)
    json2csv(data, function (err, csv) {
      if (err) {
        log('get csv: array to csv error', err)
        return res.status(500).end()
      }
      res.status(200)
      res.set({
        'Content-Encoding': 'UTF-8',
        'Content-Type': 'text/csv; charset=UTF-8',
        'Content-Disposition': `attachment; filename=lista-evento-${req.agenda.fecha}-${req.agenda.hora.replace(':','-')}.csv`
      })
      res.write(csv)
      res.end()
    }, { prependHeader: false, excelBOM: true })
  }
)
