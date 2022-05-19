const debug = require('debug')
const log = debug('democracyos:api:proyectistas')

const express = require('express')
var utils = require('lib/utils')
var restrict = utils.restrict
var staff = utils.staff
//var maintenance = utils.maintenance
const json2csv = require('json-2-csv').json2csv
const moment = require('moment')


const dbApi = require('lib/db-api')

const app = module.exports = express.Router()

function escapeTxt (text) {
  if (!text) return ''
  text += ''
  return text.replace(/"/g, '\'').replace(/\r/g, '').replace(/\n/g, '')
}

app.get('/stats/registrosNoValidos/csv',
  restrict,
  staff,
  function getProyectistas(req, res, next) {
    log('Getting proyectistas')

    dbApi.user.getUsersNotEmailValidated().then((proyectistas) => {
      if (proyectistas) {
        log('Serving padron')
        req.proyectistas = proyectistas
        next()
      } else {
        req.proyectistas = []
        return []
      }
    })
  },
  function sendCsv (req, res, next) {
    var infoProyectistas = req.proyectistas.map((u) => {
      return [
        u.firstName,
        u.lastName,
        u.dni,
        u.email,
        u.claustro && u.claustro.nombre ? escapeTxt(u.claustro.nombre) : '??',
        u.facultad && u.facultad.nombre ? escapeTxt(u.facultad.nombre) : '??',
        moment(u.createdAt).format('YYYY-MM-DD HH:mm:ss')
      ]
    })
    var data = [['Nombre', 'Apellido', 'DNI', 'Email', 'Claustro', 'Facultad', 'Fecha de registro']]
    data = data.concat(infoProyectistas)
    json2csv(data, function (err, csv) {
      if (err) {
        log('get csv: array to csv error', err)
        return res.status(500).end()
      }
      res.status(200)
      res.set({
        'Content-Encoding': 'UTF-8',
        'Content-Type': 'text/csv; charset=UTF-8',
        'Content-Disposition': `attachment; filename=registrosNoValidados-${Math.floor((new Date()) / 1000)}.csv`
      })
      res.write(csv)
      res.end()
    }, { prependHeader: false, excelBOM: true })
  }
)