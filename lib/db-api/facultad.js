const debug = require('debug')
const log = debug('democracyos:db-api:facultad')

const utils = require('lib/utils')
const pluck = utils.pluck

const Facultad = require('lib/models').Facultad

exports.all = function all (fn) {
  log('Looking for all facultades.')

  Facultad
    .find()
    .sort('abreviacion')
    .exec(function (err, objs) {
      if (err) {
        log('Found error %j', err)
        return fn(err)
      }

      log('Delivering all facultades %o', pluck(objs, 'nombre'))
      fn(null, objs)
    })
  return this
}

exports.get = function get (id, opts) {
  opts = opts || {}
  const {noLog} = opts
  if (!noLog)
    log('Looking for Facultad with id %s', id)

  return Facultad
    .findById(id)
    .catch(err => log('Found error %j', err))
    .then(obj => {
      if (!noLog)
        log('Delivering Facultad %j', obj)
      return obj
    })
}
