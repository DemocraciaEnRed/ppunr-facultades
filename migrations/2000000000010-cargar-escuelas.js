const dbReady = require('lib/models').ready
const models = require('lib/models')

const nombreMigrationParaLog = 'cargar escuelas'
const Escuela = models.Escuela

const escuelas = [
  { nombre: 'Politécnico', abreviacion: 'IPS' },
  { nombre: 'Agrotécnica', abreviacion: 'EAC' },
  { nombre: 'Superior de Comercio', abreviacion: 'ESUPCOM' },
]

/**
 * Make any changes you need to make to the database here
 */
exports.up = function up (done) {
  // done() devuelve al Migrator de lib/migrations
  dbReady()

    // Primero chequear si ya no hay cosas cargadas
    .then(() => {
      return new Promise((resolve, reject) => {
        Escuela.collection.count({}, (err, count) => {
          if (err) reject(new Error(err))
          if (count) {
            console.log('Ya hay escuelas cargadas (%s), salteando migración', count)
            reject(new SaltearPromises())
          }
          resolve()
        })
      })
    })

    // Agregamos data
    .then(() => Escuela.collection.insertMany(escuelas))

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
