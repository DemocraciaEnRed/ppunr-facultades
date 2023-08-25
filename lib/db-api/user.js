const debug = require('debug')
const escapeStringRegexp = require('escape-string-regexp')
const User = require('lib/models').User
const utils = require('lib/utils')
const pluck = utils.pluck
const expose = utils.expose

const log = debug('democracyos:db-api:user')

/**
 * Get all users
 *
 * @param {Function} fn callback function
 *   - 'err' error found while process or `null`
 *   - 'users' list items found or `undefined`
 * @return {Module} `user` module
 * @api public
 */

exports.all = function all (fn) {
  log('Looking for all users.')

  User
    .find()
    .sort('-createdAt')
    .exec(function (err, users) {
      if (err) {
        log('Found error %j', err)
        return fn(err)
      }

      log('Delivering all users %j', pluck(users, 'id'))
      fn(null, users)
    })
  return this
}

/**
 * Get User for `id` string or `ObjectId`
 *
 * @param {String|ObjectId} id User's `id`
 * @param {Function} fn callback function
 *   - 'err' error found while process or `null`
 *   - 'user' single object created or `undefined`
 * @api public
 */

exports.get = function get (id, fn) {
  log('Looking for User %s', id)

  User
    .findById(id)
    .exec(function (err, user) {
      if (err) {
        log('Found error %j', err)
        return fn(err)
      }

      log('Delivering User %j', user)
      fn(null, user)
    })
  return this
}

/**
 * Search `User` objects from query
 *
 * @param {String} query string to search by `hash`
 * @param {Function} fn callback function
 *   - 'err' error found while process or `null`
 *   - 'users' list of `User` objects found or `undefined`
 * @return {Module} `user` module
 * @api public
 */

exports.search = function search (text, fn) {
  log('Searching for users matching %s', text)

  if (typeof text !== 'string') return fn(new Error('Invalid search term.'))

  if (text.length >= 256) return fn(new Error('Search term too long.'))

  let query = User.find().limit(10)

  if (text.includes('@')) {
    query = query.where({ email: text })
  } else {
    const searchTerm = escapeStringRegexp(text).replace(/\s+/g, '|')
    const regex = new RegExp(searchTerm, 'ig')

    query = query.or([
      { firstName: { $regex: regex } },
      { lastName: { $regex: regex } }
    ])
  }

  query.exec(function (err, users) {
    if (err) {
      log('Found error: %j', err)
      return fn(err)
    }

    log('Found users %j for text "%s"', users.length, text)
    fn(null, users)
  })

  return this
}

/**
 * Get `User` objects whose email has been validated
 *
 * @param {Function} fn callback function
 *   - 'err' error found while process or `null`
 *   - 'users' list of `User` objects found or `undefined`
 * @return {Module} `user` module
 * @api public
 */

exports.findEmailValidated = function findEmailValidated (fn) {
  log('Searching for email validated users matching')

  User.find({ emailValidated: true })
    .exec(function (err, users) {
      if (err) {
        log('Found error: %j', err)
        return fn(err)
      }

      log('Found %d email validated users', users.length)
      fn(null, users)
    })

  return this
}

/**
 * Find `User` object by email
 *
 * @param {String} The email of the user
 * @param {Function} fn callback function
 *   - 'err' error found while process or `null`
 *   - 'user' the `User` object found or `undefined`
 * @return {Module} `user` module
 * @api public
 */

exports.getByEmail = function search (email, fn) {
  log('Searching for User with email %s', email)

  User.findOne({ email: email })
    .select('firstName lastName fullName email avatar profilePictureUrl notifications emailValidated extra')
    .exec(function (err, user) {
      if (err) {
        log('Found error: %j', err)
        return fn(err)
      }

      if (!user) {
        log('User not found for email %s', email)
        return fn(null, false)
      }

      log('Found User %j for email %s', user.id, email)
      fn(null, user)
    })

  return this
}

/**
 * User interfaces functions.
 */

exports.expose = {}

/**
 * Expose user attributes to be used on a private manner.
 * e.g.: '/api/user/me' call from an authenticated user.
 *
 * @param {User} user.
 * @return {Hash} user attributes
 * @api public
 */

exports.expose.confidential = function exposeConfidential (user) {
  return expose(exports.expose.confidential.keys)(user)
}

exports.expose.confidential.keys = [
  'id',
  'firstName',
  'lastName',
  'displayName',
  'email',
  'avatar',
  'staff',
  'notifications',
  'locale',
  'privileges',
  'claustro',
  'facultad',
  'dni',
  'voto',
  'proyectista',
  'oficialMesa'
]

/**
 * Expose user attributes to be used publicly.
 * e.g.: Search calls, users listings.
 *
 * @param {User} user.
 * @return {Hash} user attributes
 * @api public
 */

exports.expose.ordinary = function exposeOrdinary (user) {
  return expose(exports.expose.ordinary.keys)(user)
}

exports.expose.ordinary.keys = [
  'id',
  'fullName',
  'displayName',
  'avatar',
  'badge',
  'locale'
]

const api = require('lib/db-api')

// ojo que esta función no solo se llama desde populateOwners
exports.populateUser = function populateUser(user, withLastName, noLog){
  return Promise.all([
    api.facultad.get(user.facultad, {noLog: noLog}),
    api.claustro.get(user.claustro, {noLog: noLog}),
    withLastName ? User.findOne({ _id: user.id }).select('lastName') : undefined
  ]).then((results) => {
    const [ facultad, claustro, userData ] = results
    user.facultad = facultad
    user.claustro = claustro
    if (withLastName && userData)
      user.lastName = userData.lastName
  })
}

exports.populateOwners = function populateOwners(topics, withLastName){
  return Promise.all(topics.map(topic =>
    // ojo que populateUser se llama también desde otras partes del código
    exports.populateUser(topic.owner, true, true)
  )).then(() => topics)
}

exports.populateProyectistas = function populateProyectistas(topics){
  // agarramos ids únicos de todos los proyectistas de los topics
  let uniqueIds = []
  topics.forEach(t => t.proyectistas && t.proyectistas.length && t.proyectistas.forEach(userId =>
    uniqueIds.includes(userId) || uniqueIds.push(userId)
  ))
  log('Populating proyectistas ids %j', uniqueIds)
  // traemos data de usuarios de ids únicos
  return Promise.all(
    uniqueIds.map(userId => User.findOne({ _id: userId }).select('email'))
  ).then((users)=>{
    // pisamos ids de proyectistas por objetos (en topics)
    let usersDict = {}
    users.forEach(u => usersDict[u._id] = u)
    topics.forEach(topic => topic.proyectistas = topic.proyectistas.map(proyectistaId => usersDict[proyectistaId]))
    log('Populed proyectistas users ids')
  })
}

exports.findIds = function findIds (query) {
  log('Finding users ids with query %j', query)

  return User
      .find()
      .select('_id')
      .where(query)
}

exports.getFullUserById = function getFullUserById(userId, withLastName){
  return User.findOne({ _id: userId }).select(
    exports.expose.confidential.keys.join(' ')
  ).then(user => {
    if (!user)
      throw new Error(`User with id ${userId} not found`)
    else
      return Promise.all([
        user,
        api.facultad.get(user.facultad),
        api.claustro.get(user.claustro),
      ])
  }).then((results) => {
    const [ user, facultad, claustro ] = results
    user.facultad = facultad
    user.claustro = claustro
    return user
  })
}

exports.getProyectistas = () => {
  log('Looking for all users with proyectista = true.')

  return User.find({ proyectista: true }).populate('claustro').populate('facultad').then((users) => {
    if (!users)
      throw new Error(`Proyectistas not found`)
    else
      log('Delivering all users with proyectista = true %j', pluck(users, 'id'))
      return users
  })
}

exports.deleteAllProyectistas = () => {
  log('changing the users proyectista field to false.')


  return User.updateMany({"proyectista": true},{$set: {"proyectista": false}}).
  exec()
  .then(results => results)
}


// exports.addProyectistaDNI = (dni) => {
//   // Look for user with dni, if found, modify proyectista to true
//   log('Looking for user with dni %s', dni)
  
//   return User.findOne({ dni: dni }).then((user) => {
//     if (!user) {
//       throw new Error(`User with dni ${dni} not found`)
//     }
//     log('Setting user as proyectista dni %s', dni)
//     user.proyectista = true
//     return user.save()
//   })
// }

// exports.addProyectistaEmail = (email) => {
//   // Look for user with email, if found, modify proyectista to true
//   log('Looking for user with email %s', email)
//   return User.findOne({ email: email }).then((user) => {
//     if (!user) {
//       throw new Error(`User with email ${email} not found`)
//     }
//     log('Setting user as proyectista email %s', email)
//     user.proyectista = true
//     return user.save()
//   })
// }

exports.findByEmail = (email) => {
  log('Looking for user with email %s', email)
  return User.findOne({ email: email })
}

exports.findByDNI = (dni) => {
  log('Looking for user with dni %s', dni)
  return User.findOne({ dni: dni })
}

exports.findByDNIWithAll = (dni) => {
  log('Looking for user with dni %s', dni)
  return User.findOne({ dni: dni }).populate('claustro facultad')
}

exports.getAllUsersInDNIArray = (dniArray) => {
  log('Looking for users with dni %j', dniArray)
  return User.find({ dni: { $in: dniArray } }).populate('claustro facultad')
}

exports.getUsersNotEmailValidated = () => {
  log('Looking for users with emailValidated = false')
  return User.find({ emailValidated: false }).populate('claustro').populate('facultad')
}

exports.getUsersCount = () => {
  log('Counting users')
  return User.count()
}
  
exports.getUsersWhoDidntVoted = (dniArray) => {
  log('Looking for users who didnt voted')
  return User.find({ dni: { $nin: dniArray } })
}
exports.getUsersWhoDidntVotedWithClaustroAndFacultad = (dniArray) => {
  log('Looking for users who didnt voted')
  return User.find({ dni: { $nin: dniArray } }).populate('claustro').populate('facultad')
}


exports.getOficiales = () => {
  log('Looking for all users with oficialMesa = true.')

  return User.find({ oficialMesa: true }).populate('claustro').populate('facultad').then((users) => {
    if (!users){
      throw new Error(`Oficiales not found`)
    }
    else {
      log('Delivering all users with oficialMesa = true %j', pluck(users, 'id'))
      return users
    }
  })
}

exports.addOficialDNI = (dni) => {
  // Look for user with dni, if found, modify oficialMesa to true
  log('Looking for user with dni %s', dni)
  
  return User.findOne({ dni: dni }).then((user) => {
    if (!user) {
      throw new Error(`User with dni ${dni} not found`)
    }
    log('Setting user as oficial mesa dni %s', dni)
    user.oficialMesa = true
    return user.save()
  })
}

exports.addOficialEmail = (email) => {
  // Look for user with email, if found, modify oficialMesa to true
  log('Looking for user with email %s', email)
  return User.findOne({ email: email }).then((user) => {
    if (!user) {
      throw new Error(`User with email ${email} not found`)
    }
    log('Setting user as oficial mesa email %s', email)
    user.oficialMesa = true
    return user.save()
  })
}

exports.deleteAllOficiales = () => {
  log('changing the users oficiales field to false.')
  return User.updateMany({"oficialMesa": true}, { $set: {"oficialMesa": false }})
  .exec()
  .then((results) => results)
}