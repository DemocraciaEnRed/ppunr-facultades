const debug = require('debug')
const log = debug('democracyos:db-api:claustro')

const utils = require('lib/utils')
const pluck = utils.pluck

const Claustro = require('lib/models').Claustro

exports.all = function all (fn) {
  log('Looking for all claustros.')

  Claustro
    .find()
    .sort('nombre')
    .exec(function (err, objs) {
      if (err) {
        log('Found error %j', err)
        return fn(err)
      }

      log('Delivering all claustros %o', pluck(objs, 'nombre'))
      fn(null, objs)
    })
  return this
}
