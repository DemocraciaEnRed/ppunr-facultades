const log = require('debug')('democracyos:api-v2:middlewares:users')
const apiV1 = require('lib/db-api')

exports.restrict = function restrict (req, res, next) {
  if (req.user) return next()

  const err = new Error('User is not logged in.')
  err.status = 403
  err.code = 'NOT_LOGGED_IN'

  return next(err)
}

function restrictEscuelas (req, res, next, escuela) {
  if (!req.user) {
    const err = new Error('User is not logged in.')
    err.status = 403
    err.code = 'NOT_LOGGED_IN'
    return next(err)
  }else if (req.user.staff)
    return next()
  else{
    apiV1.user.get(req.user, (err, user) => {
      const userEscuelas = user.escuelas
      const topicEscuela = escuela
      if (userEscuelas.indexOf(topicEscuela) != -1)
        return next()
      else{
        const err = new Error('User not in escuela.')
        err.status = 403
        err.code = 'NOT_IN_ESCUELA'
        return next(err)
      }
    })
  }
}
exports.restrictEscuelasFromTopic = (req, res, next) =>
  restrictEscuelas(req, res, next, req.topic.escuela)
exports.restrictEscuelasFromBody = (req, res, next) =>
  restrictEscuelas(req, res, next, req.body.escuela)
