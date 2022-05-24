const dbReady = require('lib/models').ready
const models = require('lib/models')

const nombreMigrationParaLog = 'cargar etiquetas y ejes 2022'
const Tag = models.Tag
const Eje = models.Eje

const ejes = [
  { nombre: 'Bienestar Universitario', color: '#DCAAC5', hash: 'bienestar-universitario' },
  { nombre: 'Deporte y cultura', color: '#EFA47E', hash: 'deporte-cultura' },
  { nombre: 'Espacio Comunes', color: '#EDC200', hash: 'espacios-comunes' },
  { nombre: 'Ambiente y sustentabilidad', color: '#5DBE6B', hash: 'ambiente-sustentabilidad' },
  { nombre: 'Tecnologias e innovación', color: '#50A0C6', hash: 'tecnologia-innovacion' }
]

const tags = ejes.map(eje => {
  return {
    name: eje.nombre,
    hash: eje.hash,
    image: 'people',
    color: eje.color
  }
})

/**
 * Make any changes you need to make to the database here
 */
exports.up = function up (done) {
  // done() devuelve al Migrator de lib/migrations
  dbReady()

    // borramos data vieja
    .then(() => Tag.collection.deleteMany({}))
    .then(() => Eje.collection.deleteMany({}))

    // Agregamos data
    .then(() => Tag.insertMany(tags))
    .then(() => Eje.insertMany(ejes))

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
