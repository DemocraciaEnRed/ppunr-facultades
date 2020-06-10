const debug = require('debug')
const log = debug('democracyos:api:escuela')

const express = require('express')
var utils = require('lib/utils')
var restrict = utils.restrict
var maintenance = utils.maintenance

const dbApi = require('lib/db-api')

const app = module.exports = express.Router()

app.get('/escuela', function (req, res) {
  log('Getting all escuelas')

  dbApi.escuela.all(function (err, objs) {
    if(err) {
      log('Error found: %s', err)
      next(err)
    }

    if (objs && objs.length){
      log('Serving escuelas')
      res.status(200).json(objs)
    }else{
      log('No escuelas found')
      res.status(200).json({})
    }
  })
})
