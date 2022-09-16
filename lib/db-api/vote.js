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

exports.getVotesPipeline = function(fn) {

  log('Looking for Vote of votación getVotesPipeline')

  return Vote.aggregate(
      [
        {
          '$lookup': {
            'from': 'topics', 
            'localField': 'topic', 
            'foreignField': '_id', 
            'as': 'topic'
          }
        }, {
          '$unwind': {
            'path': '$topic', 
            'includeArrayIndex': 'topicIndex', 
            'preserveNullAndEmptyArrays': true
          }
        }, {
          '$group': {
            '_id': '$author', 
            'totalVotes': {
              '$sum': 1
            }, 
            'votes': {
              '$push': '$topic'
            }
          }
        }, {
          '$lookup': {
            'from': 'users', 
            'localField': '_id', 
            'foreignField': '_id', 
            'as': 'user'
          }
        }, {
          '$unwind': {
            'path': '$user', 
            'includeArrayIndex': 'userIndex', 
            'preserveNullAndEmptyArrays': true
          }
        }
      ]
    )
    .then(obj => {
      log('Delivering Votes got with pipelines')
      return obj
    })
    .catch(err => log('Found error %j', err))
}

exports.getVotesByAuthor = function getVotesByAuthor (userId) {
  log('Looking for Vote by author id %s', userId)

  return Vote
    .find({author: userId})
    .catch(err => log('Found error %j', err))
    .then(obj => {
      log('Delivering Votes of author id %s', userId)
      return obj
    })
}

exports.getVotesByDni = function getVotesByDni (dni) {
  log('Looking for Vote by dni %s', dni)

  return Vote
    .find({dni: dni})
    .catch(err => log('Found error %j', err))
    .then(obj => {
      log('Delivering Votes of dni %s', dni)
      return obj
    })
}