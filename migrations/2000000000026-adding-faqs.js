const dbReady = require('lib/models').ready

const aboutUs = require('lib/models').aboutUs

const aboutUsData = [
{ 'order': 0, 'question': '+ ¿Quiénes pueden participar del PP Facultades?', 'answer': '<p className="p-padding">Pueden participar docentes, nodocentes, estudiantes y graduados/as de las 12 Facultades y otras Sedes y dependencias de la UNR.</p>' },
{ 'order': 2, 'question': '+ ¿Cómo participo?', 'answer': '<p className="p-padding">Te invitamos a <a href="/signup" className="text-primary">registrarte aquí</a> para votar. Además, habrá postas presenciales de votación paralelamente al proceso virtual. Podés ver el calendario haciendo <a href="/s/foro-presencial" className="text-primary">clic acá</a>.</p>' },
{ 'order': 3, 'question': '+ Si no participé de una etapa anterior, ¿puedo sumarme?', 'answer': '<p className="p-padding">Podés sumarte en cualquier etapa del proceso aunque no hayas participado de las anteriores. Es decir, podés no haber propuesto o comentado ideas pero interesarte por sumar tu aporte como proyectista o elegir en la votación tus proyectos favoritos para ser ejecutados.</p>' },
{ 'order': 4, 'question': '+ ¿Qué condiciones deben respetar los proyectos?', 'answer': '<ul className="p-padding"><li>Incluir resultados para al menos tres unidades académicas o algún espacio común.</li><li>El monto de cada proyecto no puede superar el 70% de la partida asignada.</li><li>No exceder el límite presupuestario.</li><li>No exceder el ámbito de la Universidad.</li><li>No afectar partidas presupuestarias de años posteriores.</li><li>Ser factibles técnicamente para poder ser ejecutados en caso de ser elegidos.</li></ul>' },
{ 'order': 5, 'question': '+ ¿Qué espacios podemos intervenir con proyectos del PP?', 'answer': '<p className="p-padding">Cualquier espacio de la UNR.  El proyecto tiene que incluir resultados para al menos tres unidades académicas o bien para algún espacio común de la Universidad (comedores, gimnasios, Sede, Rectorado, CUR, anexo, etc.).</p>' },
{ 'order': 6, 'question': '+ ¿Cuál es el monto asignado al PPUNR edición 2022?', 'answer': ' <p className="p-padding">25 millones de pesos, de los cuales, cada Escuela tendrá disponible un  millón y medio para discutir en el marco de su comunidad, y el resto, $20.500.000, estarán destinados al PP Facultades.</p>' },
{ 'order': 7, 'question': '+ ¿Cómo elegiremos los proyectos a ejecutarse en 2023?', 'answer': ' <p className="p-padding">Se realizarán jornadas de votación (del 12 al 21 de octubre de 2022) previa difusión de los proyectos elegibles, para que toda la comunidad de la UNR pueda decidir cuáles serán ejecutados hasta alcanzar el total de la partida presupuestaria afectada al PP Facultades. Como ningún proyecto puede superar el 70% de la partida, al menos dos proyectos serán ganadores.</p>' },
{ 'order': 8, 'question': '+ Puedo participar si pertenezco a las Sedes, Gimnasio UNR, ECU, comedores y otras dependencias?', 'answer': '<p className="p-padding">Si, claro! todos/as los/as actores de la comunidad UNR están invitados a participar. En el campo Facultad del formulario de registro, encontrás la opción “Otras Sedes y Dependencias UNR” para vincularte.</p>' },
{ 'order': 9, 'question': '+ ¿Pueden participar los/las estudiantes de posgrado?', 'answer': '<p className="p-padding">Sí, pueden participar todos/as los/as estudiantes de posgrado.</p>' },
{ 'order': 10, 'question': '+ ¿Pueden participar los/las estudiantes y docentes de ProUaPam (Programa para Adultos Mayores)?', 'answer': '<p className="p-padding">Sí, pueden participar todos/as los/as integrantes del PRoUaPam.</p>' },
{ 'order': 11, 'question': '+ ¿Pueden participar los/las integrantes de las extensiones áulicas?', 'answer': '<p className="p-padding">Sí, pueden participar todos/as los/as integrantes de las extensiones áulicas?</p>' },
]

/**
 * Make any changes you need to make to the database here
 */
exports.up = function up (done) {
  dbReady()
    // Primero chequear si ya no hay cosas cargadas
    .then(() => {
      return new Promise((resolve, reject) => {
        aboutUs.collection.count({}, (err, count) => {
          if (err) reject(new Error(err))
          if (count) {
            console.log('Ya hay (%s) preguntas y respuestas cargadas', count)
            reject(new SaltearPromises())
          }
          resolve()
        })
      })
    })
    // Agregamos preguntas y respuestas
    .then(() => aboutUs.collection.insertMany(aboutUsData))
    // Devolvemos al Migrator (de lib/migrations)
    .then(() => {
      console.log(`-- Agregadas las preguntas y respuestas de la seccion "acerca de"`)
      done()
    })
    .catch((err) => {
      if (err instanceof SaltearPromises) {
        done()
      } else {
        console.log('-- Actualizacion de acerca de no funcionó! Error: ', err)
        done(err)
      }
    })
}

/**
 * Make any changes that UNDO the up function side effects here (if possible)
 */
exports.down = function down(done) {
  done()
}