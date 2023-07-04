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
      console.log(topic)
      let theTopic = {
        'Idea ID': topic.id,
        'Idea Fecha': `${escapeTxt(moment(topic.createdAt, '', req.locale).format('LL LT'))}`,
        'Idea Título': `${escapeTxt(topic.mediaTitle)}`,
        // 'Idea Temas': `${escapeTxt(topic.tags.join(', '))}`,
        'Idea Tema': `${topic.tag ? escapeTxt(topic.tag.name) : '-'}`,
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

  app.get('/export/old-topics',
  middlewares.users.restrict,
  middlewares.forums.findFromQuery,
  middlewares.topics.findDeletedFromForum,
  middlewares.forums.privileges.canChangeTopics,
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

      let listTopics= req.topics
      if(req.query.sort==='voted'){
        listTopics.sort(function(a, b){return b.votesLength-a.votesLength})
      }else if(req.query.sort==='newest'){
        listTopics.sort(function(a, b){return new Date(b.createdAt) - new Date(a.createdAt)})
      }else if(req.query.sort==='latest'){
        listTopics.sort(function(a, b){return  new Date(a.createdAt) - new Date(b.createdAt)})
      }
  
      if(req.query.years){
        let listYears = req.query.years.split(',').map(Number)
        listTopics = listTopics.filter(topic =>  listYears.includes(topic.createdAt.getFullYear()))
      }  

    req.topics.forEach((topic) => {
      if (topic.attrs === undefined) {
        topic.attrs = {}
      }
      console.log(topic)
      let theTopic = {
        'Idea ID': topic.id,
        'Idea Fecha': `${escapeTxt(moment(topic.createdAt, '', req.locale).format('LL LT'))}`,
        'Idea Título': `${escapeTxt(topic.mediaTitle)}`,
        // 'Idea Temas': `${escapeTxt(topic.tags.join(', '))}`,
        'Idea Tema': `${topic.tag ? escapeTxt(topic.tag.name) : '-'}`,
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
  // cargamos votos con sus usuarios y los topics de cada voto (pipelines)
  (req, res, next) => {
    api.vote.getVotesPipeline().then(votes => {
        req.votantes = votes || []
        next()
      }
    )
  },
  function getXlsx(req, res, next) {
    let infoVotantes = []
    // No vamos a filtrar por staff
    req.votantes.forEach((votante) => {
      let theVotante = {
        'DNI': `${escapeTxt(votante._id)}`,
        // 'Tipo Voto': null,
        'Facultad': null,
        'Claustro': null,
        'Cantidad Votos': votante.totalVotes,
        'Voto 1': `${escapeTxt(votante.votes[0] ? votante.votes[0].mediaTitle : '')}`,
        'Voto 2': `${escapeTxt(votante.votes[1] ? votante.votes[1].mediaTitle : '')}`,
        'Voto 3': `${escapeTxt(votante.votes[2] ? votante.votes[2].mediaTitle : '')}`,
      }
      if(votante.userIndex == null) {
        // no user found with that dni, it must have been presencial
        // theVotante['Tipo Voto'] = 'Voto presencial'
        if (votante.facultad && votante.facultad[0]) {
          theVotante['Facultad'] = `${escapeTxt(req.facultadesName[votante.facultad[0]])}`
        }
        if (votante.claustro && votante.claustro[0]) {
          theVotante['Claustro'] = `${escapeTxt(req.claustrosName[votante.claustro[0]])}`
        }
      } else {
        // if (votante.author[0].toString() == votante.user._id.toString()) {
        //   theVotante['Tipo Voto'] = 'Voto online'
        // } else {
        //   theVotante['Tipo Voto'] = 'Voto presencial'
        // }
        if (votante.user) {
          if (votante.user.facultad) {
            theVotante['Facultad'] = `${escapeTxt(req.facultadesName[votante.user.facultad])}`
          }
          if (votante.user.claustro) {
            theVotante['Claustro'] = `${escapeTxt(req.claustrosName[votante.user.claustro])}`
          }
        } else {
          if (votante.facultad && votante.facultad[0]) {
            theVotante['Facultad'] = `${escapeTxt(req.facultadesName[votante.facultad[0]])}`
          }
          if (votante.claustro && votante.claustro[0]) {
            theVotante['Claustro'] = `${escapeTxt(req.claustrosName[votante.claustro[0]])}`
          }
        }
      }
      infoVotantes.push(theVotante);
    });
    try {
      res.xls(`resultados-votacion-votantes.xlsx`, infoVotantes);
    } catch (err) {
      log('get csv: array to csv error', err)
      return res.status(500).end()
    }
})


app.get('/export/topics/export-resultados-votos',
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
  // cargamos votos con sus usuarios y los topics de cada voto (pipelines)
  (req, res, next) => {
    api.vote.getAllVotesPipeline().then(votes => {
        req.votos = votes || []
        next()
      }
    )
  },
  function getXlsx(req, res, next) {
    let infoVoto = []
    // No vamos a filtrar por staff
    req.votos.forEach((votante) => {
      let theVoto = {
        'Envia Voto': `${escapeTxt(votante.author.firstName + ' ' + votante.author.lastName)}`,
        'DNI': `${escapeTxt(votante.dni)}`,
        'Votante': `${votante.user ? escapeTxt(votante.user.firstName + ' ' + votante.user.lastName) : '-No registrado-'}`,
        'Tipo Voto': null,
        'Facultad': null,
        'Claustro': null,
        'Proyecto': `${escapeTxt(votante.topic ? votante.topic.mediaTitle : '')}`,
        'Hora Voto': `${escapeTxt(moment(votante.createdAt).format('YYYY/MM/DD HH:mm:ss'))}`
      }
      if(votante.author.dni == votante.dni) {
        theVoto['Tipo Voto'] = 'Voto online'
      } else {
        theVoto['Tipo Voto'] = 'Voto presencial'
      }
      if (votante.user) {
        if (votante.user.facultad) {
          theVoto['Facultad'] = `${escapeTxt(req.facultadesName[votante.user.facultad])}`
        }
        if (votante.user.claustro) {
          theVoto['Claustro'] = `${escapeTxt(req.claustrosName[votante.user.claustro])}`
        }
      } else {
        if (votante.facultad) {
          theVoto['Facultad'] = `${escapeTxt(req.facultadesName[votante.facultad])}`
        }
        if (votante.claustro) {
          theVoto['Claustro'] = `${escapeTxt(req.claustrosName[votante.claustro])}`
        }
      }
      infoVoto.push(theVoto);
    });
    try {
      res.xls(`resultados-votacion-votos.xlsx`, infoVoto);
    } catch (err) {
      log('get csv: array to csv error', err)
      return res.status(500).end()
    }
})
