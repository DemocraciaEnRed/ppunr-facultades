const dbReady = require('lib/models').ready
const models = require('lib/models')

const nombreMigrationParaLog = 'cambios en tags'
const Tag = models.Tag

/**
 * Make any changes you need to make to the database here
 */
exports.up = function up (done) {
  // done() devuelve al Migrator de lib/migrations
  dbReady()

    // Actualizamos el tag
    .then(() => Tag.collection.find({"hash" : "seguridad-y-soberanía-alimentaria"}).toArray())
    .then((tags) => {
      if (!tags || tags.length < 1)
        throw new Error('Tag hash "seguridad-y-soberanía-alimentaria" not found')
      const tag = tags[0]
      let data = {}
      data.hash = "soberanía-y-seguridad-alimentaria"
      data.name = "Soberanía y Seguridad Alimentaria"
      Tag.collection.findOneAndUpdate(
        { _id: tag._id },
        { $set: data }
      )
    })

    // Agregamos nueva tag
    .then(() => Tag.collection.insert({
      name: 'Producción',
      hash: 'Producción'.toLowerCase().replace(/ /g, '-'),
      image: 'people',
      color: '#091A33'
    }))

    // Todo OK
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
