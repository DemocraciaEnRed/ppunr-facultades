const debug = require('debug')
const log = debug('democracyos:api:facultad')

const express = require('express')
var utils = require('lib/utils')
var restrict = utils.restrict
var maintenance = utils.maintenance

const dbApi = require('lib/db-api')

const app = module.exports = express.Router()

app.get('/facultad', function (req, res) {
  log('Getting all facultades')

  dbApi.facultad.all(function (err, objs) {
    if(err) {
      log('Error found: %s', err)
      next(err)
    }

    if (objs && objs.length){
      log('Serving facultades')
      res.status(200).json(objs)
    }else{
      log('No facultades found')
      res.status(200).json({})
    }
  })
})
