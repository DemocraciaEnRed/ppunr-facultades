import React, { Component } from 'react'
import { Link } from 'react-router'
import Footer from 'ext/lib/site/footer/component'
import Jump from 'ext/lib/site/jump-button/component'
import Anchor from 'ext/lib/site/anchor'
// https://github.com/glennflanagan/react-responsive-accordion
import Accordion from 'react-responsive-accordion';

export default class Page extends Component {
  constructor (props) {
    super(props)

    this.state = {
      openSection: this.props.location.query.q === 'proyectista' ? 12 : 0
    }
  }

  componentDidMount () {
    this.goTop(this.props.location.query.q || 'container')
  }

  goTop (anchorId) {
    Anchor.goTo(anchorId)
  }

  render () {
    let { openSection } = this.state
    return (
      <div>
        <section className="banner-static-2022">
          <h1>Acerca de</h1>
        </section>
        <div className="post-banner-static-2022 container">
          <span>Inscribirte para a sumarte como proyectista de la Comisión Universitaria este 2022.</span>
        </div>
        <Anchor id='container'>
          <div className="container">
          <div className="">
              <div className="">
                <p className='h4 text-center'>Podés leer el reglamento completo haciendo click <a href="https://presupuestoparticipativo.unr.edu.ar/reglamento/" rel="noopener noreferer" target="_blank">aquí</a></p>
                <br />
                <br />
                <Accordion startPosition={openSection}>
                  <div data-trigger="+ ¿Quiénes pueden participar del PP Facultades?">
                    <p className='p-padding'>
                      Pueden participar docentes, nodocentes, estudiantes y graduados/as de las 12 Facultades y otras Sedes y dependencias de la UNR.
                    </p>
                  </div>
                  <div data-trigger="+ ¿En qué se basa la etapa de Foro del PPUNR?">
                    <p className='p-padding'>
                    El Foro tiene por objetivo que los/as integrantes de la comunidad propongan ideas que aporten en la construcción de la Universidad que queremos. Estará abierto desde el 10 de Mayo al 24 de Mayo.        También podrás en esta instancia sumarte como proyectista.
                    </p>
                    <p className='p-padding'>
                    Además, habrá encuentros presenciales paralelamente al Foro virtual para que puedas acercarte a dejar tu idea, construirla con otros/as y anotarte para ser proyectista.
                    </p>
                  </div>
                  <div data-trigger="+ ¿Cómo participo?">
                    <p className='p-padding'>
                    Te invitamos a <Link href="/signup" className="text-primary">registrarte aquí</Link> para sumar ideas y comentar las ideas de otros/as participantes. Podrás también expresar tu interés en apoyar y sumarte a alguna de las propuestas. Es muy importante que fomentemos el diálogo informado y respetuoso.
                    </p>
                    <p className='p-padding'>
                    También podrás inscribirte para ser proyectista de la Comisión Universitaria. Como la comisión estará organizada en torno a áreas temáticas, te proponemos elegir el área en la que quieras trabajar para transformar las ideas del foro en proyectos. No es necesario presentar una idea para ser proyectista.    
                    </p>
                    <p className='p-padding'>
                    Además, habrá encuentros presenciales paralelamente al Foro virtual para que puedas acercarte a dejar tu idea, construirla con otros/as y anotarte para ser proyectista. Podes ver el calendario haciendo <Link href="/s/foro-presencial" className="text-primary">clic acá</Link>. 
                    </p>
                  </div>
                  <div data-trigger="+ ¿Cuáles son los temas para proponer ideas?">
                    <p className='p-padding'>
                      Vas a encontrar en el formulario una serie de etiquetas que refieren a diversos temas:
                    </p>
                    <ul className='p-padding'>
                      <li>Bienestar universitario</li>
                      <li>Deporte y Cultura</li>
                      <li>Espacios comunes</li>
                      <li>Ambiente y Sustentabilidad</li>
                      <li>Tecnologías e innovación</li>
                    </ul>
                    <p className='p-padding'>
                    Sólo podrás elegir una, la que te parezca define más y mejor tu idea. La misma luego será retomada por el área temática respectiva dentro de la Comisión Universitaria, pudiendo ser reasignada por parte del equipo el PPUNR.
                    </p>
                  </div>
                  <div data-trigger="+ ¿Cómo subo una idea?">
                    <p className='p-padding'>
                    Encontrarás aquí el espacio para colocar tu idea: incluí un título y escribí un breve párrafo explicándola. Agregá etiquetas preconfiguradas para clasificar tu idea. Eso ayudará a agruparlas por afinidad para la próxima fase del Foro. Podes usar emoticones y subir imágenes que ilustren la propuesta.
                    </p>
                  </div>
                  <div data-trigger="+ ¿Qué pasa si no puedo registrarme?">
                    <p className='p-padding'>
                    Te invitamos a que nos mandes un correo con todos tus datos (nombre completo, DNI, Facultad, claustro, mail o forma de contacto) a <a href="mailto:presupuestoparticipativo@unr.edu.ar">presupuestoparticipativo@unr.edu.ar</a>
                    </p>
                  </div>
                  <div data-trigger="+ ¿Cuántas ideas puedo subir?">
                    <p className='p-padding'>
                    Podés subir todas las ideas que quieras, cada una en un formulario independiente
                    </p>
                  </div>
                  <div data-trigger="+ ¿Qué tipo de ideas esperamos que subas al Foro del PP Facultades?">
                    <p className='p-padding'>
                      Las ideas tienen que implicar aportes para al menos tres Facultades o para los espacios comunes (como el gimnasio o los comedores). No pueden ser ideas que sólo impacten en una Facultad. Esto tiene por objetivo que pensemos a la Universidad en un sentido más transversal e inclusivo, así como generar propuestas multidisciplinarias. 
                    </p>
                  </div>
                  <div data-trigger="+ ¿Puedo modificar mi idea una vez que fue enviada?">
                    <p className='p-padding'>
                      Si, puedes modificar tu idea tantas veces como quieras mientras el Foro esté abierto.
                    </p>
                  </div>
                  <div data-trigger="+ ¿Cuándo se cierra el Foro?">
                    <p className='p-padding'>
                    El Foro se cerrará el 24 de mayo. Hasta entonces tenés tiempo para modificar tu idea, intercambiar sobre las ideas de otros/as participantes y anotarte para ser proyectista.
                    </p>
                  </div>
                  <div data-trigger="+ ¿Qué pasará con mi idea?">
                    <p className='p-padding'>
                    Otros/as participantes pueden comentar tu idea o apoyarla. Te invitamos a entrar en diálogo con otros/as participantes. Luego de cerrado el Foro haremos una sistematización de ideas por temas y quienes se inscriban como proyectistas podrán transformarlas en proyectos en el marco de la Comisión Universitaria.
                    </p>
                  </div>
                  <div data-trigger="+ ¿Si no subo una idea, puedo ser proyectista?">
                    <p className='p-padding'>
                    Podés sumarte en cualquier etapa del proceso aunque no hayas participado de las anteriores. Es decir, podés no haber propuesto o comentado ideas pero interesarte por sumar tu aporte como proyectista.
                    </p>
                  </div>
                  <div data-trigger="+ ¿Qué implica ser proyectista?" >
                    <Anchor id='proyectista'>
                      <p className='p-padding'>
                      Luego de los Foros, la segunda etapa del PP es la conformación de la Comisión Universitaria. La misma estará integrada por todas las personas que se hayan propuesto para transformar las ideas en proyectos. En unos pocos encuentros le daremos forma a las ideas a partir de intercambios con técnicos de la Universidad que contribuirán a darle factibilidad a los proyectos que serán elegidos por la comunidad para ser ejecutados en 2023.
                      </p>
                    </Anchor>
                  </div>
                  <div data-trigger="+ ¿Qué condiciones deben respetar los proyectos?">
                    <ul className='p-padding'>
                      <li>Incluir resultados para al menos tres unidades académicas o algún espacio común.</li>
                      <li>El monto de cada proyecto no puede superar el 70% de la partida asignada.</li>
                      <li>No exceder el límite presupuestario.</li>
                      <li>No exceder el ámbito de la Universidad.</li>
                      <li>No afectar partidas presupuestarias de años posteriores.</li>
                      <li>Ser factibles técnicamente para poder ser ejecutados en caso de ser elegidos.</li>
                    </ul>
                  </div>
                  <div data-trigger="+ ¿Qué espacios podemos intervenir con proyectos del PP?">
                    <p className='p-padding'>
                    Cualquier espacio de la UNR.  El proyecto tiene que incluir resultados para al menos tres unidades académicas o bien para algún espacio común de la Universidad (comedores, gimnasios, Sede, Rectorado, CUR, anexo, etc.).
                    </p>
                  </div>
                  <div data-trigger="+ ¿Cuál es el monto asignado al PPUNR edición 2022?">
                    <p className='p-padding'>
                    25 millones de pesos, de los cuales, cada Escuela tendrá disponible un  millón y medio para discutir en el marco de su comunidad, y el resto, $20.500.000, estarán destinados al PP Facultades.
                    </p>
                  </div>
                  <div data-trigger="+ ¿Cómo elegiremos los proyectos a ejecutarse en 2023?">
                    <p className='p-padding'>
                    Se realizarán jornadas de votación previa difusión de los proyectos elegibles, para que toda la comunidad de la UNR pueda decidir cuáles serán ejecutados hasta alcanzar el total de la partida presupuestaria afectada al PP Facultades. Como ningún proyecto puede superar el 70% de la partida, al menos dos proyectos serán ganadores.
                    </p>
                  </div>
                  <div data-trigger="+ Puedo participar si pertenezco a las Sedes, Gimnasio UNR, ECU, comedores y otras dependencias?">
                    <p className='p-padding'>
                    Si, claro! todos/as los/as actores de la comunidad UNR están invitados a participar. En el campo Facultad del formulario de registro, encontrás la opción “Otras Sedes y Dependencias UNR” para vincularte.
                    </p>
                  </div>
                  <div data-trigger="+ ¿Pueden participar los/las estudiantes de posgrado?">
                    <p className='p-padding'>
                    Sí, pueden participar todos/as los/as estudiantes de posgrado.
                    </p>
                  </div>
                  <div data-trigger="+ ¿Pueden participar los/las estudiantes y docentes de ProUaPam (Programa para Adultos Mayores)?">
                    <p className='p-padding'>
                    Sí, pueden participar todos/as los/as integrantes del PRoUaPam.
                    </p>
                  </div>
                  <div data-trigger="+ ¿Pueden participar los/las integrantes de las extensiones áulicas?">
                    <p className='p-padding'>
                    Sí, pueden participar todos/as los/as integrantes de las extensiones áulicas?
                    </p>
                  </div>
                </Accordion>
              </div>
            </div>
            <br />
            <br />
            <br />
          </div>
        </Anchor>
        <Jump goTop={this.goTop} />
        <Footer />
      </div>
    )
  }
}
