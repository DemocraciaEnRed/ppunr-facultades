const log = require('debug')('democracyos:api-v2:middlewares:users')
const apiV1 = require('lib/db-api')

exports.restrict = function restrict (req, res, next) {
  if (req.user) return next()

  const err = new Error('User is not logged in.')
  err.status = 403
  err.code = 'NOT_LOGGED_IN'

  return next(err)
}

exports.restrictEscuelas = function restrictEscuelas (req, res, next) {
  if (!req.user) {
    const err = new Error('User is not logged in.')
    err.status = 403
    err.code = 'NOT_LOGGED_IN'
    return next(err)
  }else{
    apiV1.user.get(req.user, (err, user) => {
      const userEscuelas = user.escuelas
      const topicEscuela = req.topic.escuela
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
