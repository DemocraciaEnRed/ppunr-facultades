const dbReady = require('lib/models').ready
const models = require('lib/models')

const nombreMigrationParaLog = 'cargar escuelas mas data'
const Escuela = models.Escuela

const escuelasData = [
  {
    nombre: 'Politécnico',
    urlCorta: 'politecnico',
    mailPadron: 'presupuestoparticipativo@ips.edu.ar',
    tituloForo: 'Instituto Politécnico',
  },
  {
    nombre: 'Agrotécnica',
    urlCorta: 'agrotecnica',
    mailPadron: 'presupuestoparticipativoagro@gmail.com',
    tituloForo: 'Escuela Agrotécnica',
  },
  {
    nombre: 'Superior de Comercio',
    urlCorta: 'superior-de-comercio',
    mailPadron: 'superiorparticipativo@unr.edu.ar ',
    tituloForo: 'Escuela Superior de Comercio',
  },
]


/**
 * Make any changes you need to make to the database here
 */
exports.up = function up (done) {
  // done() devuelve al Migrator de lib/migrations
  dbReady()

    // Primero chequear si ya no hay cosas cargadas
    .then(() => Escuela.collection.find({}).toArray())
    .then((escuelas) => {
      escuelas.forEach(escuela => {
        const data = escuelasData.find(e => e.nombre == escuela.nombre)
        delete data.nombre
        Escuela.collection.findOneAndUpdate(
          { _id: escuela._id },
          { $set: data }
        )
      })
    })

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
