const express = require('express')
const debug = require('debug')
const json2xls = require('ext/node_modules/json2xls')
const moment = require('moment')
// const middlewaresNew = require('lib/api-v2/middlewares')
const middlewares = require('lib/api-v2/middlewares')
var api = require('lib/db-api')

const log = debug('democracyos:api:topic:xslx')
const app = module.exports = express.Router()


const titles = [
  'Topic ID',
  'Topic Title',
  'Topic Category'
]

function escapeTxt (text) {
  if (!text) return ''
  text += ''
  return text.replace(/"/g, '\'').replace(/\r/g, '').replace(/\n/g, '')
}

app.use(json2xls.middleware)

app.get('/export/topics/xlsx',
  middlewares.users.restrict,
  middlewares.forums.findByName,
  middlewares.topics.findAllFromForum,
  middlewares.forums.privileges.canChangeTopics,
  /*function getAllTags(req, res, next) {
    api.tag.all(function (err, tags) {
      let tagsName = {}
      if (err) {
        log('error serving tags from DB:', err)
        return res.status(500).end()
      }
      tags.forEach(t => tagsName[t.id] = t.name)
      req.tagsName = tagsName
      next()
    })
  },*/
  function getAllUserMails(req, res, next) {
    api.user.all(function (err, users) {
      let usersMail = {}
      if (err) {
        log('error serving users from DB:', err)
        return res.status(500).end()
      }
      users.forEach(u => usersMail[u._id] = u.email)
      req.usersMail = usersMail
      next()
    })
  },
  (req, res, next) => Promise.all(
    // populamos owners (parecido a populateOwners)
    req.topics.map(topic =>
      api.user.getFullUserById(topic.owner, true).then(user => {
        topic.owner = user
        return topic
      })
    )
  ).then((topics) => Promise.all(
    // populamos votos
    topics.map(topic =>
      api.vote.getVotesByTopic(topic._id).then(votes => {
        topic.action.results = votes.map(v => req.usersMail[v.author])
        return topic
      })
    )
  )).then((topics) => {
    req.topics = topics
    next()
  }),
  (req, res, next) =>
    api.user.populateProyectistas(req.topics).then(() => next())
  ,
  function getXlsx(req, res, next) {
    let infoTopics = []
    const attrsNames = req.forum.topicsAttrs
      .map((attr) => attr.name)

    req.topics.forEach((topic) => {
      if (topic.attrs === undefined) {
        topic.attrs = {}
      }
      let theTopic = {
        'Idea ID': topic.id,
        'Idea Fecha': `${escapeTxt(moment(topic.createdAt, '', req.locale).format('LL LT'))}`,
        'Idea Título': `${escapeTxt(topic.mediaTitle)}`,
        'Idea Temas': `${escapeTxt(topic.tags.join(', '))}`,
        'Idea Facultad': `${escapeTxt(topic.owner.facultad && topic.owner.facultad.abreviacion)}`,
        'Idea Texto': `${escapeTxt(topic.attrs['problema'])}`,
        'Autor/a nombre': `${escapeTxt(topic.owner.firstName)}`,
        'Autor/a apellido': `${escapeTxt(topic.owner.lastName)}`,
        'Autor/a email': `${escapeTxt(topic.owner.email)}`,
        'Autor/a claustro': `${escapeTxt(topic.owner.claustro && topic.owner.claustro.nombre)}`,
        'Autor/a género': `${escapeTxt(topic.attrs['genero'])}`,
        'Seguidores cantidad': `${escapeTxt(topic.action.count)}`,
        'Seguidores emails': `${escapeTxt(topic.action.results.join(', '))}`,
        'Proyectistas cantidad': `${escapeTxt(topic.proyectistas && topic.proyectistas.length)}`,
        'Proyectistas emails': `${escapeTxt(topic.proyectistas && topic.proyectistas.map(p=>p.email).join(','))}`
      }

      /*attrsNames.map((name) => {
        theTopic[name] = `${escapeTxt(topic.attrs[name])}` || ''
      });*/
      infoTopics.push(theTopic);
    });
    try {
      res.xls(`ideas-facultades.xlsx`, infoTopics);
    } catch (err) {
      log('get csv: array to csv error', err)
      return res.status(500).end()
    }
  })

app.get('/export/topics/export-resultados',
  middlewares.users.restrict,
  middlewares.forums.findByName,
  middlewares.forums.privileges.canChangeTopics,
  // cargar claustros a req
  (req, res, next) =>
    api.claustro.all(function (err, claustros) {
      let claustrosName = {}
      if (err) {
        log('error serving claustros from DB:', err)
        return res.status(500).end()
      }
      claustros.forEach(c => claustrosName[c._id] = c.nombre)
      req.claustrosName = claustrosName
      next()
    })
  ,
  // cargar facultades a req
  (req, res, next) =>
    api.facultad.all(function (err, facultades) {
      let facultadesName = {}
      if (err) {
        log('error serving facultades from DB:', err)
        return res.status(500).end()
      }
      facultades.forEach(f => facultadesName[f._id] = f.abreviacion)
      req.facultadesName = facultadesName
      next()
    })
  ,
  // cargar votos a req
  (req, res, next) =>
    api.vote.getVotesVotacion().then(votes => {
      req.votes = votes || []
      next()
    })
  ,
  function getXlsx(req, res, next) {
    let infoVotes = []

    req.votes.forEach((vote) => {
      const topicAttrs = vote.topic.attrs
      const theVote = {
        'Fecha': `${escapeTxt(moment(vote.createdAt, '', req.locale).format('LL LT'))}`,
        'Facultad': `${escapeTxt(req.facultadesName[vote.author.facultad])}`,
        'Claustro': `${escapeTxt(req.claustrosName[vote.author.claustro])}`,
        '#Proyecto': `${escapeTxt(topicAttrs.numero || '')}`,
        'Título Proyecto': `${escapeTxt(vote.topic.mediaTitle)}`,
      }
      infoVotes.push(theVote);
    });
    try {
      res.xls(`resultados-votacion.xlsx`, infoVotes);
    } catch (err) {
      log('get csv: array to csv error', err)
      return res.status(500).end()
    }
})


app.get('/export/topics/export-resultados-proyectos',
  middlewares.users.restrict,
  middlewares.forums.findByName,
  middlewares.topics.findAllFromForum,
  middlewares.forums.privileges.canChangeTopics,
  function getAllFacultades(req, res, next) {
    api.facultad.all(function (err, facultades) {
      let facultadesName = {}
      if (err) {
        log('error serving facultades from DB:', err)
        return res.status(500).end()
      }
      facultades.forEach(e => facultadesName[e._id] = e.nombre)
      req.facultadesName = facultadesName
      next()
    })
  },
  function getAllUserMails(req, res, next) {
    api.user.all(function (err, users) {
      let usersMail = {}
      if (err) {
        log('error serving users from DB:', err)
        return res.status(500).end()
      }
      users.forEach(u => usersMail[u._id] = u.email)
      req.usersMail = usersMail
      next()
    })
  },
  (req, res, next) => Promise.all(
    // populamos owners (parecido a populateOwners)
    req.topics.map(topic =>
      api.user.getFullUserById(topic.owner, true).then(user => {
        topic.owner = user
        return topic
      })
    )
  ).then((topics) => Promise.all(
    // populamos votos
    topics.map(topic =>
      api.vote.getVotesByTopic(topic._id).then(votes => {
        topic.action.results = votes.map(v => req.usersMail[v.author])
        return topic
      })
    )
  )).then((topics) => {
    req.topics = topics
    next()
  }),
  (req, res, next) =>
    api.user.populateProyectistas(req.topics).then(() => next())
  ,
  function getXlsx(req, res, next) {
    let infoTopics = []
    req.topics.forEach((topic) => {
      if (topic.attrs === undefined) {
        topic.attrs = {}
      }
      console.log(topic.facultad)
      let theTopic = {
        '#Proyecto': `${escapeTxt(topic.attrs['numero'])}`,
        'Título Proyecto': `${escapeTxt(topic.mediaTitle)}`,
        'Cantidad Votos': `${topic.action.results.length}`,
      }
      infoTopics.push(theTopic);
    });
    try {
      res.xls(`resultados-votacion-proyectos.xlsx`, infoTopics);
    } catch (err) {
      log('get csv: array to csv error', err)
      return res.status(500).end()
    }
})


app.get('/export/topics/export-resultados-votantes',
  middlewares.users.restrict,
  middlewares.forums.findByName,
  middlewares.topics.findAllFromForum,
  middlewares.forums.privileges.canChangeTopics,
  // cargar facultades a req
  (req, res, next) => {
    api.facultad.all(function (err, facultades) {
      let facultadesName = {}
      if (err) {
        log('error serving facultades from DB:', err)
        return res.status(500).end()
      }
      facultades.forEach(e => facultadesName[e._id] = e.abreviacion)
      req.facultadesName = facultadesName
      next()
    })
  },
  // cargar claustros a req
  (req, res, next) =>
    api.claustro.all(function (err, claustros) {
      let claustrosName = {}
      if (err) {
        log('error serving claustros from DB:', err)
        return res.status(500).end()
      }
      claustros.forEach(c => claustrosName[c._id] = c.nombre)
      req.claustrosName = claustrosName
      next()
    }),  
  // cargar votos
  function getAllVotos(req, res, next) {
    api.vote.all(function (err, votes) {
      if (err) {
        log('error serving votes from DB:', err)
        return res.status(500).end()
      }
      req.votes = votes
      next()
    })
  },
  function getAllVotantes(req, res, next) {
    api.user.all(function (err, users) {
      if (err) {
        log('error serving votantes from DB:', err)
        return res.status(500).end()
      }
      req.votantes = users
      next()
    })
  },
  function getXlsx(req, res, next) {
    let infoVotantes = []
    req.votantes.forEach((votante) => {
      if (!votante.staff) {
        if (votante.attrs === undefined) {
          votante.attrs = {}
        }
        
        const votes_for_author = req.votes.filter((vote) => vote.author.toString() === votante.id)
        let theVotante = {
          'ID Votante': `${escapeTxt(votante.id)}`,
          'Facultad': `${escapeTxt(req.facultadesName[votante.facultad])}`,
          'Claustro': `${escapeTxt(req.claustrosName[votante.claustro])}`,
          'Voto 1': `${escapeTxt(votes_for_author[0] ? req.topics.find(el => el.id === votes_for_author[0].topic.toString()).mediaTitle : "")}`,
          'Voto 2': `${escapeTxt(votes_for_author[1] ? req.topics.find(el => el.id === votes_for_author[1].topic.toString()).mediaTitle : "")}`,
          'Voto 3': `${escapeTxt(votes_for_author[2] ? req.topics.find(el => el.id === votes_for_author[2].topic.toString()).mediaTitle : "")}`,
        }
        infoVotantes.push(theVotante);
      }
    });
    try {
      res.xls(`resultados-votacion-votantes.xlsx`, infoVotantes);
    } catch (err) {
      log('get csv: array to csv error', err)
      return res.status(500).end()
    }
})
