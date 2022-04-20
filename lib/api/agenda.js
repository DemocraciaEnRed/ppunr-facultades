const debug = require('debug')
const log = debug('democracyos:api:agenda')

const express = require('express')
var utils = require('lib/utils')
var restrict = utils.restrict
var staff = utils.staff
var maintenance = utils.maintenance

const dbApi = require('lib/db-api')

const app = module.exports = express.Router()

app.get('/agenda/all',
  function getAgenda (req, res, next) {
    log('Getting agenda')

    dbApi.agenda.all().then((agenda) => {
      if (agenda) {
        log('Serving agenda')
        res.status(200).json(agenda)
      } else {
        log('No agenda found')
        res.status(200).json([])
      }
    })
    .catch((err) => {
      log(`Error finding agenda`)
      res.status(500)
    })
  }
)

app.post('/agenda/add',
  restrict,
  staff,
  function addToAgenda (req, res, next) {
    log('Adding to agenda')

    dbApi.agenda.add(req.body).then((agenda) => {
      if (agenda) {
        log('Agenda added')
        res.status(200).json(agenda)
      } else {
        log('Error adding to agenda')
        res.status(500)
      }
    })
    .catch((err) => {
      log(`Error adding to agenda`)
      res.status(500)
    })
  }
)

app.put('/agenda/edit',
  restrict,
  staff,
  function editAgenda (req, res, next) {
    log('Editing agenda')

    dbApi.agenda.edit(req.body).then((agenda) => {
      if (agenda) {
        log('Agenda edited')
        res.status(200).json(agenda)
      } else {
        log('Error editing agenda')
        res.status(500)
      }
    })
    .catch((err) => {
      log(`Error editing agenda`)
      res.status(500)
    })
  }
)

app.delete('/agenda/delete',
  restrict,
  staff,
  function deleteAgenda (req, res, next) {
    log('Deleting agenda')
    if (!req.body.id) {
      log('No id provided')
      res.status(400).json({
        code: 'NO_ID_PROVIDED',
        message: 'No se ha proporcionado el id del evento'
      })
      return
    }
    dbApi.agenda.delete(req.body.id).then((agenda) => {
      if (agenda) {
        log('Agenda deleted')
        res.status(200).json(agenda)
      } else {
        log('Error deleting agenda')
        res.status(500)
      }
    })
    .catch((err) => {
      log(`Error deleting agenda`)
      res.status(500)
    })
})

app.post('/agenda/assist',
  restrict,
  function addLoggedUserToEventList (req, res, next) {
    log('Adding logged user to event attendant list')
    // validate it has req.body.id
    if (!req.body.id) {
      log('No id provided')
      res.status(400).json({
        code: 'NO_ID_PROVIDED',
        message: 'No se ha proporcionado el id del evento'
      })
      return
    }
    dbApi.agenda.attend(req.body.id, req.user).then((agenda) => {
      if (agenda) {
        log('User added to attendant list')
        res.status(200).json(agenda)
      } else {
        log('Error adding user to attendant list')
        res.status(500)
      }
    })
    .catch((err) => {
      console.log(err)
      log(`Error adding user to attendant agenda`)
      res.status(500)
      // next()
    })
  }
)
