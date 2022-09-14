const dbReady = require('lib/models').ready
const models = require('lib/models')

const nombreMigrationParaLog = 'remove index topic_1_author_1 from Votes'
const Vote = models.Vote

/**
 * Make any changes you need to make to the database here
 */
exports.up = function up (done) {
  // done() devuelve al Migrator de lib/migrations
  dbReady()
    .then(() => {
      return new Promise((resolve, reject) => {
        Vote.collection.dropIndex({ topic: 1, author: 1 }, (err) => {
          if (err) {
            reject(err)
          } else {
            resolve()
          }
        })
      })
    })
    .then(() => {
      console.log(`-- Migración ${nombreMigrationParaLog} exitosa`)
      done()
    })
    // Error
    .catch((err) => {
      console.log(`-- Migración ${nombreMigrationParaLog} no funcionó! Error: ${err}`)
      done(err)
    })
}

/**
 * Make any changes that UNDO the up function side effects here (if possible)
 */
exports.down = function down(done) {
  done();
};
