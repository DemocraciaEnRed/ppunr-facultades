const debug = require('debug')
const log = debug('democracyos:api:padron')

const express = require('express')
var utils = require('lib/utils')
var restrict = utils.restrict
var staff = utils.staff
var maintenance = utils.maintenance

const dbApi = require('lib/db-api')

const app = module.exports = express.Router()

app.get('/padron/search/full',
  restrict,
  staff,
  function (req, res) {
    const dni = req.query.dni
    const escuela = req.query.escuela

    log('Getting padron with dni %s', `${dni}`)

    dbApi.padron.isInPadron(dni).then(padron => {
      if (padron) {
        log('Serving padron')
        res.status(200).json(padron)
      } else {
        log('No padron found')
        res.status(200).json({})
      }
    })
  })

app.get('/padron/search/dni',
  restrict,
  staff,
  function (req, res) {
    const dni = req.query.dni

    log('Getting padron with DNI %s', dni)

    dbApi.padron.isDNIPadron(dni).then(padron => {
      if (padron) {
        log('Serving padron')
        res.status(200).json(padron)
      } else {
        log('No padron found')
        res.status(200).json({})
      }
    })
  })

app.post('/padron/new',
  restrict,
  staff,
  function (req, res, next) {

    // dbApi.escuela.get(req.body.escuela).then(escuela => {
    //   if (escuela) {
    //     log('Found escuela')
    //     const payload = {
    //       dni: req.body.dni,
    //       escuela: escuela
    //     }
    //     dbApi.padron.create(payload, (err, newPadron) => {
    //       if (err) return next(err)
    //       log('OK! New entry in padron')
    //       // var keys = [
    //       //   'id hash name color image createdAt'
    //       // ].join(' ')
    //       res.status(200).json(newPadron)
    //     })
    //   } else {
    //     log('No escuela')
    //     next(err)
    //   }
    // })
    dbApi.padron.create(req.body, function (err, newPadron) {
      if (err) return next(err)
      log('OK! New entry in padron')
      // var keys = [
      //   'id hash name color image createdAt'
      // ].join(' ')
      res.status(200).json(newPadron)
    })
  })