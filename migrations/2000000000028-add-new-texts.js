const config = require('lib/config')

const dbReady = require('lib/models').ready

const Text = require('lib/models').Text

const textsData = [
    { "name": "home-nombre", "text": "PRESUPUESTO PARTICIPATIVO - FACULTADES" },
	{ "name": "evento-titulo", "text": "Agenda" },
	{ "name": "evento-bajada", "text": "En estos puntos podrás dejar tus ideas de forma presencial!" },
    { "name": "evento-pestaña", "text": "agenda" },
    { "name": "foro-pestaña", "text": "FORO UNR" },
    { "name": "foro-titulo", "text":  config.propuestasAbiertas ? config.propuestasTextoAbiertas : config.propuestasTextoCerradas },
    { "name": "foro-bajada", "text": "Ha terminado la votación del PPUNR 2023. En nuestra web podrán ver los resultados." },
    { "name": "reglamento-link", "text": "https://presupuestoparticipativo.unr.edu.ar/?page_id=1551" },
	{ "name": "info-bajada", "text": "Inscribirte para a sumarte como proyectista del Consejo Escolar este 2023." },
    { "name": "info-reglamento", "text": "<p>Podés leer el reglamento completo haciendo click <a href='https://presupuestoparticipativo.unr.edu.ar/reglamento/' rel='noopener noreferer' target='_blank'>aquí</a> </p>" },
]

/**
 * Make any changes you need to make to the database here
 */
class SaltearPromises { }
exports.up = function up (done) {
  dbReady()
    // Primero chequear si ya no hay cosas cargadas
    .then(() => {
      return new Promise((resolve, reject) => {
        Text.collection.count({}, (err, count) => {
          if (err) reject(new Error(err))
          
          resolve()
        })
      })
    })
    // Agregamos textos
    .then(() => Text.collection.insertMany(textsData))
    // Devolvemos al Migrator (de lib/migrations)
    .then(() => {
      console.log(`-- Agregados textos de portada`)
      done()
    })
    .catch((err) => {
      if (err instanceof SaltearPromises)
        done()
      else{
        console.log('-- Actualizacion de textos de portada no funcionó! Error: ', err)
        done(err)
      }
    })
}

/**
 * Make any changes that UNDO the up function side effects here (if possible)
 */
exports.down = function down(done) {
  done();
};
