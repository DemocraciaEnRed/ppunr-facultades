const debug = require('debug')
const log = debug('democracyos:db-api:vote')

const utils = require('lib/utils')
const pluck = utils.pluck

const Vote = require('lib/models').Vote

exports.all = function all (fn) {
  log('Looking for all votes.')

  Vote
    .find()
    .sort('-createdAt')
    .exec(function (err, objs) {
      if (err) {
        log('Found error %j', err)
        return fn(err)
      }

      log('Delivering all votes')
      fn(null, objs)
    })
  return this
}

exports.get = function get (id) {
  log('Looking for Vote with id %s', id)

  return Vote
    .findById(id)
    .catch(err => log('Found error %j', err))
    .then(obj => {
      log('Delivering Vote %j', obj)
      return obj
    })
}

exports.getVotesByTopic = function get (topicOId) {
  log('Looking for Vote by topic id %s', topicOId)

  return Vote
    .find({topic: topicOId})
    .catch(err => log('Found error %j', err))
    .then(obj => {
      log('Delivering Votes of topic id %s', topicOId)
      return obj
    })
}

exports.getVotesVotacion = function () {
  log('Looking for Vote of votación')

  return Vote
    .find({value: 'voto'})
    .populate('topic author')
    // primeros creados primero
    .sort('createdAt')
    .catch(err => log('Found error %j', err))
    .then(obj => {
      log('Delivering %s Votes of votación', obj && obj.length)
      return obj
    })
}
