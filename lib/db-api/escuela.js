const debug = require('debug')
const log = debug('democracyos:db-api:escuela')

const utils = require('lib/utils')
const pluck = utils.pluck

const Escuela = require('lib/models').Escuela

exports.all = function all (fn) {
  log('Looking for all escuelas.')

  Escuela
    .find()
    .sort('nombre')
    .exec(function (err, objs) {
      if (err) {
        log('Found error %j', err)
        return fn(err)
      }

      log('Delivering all escuelas %o', pluck(objs, 'nombre'))
      fn(null, objs)
    })
  return this
}

exports.get = function get (id) {
  log('Looking for Escuela with id %s', id)

  return Escuela
    .findById(id)
    .catch(err => log('Found error %j', err))
    .then(obj => {
      log('Delivering Escuela %j', obj)
      return obj
    })
}
