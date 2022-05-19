const debug = require('debug')
const log = debug('democracyos:api:stats')

const express = require('express')
var utils = require('lib/utils')
var restrict = utils.restrict
var staff = utils.staff
var maintenance = utils.maintenance

const dbApi = require('lib/db-api')

const app = module.exports = express.Router()

app.get('/stats',
  restrict,
  staff,
  async function getStats (req, res, next) {
    log('Getting stats')
    // send 200
    let usersNotvalidated = await dbApi.user.getUsersNotEmailValidated()
    let usersNotvalidatedCount = usersNotvalidated.length
    let emailUsersNotValidated = usersNotvalidated.map(user => {
      return {
        email: user.email,
        lastName: user.lastName,
        firstName: user.firstName,
        createdAt: user.createdAt,
        claustro: user.claustro ? user.claustro.nombre : '-',
        facultad: user.facultad ? user.facultad.abreviacion : '-'
      }
    })

    res.status(200).json({
      stats: {
        users: await dbApi.user.getUsersCount(),
        userNotEmailValidated: usersNotvalidatedCount,
        topics: await dbApi.topic.getCount(),
        likes: await dbApi.topic.sumProyectistasInTopics(),
        attendies: await dbApi.agenda.sumAttendiesInAgenda(),
        comments: await dbApi.topic.getCommentsCount(),
        replies: await dbApi.topic.sumRepliesInComments(),
        emailsNotValidated: emailUsersNotValidated
      }
    })
  }
)
