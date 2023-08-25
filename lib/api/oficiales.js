const debug = require('debug')
const log = debug('democracyos:api:oficiales')

const express = require('express')
var utils = require('lib/utils')
var restrict = utils.restrict
var staff = utils.staff
var maintenance = utils.maintenance

const dbApi = require('lib/db-api')

const app = module.exports = express.Router()

app.get('/oficiales/all',
  restrict,
  staff,
  function getOficailes (req, res, next) {
    log('Getting oficiales')

    dbApi.user.getOficiales().then((oficiales) => {
      if (oficiales) {
        log('Serving oficiales')
        res.status(200).json(oficiales)
        // // we can use dbApi.user.expose.ordinaru(theUser) to expose some of their stuff.
        // var exposedOficiales = oficiales.map(u => dbApi.user.expose.ordinary(u))
        // res.status(200).json(exposedOficiales)
      } else {
        log('No oficiales found')
        res.status(200).json([])
      }
    })
    .catch((err) => {
      res.status(500)
    })
  }
)
app.post('/oficiales/add',
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
  function addOficial (req, res, next) {
    if (req.userFound.oficial) {
      res.status(200).json({
        code: 'ALREADY_OFICIAL',
        message: `El usuario ya es oficial (${req.body.dni ? 'DNI:' : 'Email:'} ${req.body.dni || req.body.email})`
      })
      return
    }
    req.userFound.oficialMesa = true
    req.userFound.save().then((user) => {
      res.status(200).json({
        code: 'OK',
        message: `El usuario ha sido agregado como oficial! (${req.body.dni ? 'DNI' : 'Email:'} - ${req.body.dni || req.body.email})`
      })
    }).catch(err => {
      log(`Error finding user by dni ${req.body.dni}`)
      res.status(500)
      next(err)
    })
  }
)

app.delete('/oficiales/delete',
  restrict,
  staff,
  (req, res, next) => {
    dbApi.user.deleteAllOficiales()
    .then(result => res.status(200).json({result}))
    .catch(err => {
      log(`no se han modificado los usuarios debido a ${err}`)
      res.status(500)
      next(err)
    })
  })


// Deprecated, please use http://localhost:3000/api/v2/oficiales/all/csv
// And check /home/zaqueo/dev/ppunr-facultades/lib/api-v2/oficiales/csv.js

// app.get('/oficiales/all/csv',
//   // restrict,
//   // staff,
//   function getOficiales(req, res, next) {
//     log('Getting oficiales')

//     dbApi.user.getOficiales().then((oficiales) => {
//       if (oficiales) {
//         log('Serving padron')
//         // we can use dbApi.user.expose.ordinaru(theUser) to expose some of their stuff.
//         // var exposedOficiales = oficiales.map(u => dbApi.user.expose.ordinary(u))
//         req.oficiales = oficiales
//         next()
//       } else {
//         req.oficiales = []
//         return []
//       }
//     })
//   },
//   function sendCsv (req, res, next) {
//     var infoOficiales = req.oficiales.map((u) => {
//       return {
//         lastName: u.lastName
//       }
//     })
//     json2csv(infoOficiales, function (err, csv) {
//       if (err) {
//         log('get csv: array to csv error', err)
//         return res.status(500).end()
//       }
//       res.status(200)
//       res.set({
//         'Content-Encoding': 'UTF-8',
//         'Content-Type': 'text/csv; charset=UTF-8',
//         'Content-Disposition': `attachment; filename=oficiales-${Math.floor((new Date()) / 1000)}.csv`
//       })
//       res.write(csv)
//       res.end()
//     }, { prependHeader: false, excelBOM: true })
//   }
// )