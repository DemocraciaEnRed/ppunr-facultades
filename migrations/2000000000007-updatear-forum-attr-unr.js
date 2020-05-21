const dbReady = require('lib/models').ready

const Forum = require('lib/models').Forum

const nombreMigrationParaLog = 'updatear forum attr unr'

const groups = [
	{ name: '', order: 0},
	{ name: 'Presupuestos', order: 1},
	{ name: 'Datos del autor', order: 2},
	{ name: 'Información de la propuesta', order: 3}
]

const generoField = {
	"name" : "genero",
	"title" : "Género",
	"kind" : "String",
	"groupNum" : 0,
	"mandatory" : false,
	"order" : 1,
	"width" : 6,
	"icon" : ""
}

const deleteFields = [
	'domicilio',
	'telefono',
	'solucion',
	'beneficios'
]

const deepCopy = obj => {
	return JSON.parse(JSON.stringify(obj))
}

/**
 * Make any changes you need to make to the database here
 */
class SaltearPromises { }
exports.up = function up (done) {
  dbReady()
    // Primero chequear si ya no hay cosas cargadas
    .then(() => {
      return new Promise((resolve, reject) => {
        Forum.collection.count({'topicsAttrs.name': generoField.name}, (err, count) => {
          if (err) reject(new Error(err))
          if (count) {
            console.log('Ya están cargados los nuevos campos, salteando migración')
            reject(new SaltearPromises())
          }
          resolve()
        })
      })
    })
		// updatear
    .then(() => {
      return new Promise((resolve, reject) => {
	      Forum.findOne({name: 'proyectos'}, (err, forumProyecto) => {
	        if (err) reject(new Error(err))
					if (!forumProyecto || !forumProyecto.topicsAttrs) reject(new Error('No forum proyectos or no topicAttrs in it found'))

					// nuevo field
					let field = generoField
					let group = groups[field.groupNum || 0]
					field.group = group.name
					field.groupOrder = group.order
					delete field.groupNum
					forumProyecto.topicsAttrs.push(field)

					// borramos viejos
					// agarramos los indices a eliminar
					let deleteIs = forumProyecto.topicsAttrs
						.map((attr,i) => attr && deleteFields.includes(attr.name) && i)
						.filter(val => val !== false)
					// los eliminamos de atrás hacia adelante así no se mueven
					deleteIs.sort().reverse().forEach(i => forumProyecto.topicsAttrs.splice(i,1))

					forumProyecto.markModified('topicsAttrs')

					Forum.collection.save(forumProyecto, (err) => {
						if (err) reject(new Error(err))
						resolve()
					})
	      })
			})
		})
    // Todo OK (devolvemos al Migrator (de lib/migrations))
    .then(() => {
      console.log(`-- Migración ${nombreMigrationParaLog} exitosa`)
      done()
    })
    // Error
    .catch((err) => {
      if (err instanceof SaltearPromises)
        done()
      else{
	      console.log(`-- Migración ${nombreMigrationParaLog} no funcionó! Error: ${err}`)
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
