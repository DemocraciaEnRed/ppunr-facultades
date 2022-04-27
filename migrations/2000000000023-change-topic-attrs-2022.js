const dbReady = require('lib/models').ready

const Forum = require('lib/models').Forum

const deepCopy = (obj) => {
  return JSON.parse(JSON.stringify(obj))
}

const nombreMigrationParaLog = 'change topics attrs for 2022'

/**
 * Make any changes you need to make to the database here
 */
class SaltearPromises { }
exports.up = function up (done) {
  dbReady()
    .then(() => {
      return new Promise((resolve, reject) => {
        Forum.findOne({ name: 'proyectos' }, (err, forumProyecto) => {
          if (err) reject(new Error(err))
          if (!forumProyecto || !forumProyecto.topicsAttrs) reject(new Error('No forum proyectos or no topicAttrs in it found'))

          forumProyecto.topicsAttrs.forEach((topicAttr, i) => {
            // copy the topicAttr
            let updTopicAttr = deepCopy(topicAttr)

            // update depending on the field name
            if (updTopicAttr.name === 'numero') {
              updTopicAttr.group = 'Proyecto'
              updTopicAttr.groupOrder = 0
            } else if (updTopicAttr.name === 'presupuesto') {
              updTopicAttr.group = 'Proyecto'
              updTopicAttr.groupOrder = 1
            } else if (updTopicAttr.name === 'state') {
              updTopicAttr.title = 'Estado'
              updTopicAttr.description = 'Idea son pre-proyectos, y los Proyectos son los que se terminarán votando.'
              updTopicAttr.width = 12
            } else if (updTopicAttr.name === 'genero') {
              updTopicAttr.width = 12
            }

            // swap
            forumProyecto.topicsAttrs[i] = updTopicAttr
          })

          // when done, mark topicsAttrs as modified
          forumProyecto.markModified('topicsAttrs')
          // now save it.
          Forum.collection.save(forumProyecto, (err) => {
            if (err) reject(new Error(err))
            resolve()
          })
        })
      })
    })
    // Devolvemos al Migrator (de lib/migrations)
    .then(() => {
      console.log(`-- Migración ${nombreMigrationParaLog} exitosa`)
      done()
    })
    .catch((err) => {
      if (err instanceof SaltearPromises) { done() } else {
        console.log(`-- Migración ${nombreMigrationParaLog} no funcionó! Error: ${err}`)
        done(err)
      }
    })
}

/**
 * Make any changes that UNDO the up function side effects here (if possible)
 */
exports.down = function down (done) {
  done()
}
