import React, { Component } from 'react'
import { Link } from 'react-router'
import Footer from 'ext/lib/site/footer/component'
import Jump from 'ext/lib/site/jump-button/component'
import Anchor from 'ext/lib/site/anchor'
// https://github.com/glennflanagan/react-responsive-accordion
import Accordion from 'react-responsive-accordion';

export default class Page extends Component {
  componentDidMount () {
    const u = new window.URLSearchParams(window.location.search)
    if (u.get('scroll') === 'cronograma') return Anchor.goTo('cronograma')
    this.goTop()
  }

  goTop () {
    window.scrollTo(0,0)
  }

  render () {
    return (
      <div>
        <section className="banner-static">
          <div className="banner"></div>
          <div className='contenedor'>
            <div className='fondo-titulo'>
              <h1>Presupuesto Participativo UNR</h1>
            </div>
          </div>
        </section>
        <div id='container' className="container-imagen-acerca-de">
          <div className='ext-acerca-de container'>
            <div className="filas">
              <div className="fila faq text-left">
                <p className='p-padding'>Podés leer el reglamento completo haciendo click <a href="https://presupuestoparticipativo.unr.edu.ar/?page_id=1551" rel="noopener noreferer" target="_blank">aquí</a></p>

                <Accordion>
                  <div data-trigger="+ ¿Quiénes pueden participar del PP Facultades?">
                    <p className='p-padding'>Pueden participar docentes, nodocentes, estudiantes, graduados y graduadas de las 12 Facultades y otras Sedes y dependencias de la UNR.</p>
                  </div>

                  <div data-trigger="+ ¿En qué se basa la etapa de Foro del PPUNR?" data-triggerDisabled={true}>
                    <p className='p-padding'>El Foro tiene por objetivo que las/os integrantes de la comunidad propongan ideas que aporten en la construcción de la Universidad que queremos. Estará abierto desde el 29 de junio al 20 de julio. En la segunda etapa del Foro, a partir del 3 de agosto, se podrán inscribir quienes  deseen ser proyectistas y trabajar para convertir las ideas en proyectos.</p>
                  </div>

                  <div data-trigger="+ ¿Cómo participo?">
                    <p className='p-padding'>Te invitamos a registrarte <Link to='/signup'>aquí</Link> para sumar ideas y comentar las ideas de otros/as participantes. Podrás también expresar tu interés en apoyar y sumarte a alguna de las propuestas. Es muy importante que fomentemos el diálogo informado y respetuoso.</p>
                  </div>

                  <div data-trigger="+ ¿Cuáles son los temas para proponer ideas?">
                  <p className='p-padding'>Vas a encontrar en el <Link to='/formulario-idea'>formulario</Link> una serie de etiquetas que refieren a diversos temas:</p>
                  <p>Accesibilidad - Administración - Ambiente y Sustentabilidad - Aprendizajes y actividades académicas - Arte y Cultura - Bioseguridad Convivencia y Participación - Derechos Humanos - Género - Inclusión Infraestructura - Innovación - Internacionalización - Investigación - Recreación y deporte  - Salud - Tecnología - Transparencia Vinculación con el medio</p>
                  </div>

                  <div data-trigger="+ ¿Cómo subo una idea?">
                    <p className='p-padding'>Encontrarás <Link to='/formulario-idea'>aquí</Link> el espacio para colocar tu idea: incluí un título y escribí un breve párrafo explicándola. Agregá etiquetas preconfiguradas para clasificar tu idea. Eso ayudará a agruparlas por afinidad para la próxima fase del Foro. </p>
                  </div>

                  <div data-trigger="+ ¿Qué pasa si no puedo registrarme?">
                    <p className='p-padding'>Te invitamos a que nos mandes un correo con todos tus datos (nombre completo, DNI, Facultad, claustro, mail o forma de contacto) a <a href="mailto:presupuestoparticipativo@unr.edu.ar">presupuestoparticipativo@unr.edu.ar</a></p>
                  </div>

                  <div data-trigger="+ ¿Cuántas ideas puedo subir?">
                    <p className='p-padding'>Podés subir todas las ideas que quieras aunque cada una en un formulario independiente.</p>
                  </div>

                  <div data-trigger="+ ¿Qué tipo de ideas esperamos que subas al Foro del PP Facultades?">
                    <p className='p-padding'>Las ideas tienen que implicar aportes para más de una Facultad o para los espacios comunes (como el gimnasio o los comedores). No pueden ser ideas que sólo impacten en una Facultad. Esto tiene por objetivo que pensemos a la Universidad en un sentido más transversal e inclusivo, así como generar propuestas multidisciplinarias.</p>
                  </div>

                  <div data-trigger="+ ¿Puedo modificar mi idea una vez que fue enviada?">
                    <p className='p-padding'>Si, puedes modificar tu idea tantas veces como quieras mientras el Foro esté abierto.</p>
                  </div>

                  <div data-trigger="+ ¿Cuándo se cierra el Foro?">
                    <p className='p-padding'>El Foro se cerrará, en una primera fase, el 20 de Julio. Hasta entonces tenes tiempo para modificar tu idea e intercambiar sobre las ideas de otros/as participantes. Luego, se abrirá el 3 de agosto y se dará por finalizada la etapa el 14 del mismo mes, fecha en la cual podes revisar las ideas y sumarte para transformarlas en proyectos.</p>
                  </div>

                  <div data-trigger="+ ¿Qué pasará con mi idea?">
                    <p className='p-padding'>Otros/as participantes pueden comentar tu idea o apoyarla. Te invitamos a entrar en diálogo con otros/as participantes. Luego de la primera etapa del Foro (del 29 de Junio al 20 de Julio) haremos una sistematización de ideas por temas para colocarlas de manera ordenada en la plataforma para que, si te interesa sumarte como proyectista, te inscribas en la que quieras desarrollar como proyecto en el marco de la Comisión Universitaria.</p>
                  </div>

                  <div data-trigger="+ ¿Cuáles son las dos etapas de los Foros?">
                    <p className='p-padding'>La primera es del 29 de junio al 20 de julio para que subas tu idea y/o comentes las de otros/as.</p>
                    <p>La segunda del 3 de agosto al 14 de agosto será para que te propongas como proyectista de las ideas que desees desarrollar para que se transforme en un proyecto factible.</p>
                  </div>

                  <div data-trigger="+ Si no participé de una etapa anterior, ¿puedo sumarme?">
                    <p className='p-padding'>Podés sumarte en cualquier etapa del proceso aunque no hayas participado de las anteriores. Es decir, podés no haber propuesto o comentado ideas pero interesarte por sumar tu aporte como proyectista.</p>
                  </div>

                  <div data-trigger="+ ¿Qué implica ser proyectista?">
                    <p className='p-padding'>Luego de los Foros, la segunda etapa del PP es la conformación de la Comisión Universitaria. La misma estará integrada por todas las personas que se hayan propuesto para transformar las ideas en proyectos. Funcionará durante dos meses (agosto- octubre) en el marco de encuentros con técnicos de la Universidad que contribuirán a darle factibilidad a los proyectos que serán elegidos por la comunidad y serán ejecutados en 2021.</p>
                  </div>

                  <div data-trigger="+ ¿Qué condiciones deben respetar los proyectos?">
                    <ul className='p-padding'>
                      <li>Ser elaborados por integrantes de más de un claustro.</li>
                      <li>Incluir resultados para más de una unidad académica o algún espacio común.</li>
                      <li>No exceder el límite presupuestario.</li>
                      <li>No exceder el ámbito de la Universidad.</li>
                      <li>No afectar partidas presupuestarias de años posteriores.</li>
                      <li>Ser factibles técnicamente para poder ser ejecutados en caso de ser elegidos.</li>
                    </ul>
                  </div>

                  <div data-trigger="+ ¿Qué espacios podemos intervenir con proyectos del PP?">
                    <p className='p-padding'>Los proyectos deben ser desarrollados por integrantes de, a lo menos, dos claustros. Tiene que incluir resultados para más de una unidad académica o bien para algún espacio común de la Universidad (comedores, gimnasios, Sede, Rectorado, CUR, anexo, etc.).</p>
                  </div>

                  <div data-trigger="+ ¿Cuál es el monto asignado al PPUNR edición 2020?">
                    <p className='p-padding'>Dieciocho millones de pesos, de los cuales, cada Escuela tendrá disponible un millón para discutir en el marco de su comunidad, y el resto, quince millones, estarán destinado al PP Facultades.</p>
                  </div>

                  <div data-trigger="+ ¿Cómo elegiremos los proyectos a ejecutarse en 2021?">
                    <p className='p-padding'>Se realizarán jornadas de votación en el mes de octubre o noviembre, previa difusión de los proyectos elegibles, para que toda la comunidad de la UNR puede decidir cuáles serán ejecutados hasta alcanzar el total de la partida presupuestaria afectada al PP Facultades. Es decir que, de acuerdo al monto de los proyectos elegidos, podrán ejecutarse uno o más proyectos. </p>
                  </div>

                  <div data-trigger="+ ¿Puedo participar si pertenezco a las Sedes, Gimnasio UNR, ECU, comedores y otras dependencias?">
                    <p className='p-padding'>¡Sí, claro! Todos/as los/as actores de la comunidad UNR están invitados a participar. En el campo Facultad del formulario de registro, encontrás la opción “Otras Sedes y Dependencias UNR” para vincularte.</p>
                  </div>

                  <div data-trigger="+ ¿Pueden participar los/las estudiantes de posgrado?">
                    <p className='p-padding'>Sí, pueden participar todos/as los/as estudiantes de posgrado. </p>
                  </div>

                  <div data-trigger="+ ¿Pueden participar los/las estudiantes y docentes de ProUaPam (Programa para Adultos Mayores)?">
                    <p className='p-padding'>Sí, pueden participar todos/as los/as integrantes del PRoUaPam.</p>
                  </div>

                  <div data-trigger="+ ¿Pueden participar los/las integrantes de las extensiones áulicas?">
                    <p className='p-padding'>Sí, pueden participar todos/as los/as integrantes de las extensiones áulicas.</p>
                  </div>

                </Accordion>

              </div>
            </div>
          </div>
        </div>
        <Jump goTop={this.goTop} />
        <Footer />
      </div>
    )
  }
}
