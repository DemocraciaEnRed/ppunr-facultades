const dbReady = require('lib/models').ready
const models = require('lib/models')

const nombreMigrationParaLog = 'nueva facultad'
const Facultad = models.Facultad

const facultad = { nombre: 'Otras Sedes y Dependencias', abreviacion: 'Otras Sedes UNR' }

/**
 * Make any changes you need to make to the database here
 */
exports.up = function up (done) {
  // done() devuelve al Migrator de lib/migrations
  dbReady()

    // Agregamos data
    .then(() => Facultad.collection.insert(facultad))

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
