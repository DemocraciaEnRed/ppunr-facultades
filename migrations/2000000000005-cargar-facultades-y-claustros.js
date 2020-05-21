const dbReady = require('lib/models').ready
const models = require('lib/models')

const nombreMigrationParaLog = 'cargar facultades y claustros'
const Facultad = models.Facultad
const Claustro = models.Claustro

const facultades = [
  { nombre: 'Arquitectura, Planeamiento y Diseño', abreviacion: 'FAPyD' },
  { nombre: 'Ciencias Agrarias', abreviacion: 'FCAGR' },
  { nombre: 'Ciencias Bioquímicas y Farmacéuticas', abreviacion: 'FBIOyF' },
  { nombre: 'Ciencias Económicas y Estadística', abreviacion: 'FCECON' },
  { nombre: 'Ciencias Exactas, Ingeniería y Agrimensura', abreviacion: 'FCEIA' },
  { nombre: 'Ciencias Médicas', abreviacion: 'FCM' },
  { nombre: 'Ciencia Política y RR. II.', abreviacion: 'FCPOLIT' },
  { nombre: 'Ciencias Veterinarias', abreviacion: 'FVETER' },
  { nombre: 'Derecho', abreviacion: 'FDER' },
  { nombre: 'Humanidades y Artes', abreviacion: 'FHUMyAR' },
  { nombre: 'Odontología', abreviacion: 'FODONTO' },
  { nombre: 'Psicología', abreviacion: 'FPSICO' },
]
const claustros = [
  { nombre: 'Estudiantes' },
  { nombre: 'Docentes' },
  { nombre: 'Nodocentes' },
  { nombre: 'Graduados/as' },
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
        Facultad.collection.count({}, (err, count) => {
          if (err) reject(new Error(err))
          if (count) {
            console.log('Ya hay facultades cargadas (%s), salteando migración', count)
            reject(new SaltearPromises())
          }
          resolve()
        })
      })
    })
    .then(() => {
      return new Promise((resolve, reject) => {
        Claustro.collection.count({}, (err, count) => {
          if (err) reject(new Error(err))
          if (count) {
            console.log('Ya hay claustros cargados (%s), salteando migración', count)
            reject(new SaltearPromises())
          }
          resolve()
        })
      })
    })

    // Agregamos data
    .then(() => Facultad.collection.insertMany(facultades))
    .then(() => Claustro.collection.insertMany(claustros))

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
