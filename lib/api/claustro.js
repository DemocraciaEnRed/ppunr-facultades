const debug = require('debug')
const log = debug('democracyos:api:claustro')

const express = require('express')
var utils = require('lib/utils')
var restrict = utils.restrict
var maintenance = utils.maintenance

const dbApi = require('lib/db-api')

const app = module.exports = express.Router()

app.get('/claustro', function (req, res) {
  log('Getting all claustros')

  dbApi.claustro.all(function (err, objs) {
    if(err) {
      log('Error found: %s', err)
      next(err)
    }

    if (objs && objs.length){
      log('Serving claustros')
      res.status(200).json(objs)
    }else{
      log('No claustros found')
      res.status(200).json({})
    }
  })
})
