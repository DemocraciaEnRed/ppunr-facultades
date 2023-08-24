const { Router } = require('express')
const validate = require('lib/api-v2/validate')
const middlewares = require('lib/api-v2/middlewares')
const utils = require('./utils')
const apiNoExt = require('lib/db-api')
const log = require('debug')('democracyos:ext:api:topics')


const app = Router()

const allowedForums = ['propuestas', 'proyectos']

const formats = {
  formats: {
    tags: /^([a-zA-Z0-9-_]+,?)+$/,
    barrio: /^[a-z0-9-]+$/,
    anio: /[0-9]+/
  }
}

app.get('/topics',
  validate({
    query: Object.assign({}, validate.schemas.pagination, {
      forumName: {
        type: 'string',
        enum: allowedForums,
        required: true
      },
      facultades: {
        type: 'string',
        format: 'facultades',
        default: ''
      },
      claustros: {
        type: 'string',
        format: 'claustros',
        default: ''
      },
      tags: {
        type: 'string',
        format: 'tags',
        default: ''
      },
      tag: {
        type: 'string',
        format: 'tag',
        default: ''
      },
      state: {
        type: 'string',
        format: 'states',
        default: 'idea,proyecto'
      },
      sort: {
        type: 'string',
        enum: ['newest', 'popular', 'barrio'],
        default: 'newest'
      },
      related: {
        type: 'string',
        default: '',
        format: 'barrio'
      },
      tipoIdea: {
        type: 'string',
        default: 'nothing'
      }
    })
  }, { formats }),
  utils.findForum,
  utils.parseStates,
  utils.parseTipoIdea,
  utils.parseFacultades,
  utils.parseClaustros,
  utils.parseTags,
  utils.parseTag,
  middlewares.forums.privileges.canView,
  (req, res, next) => {
    const opts = Object.assign({}, req.query)
    opts.forum = req.forum
    opts.user = req.user
    opts.state = opts.tipoIdea
    Promise.all([
      utils.findTopics(opts).then(topics => apiNoExt.user.populateOwners(topics)),
      utils.findTopicsCount(opts)
    ]).then(([topics, count]) => {
      // pidieron mostrar siempre primero las ideas-proyecto
      const ideasProyectos = topics.filter(t => t.attrs.state == 'idea-proyecto')
      const ideasResto = topics.filter(t => t.attrs.state != 'idea-proyecto')
      res.status(200).json({
        status: 200,
        pagination: {
          count,
          page: opts.page,
          pageCount: Math.ceil(count / opts.limit) || 1,
          limit: opts.limit
        },
        results: {
          topics: ideasProyectos.concat(ideasResto)
        }
      })
    }).catch(next)
  })

module.exports = app
