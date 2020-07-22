const dbReady = require('lib/models').ready

const Forum = require('lib/models').Forum

const nombreMigrationParaLog = 'editar forum attrs'

const groups = [
	{ name: '', order: 0},
	{ name: 'Presupuestos', order: 1},
	{ name: 'Datos del autor', order: 2},
	{ name: 'Información de la propuesta', order: 3}
]

const estadoOptions = [
	{
		"name" : "sistematizada",
		"title" : "Sistematizada"
	},
	{
		"name" : "original",
		"title" : "Original"
	}
]

const escuelas = [
  { nombre: 'Politécnico', abreviacion: 'IPS' },
  { nombre: 'Agrotécnica', abreviacion: 'EAC' },
  { nombre: 'Superior de Comercio', abreviacion: 'ESUPCOM' },
]

const escuelaField = {
		"name" : "escuela",
		"title" : "Escuela",
		"kind" : "Enum",
		"mandatory" : true,
		"groupOrder" : 0,
		"group" : "",
		"order" : 1,
		"width" : 6,
		"icon" : "",
		"options" : escuelas.map(e => {
			return { name: e.abreviacion, title: e.abreviacion }
		})
}

const deepCopy = obj => {
	return JSON.parse(JSON.stringify(obj))
}

/**
 * Make any changes you need to make to the database here
 */
class SaltearPromises { }
exports.up = function up (done) {
  dbReady()

    .then(() => {
      return new Promise((resolve, reject) => {
	      Forum.findOne({name: 'proyectos'}, (err, forumProyecto) => {
	        if (err) reject(new Error(err))
					if (!forumProyecto || !forumProyecto.topicsAttrs) reject(new Error('No forum proyectos or no topicAttrs in it found'))

					// por algún motivo no nos deja editar un item del array
					const copyAttrs = deepCopy(forumProyecto.topicsAttrs)

					let attr = copyAttrs.find(a => a.name == 'state')
					attr.options = estadoOptions
					attr.title = "Tipo de idea"
					attr.description = ""
					attr.hide = false
					attr.order = 0
					attr.icon = ''

					// borramos campo anterior si ya estaba
					const escuelaIndex = copyAttrs.findIndex(a => a.name == 'escuela')
					if (escuelaIndex != -1)
						copyAttrs.splice(escuelaIndex, 1)

					// agregamos campo escuela
					copyAttrs.push(escuelaField)

					// borramos todo y volvemos a generar
					forumProyecto.topicsAttrs.splice(0)
					forumProyecto.topicsAttrs.push(...copyAttrs)

					forumProyecto.markModified('topicsAttrs')

					Forum.collection.save(forumProyecto, (err) => {
						if (err) reject(new Error(err))
						resolve()
					})
	      })
			})
		})

    // Todo OK
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
