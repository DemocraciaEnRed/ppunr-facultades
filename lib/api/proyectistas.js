const debug = require('debug')
const log = debug('democracyos:api:proyectistas')

const express = require('express')
var utils = require('lib/utils')
var restrict = utils.restrict
var staff = utils.staff
var maintenance = utils.maintenance

const dbApi = require('lib/db-api')

const app = module.exports = express.Router()

app.get('/proyectistas/all',
  restrict,
  staff,
  function getProyectistas (req, res, next) {
    log('Getting proyectistas')

    dbApi.user.getProyectistas().then((proyectistas) => {
      if (proyectistas) {
        log('Serving proyectistas')
        res.status(200).json(proyectistas)
        // // we can use dbApi.user.expose.ordinaru(theUser) to expose some of their stuff.
        // var exposedProyectistas = proyectistas.map(u => dbApi.user.expose.ordinary(u))
        // res.status(200).json(exposedProyectistas)
      } else {
        log('No proyectistas found')
        res.status(200).json([])
      }
    })
    .catch((err) => {
      res.status(500)
    })
  }
)
app.post('/proyectistas/add',
  restrict,
  staff,
  function findUser (req, res, next) {
    // if req.email exists, find by email. If not, check if req.dni exists, find by dni.
    // if neither exists, return error.
    if (req.body.email) {
      dbApi.user.findByEmail(req.body.email)
      .then((user) => {
        if (!user) {
          log(`User not found by email ${req.body.email}`)
          res.status(200).json({
            code: 'USER_NOT_FOUND',
            message: `No se encontro un usuario con el email ${req.body.email}`
          })
        } else {
          log(`User found by email ${req.body.email}`)
          req.userFound = user
          next()
        }
      })
      .catch(err => {
        log(`Error finding user by email ${req.body.email}`)
        res.status(500)
        next(err)
      })
    } else if (req.body.dni) {
      dbApi.user.findByDNI(req.body.dni)
      .then((user) => {
        if (!user) {
          log(`User not found by dni ${req.body.dni}`)
          res.status(200).json({
            code: 'USER_NOT_FOUND',
            message: `No se encontro un usuario con el dni ${req.body.dni}`
          })
          return
        } else {
          log(`User found by dni ${req.body.dni}`)
          req.userFound = user
          next()
        }
      })
      .catch(err => {
        log(`Error finding user by dni ${req.body.dni}`)
        res.status(500)
        next(err)
      })
    }
  },
  function addProyectista (req, res, next) {
    if (req.userFound.proyectista) {
      res.status(200).json({
        code: 'ALREADY_PROYECTISTA',
        message: `El usuario ya es proyectista (${req.body.dni ? 'DNI:' : 'Email:'} ${req.body.dni || req.body.email})`
      })
      return
    }
    req.userFound.proyectista = true
    req.userFound.save().then((user) => {
      res.status(200).json({
        code: 'OK',
        message: `El usuario ha sido agregado como proyectista! (${req.body.dni ? 'DNI:' : 'Email:'} - ${req.body.dni || req.body.email})`
      })
    }).catch(err => {
      log(`Error finding user by dni ${req.body.dni}`)
      res.status(500)
      next(err)
    })
  }
)

// Deprecated, please use http://localhost:3000/api/v2/proyectistas/all/csv
// And check /home/zaqueo/dev/ppunr-facultades/lib/api-v2/proyectistas/csv.js

// app.get('/proyectistas/all/csv',
//   // restrict,
//   // staff,
//   function getProyectistas(req, res, next) {
//     log('Getting proyectistas')

//     dbApi.user.getProyectistas().then((proyectistas) => {
//       if (proyectistas) {
//         log('Serving padron')
//         // we can use dbApi.user.expose.ordinaru(theUser) to expose some of their stuff.
//         // var exposedProyectistas = proyectistas.map(u => dbApi.user.expose.ordinary(u))
//         req.proyectistas = proyectistas
//         next()
//       } else {
//         req.proyectistas = []
//         return []
//       }
//     })
//   },
//   function sendCsv (req, res, next) {
//     var infoProyectistas = req.proyectistas.map((u) => {
//       return {
//         lastName: u.lastName
//       }
//     })
//     json2csv(infoProyectistas, function (err, csv) {
//       if (err) {
//         log('get csv: array to csv error', err)
//         return res.status(500).end()
//       }
//       res.status(200)
//       res.set({
//         'Content-Encoding': 'UTF-8',
//         'Content-Type': 'text/csv; charset=UTF-8',
//         'Content-Disposition': `attachment; filename=proyectistas-${Math.floor((new Date()) / 1000)}.csv`
//       })
//       res.write(csv)
//       res.end()
//     }, { prependHeader: false, excelBOM: true })
//   }
// )