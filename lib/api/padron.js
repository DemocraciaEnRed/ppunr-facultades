const debug = require('debug')
const log = debug('democracyos:api:padron')

const express = require('express')
var utils = require('lib/utils')
var restrict = utils.restrict
var staff = utils.staff
var maintenance = utils.maintenance
const middlewares = require('lib/api-v2/middlewares')
const { Vote } = require('lib/models')

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
  middlewares.forums.findByName,
  function (req, res, next) {
    if (req.user && req.user.oficialMesa){
      log('User is oficialMesa')
      return next()
    }
    return middlewares.forums.privileges.canEdit(req, res, next) 
  },
  // middlewares.forums.privileges.canEdit,
  // Obtenemos el votante
  function (req, res, next) {
    const dni = req.query.dni

    log('Getting padron with DNI %s', dni)

    dbApi.padron.isDNIPadron(dni)
    .then(padron => {
      if (padron) {
        log('Serving padron')
        req.padron = padron
        next()
      } else {
        log('No padron found')
        res.status(200).json({})
      }
    })
  },
  // Le agregamos los votos
  function (req, res) {
    const dni = req.query.dni

    var keys = ['_id',
    'dni',
    'user'
  ].join(' ')    

    log('Getting votes by DNI %s', dni)
    Vote.find({ dni: dni, value: 'voto' })
    .then(topicVote => {
      let response = utils.expose(keys)(req.padron)
      response.id = response._id
      if (topicVote) {
        log('Serving votes')
        response.votes = topicVote.length > 0 ? topicVote.map(v => v.topic) : []
      } else { 
        log('No votes found')
      }
      res.status(200).json(response)
    })
  }),
  // Retornamos

app.post('/padron/new',
  restrict,
  staff,
  function (req, res, next) {
    dbApi.padron.create(req.body, function (err, newPadron) {
      if (err) return next(err)
      log('OK! New entry in padron')
      res.status(200).json(newPadron)
    })
  })

app.delete('/padron/votes/clean',
  restrict,
  staff,
  function (req, res, next) {
    log('Cleaning votes')
    Vote.remove({}, function (err, removed) {
      if (err) return next(err)
      log('OK! Votes cleaned')
      res.status(200).json(removed)
    })
  }
)  