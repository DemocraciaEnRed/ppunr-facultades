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
                  <div data-trigger="+ ¿En qué se basa la etapa de Foro del PPUNR?">
                    <p className='p-padding'>
                      El Foro tiene por objetivo que las/os integrantes de la comunidad propongan ideas que aporten en la construcción de la Universidad que queremos. A su vez, podrán inscribirse para ser parte de la Comisión Universitaria, para transformar las ideas propuestas en proyectos. Estará abierto desde el 23 de junio al 7 de julio. 
                    </p>
                  </div>
                  <div data-trigger="+ ¿Cómo participo?">
                    <p className='p-padding'>Te invitamos a registrarte <Link to="/signup">aquí</Link> para sumar ideas y comentar las ideas de otros/as participantes. Podrás también expresar tu interés me gusta y comentar las mismas. Es muy importante que fomentemos el diálogo informado y respetuoso. Además podrás inscribirte como proyectista <Link to="/signup">aquí</Link>  para integrar la Comisión Universitaria. Como la comisión estará organizada en torno a áreas temáticas, podrás inscribirte en el área en la que quieras trabajar para transformar las ideas del foro en proyectos. No es necesario presentar una idea para ser proyectista. </p>
                  </div>
                  <div data-trigger="+ ¿Cuáles son los temas para proponer ideas?">
                    <p className='p-padding'>
                    Vas a encontrar en el formulario una serie de etiquetas que refieren a diversas áreas temáticas. Sólo podrás elegir una, la que te parezca define más y mejor tu idea. La misma luego será retomada por el área temática respectiva dentro de la Comisión Universitaria pudiendo ser reasignada por parte del equipo el PPUNR. 
                    <br/>
                    <ul>
                      <li>Ambiente y Sustentabilidad</li>
                      <li>Género, DDHH y Accesibilidad</li>
                      <li>Infraestructura</li>
                      <li>Académica y Aprendizajes</li>
                      <li>Vinculación con el medio</li>
                      <li>Arte, Deporte y Salud</li>
                      <li>Convivencia y Participación</li>
                    </ul>
                    </p>
                  </div>

                  <div data-trigger="+ ¿Cómo subo una idea?">
                    <p className="p-padding">
                      Encontrarás aquí el espacio para proponer tu idea: incluí un título y escribí un breve párrafo explicándola. Agregá el área temática. Eso ayudará a agruparlas por afinidad para la próxima etapa: la Comisión Universitaria. 
                    </p>
                  </div>

                  <div data-trigger="+ ¿Qué pasa si no puedo registrarme?">
                    <p className='p-padding'>Te invitamos a que nos mandes un correo con todos tus datos (nombre completo, DNI, Facultad, claustro, mail o forma de contacto) a <a href="mailto:presupuestoparticipativo@unr.edu.ar">presupuestoparticipativo@unr.edu.ar</a></p>
                  </div>
                  
                  <div data-trigger="+ ¿Cuántas ideas puedo subir?">
                    <p className="p-padding">Podés subir todas las ideas que quieras aunque cada una en un formulario independiente.  Pueden ser de áreas temáticas diferentes. </p>
                  </div>

                  <div data-trigger="+ ¿Qué tipo de ideas esperamos que subas al Foro del PP Facultades?">
                    <p className="p-padding">Las ideas tienen que implicar aportes para más de dos Facultades o para los espacios comunes (como el gimnasio o los comedores). No pueden ser ideas que sólo impacten en una unidad académica. Esto tiene por objetivo que pensemos a la Universidad en un sentido más transversal e inclusivo, así como también, alienta la generación de propuestas multidisciplinarias. </p>
                  </div>
                  
                  <div data-trigger="+ ¿Puedo modificar mi idea una vez que fue enviada?">
                    <p className="p-padding">Si, puedes modificar tu idea tantas veces como quieras mientras el Foro esté abierto.</p>
                  </div>
                  
                  <div data-trigger="+ ¿Cuándo se cierra el Foro?">
                    <p className="p-padding">
                      El Foro se cerrará el 7 de Julio. Hasta entonces tenés tiempo para modificar tu idea e intercambiar sobre las ideas de otros/as participantes. También estará abierta hasta esa fecha la posibilidad de inscribirte para ser proyectista y formar parte de la Comisión Universitaria
                    </p>
                  </div>
                  <div data-trigger="+ ¿Qué pasará con mi idea?">
                    <p className="p-padding">Otros/as participantes pueden comentar tu idea o darle like. Te invitamos a entrar en diálogo con otros/as participantes. Cerrado el Foro realizaremos una sistematización de ideas por temas. Las que sean aptas en el marco del PPUNR, se retomarán en la Comisión Universitaria para ser desarrolladas como proyectos elegibles en la etapa de votación. </p>
                  </div>

                  <div data-trigger="+ Si no participé de una etapa anterior, ¿puedo sumarme?">
                    <p className="p-padding">
                      Podés sumarte en cualquier etapa del proceso aunque no hayas participado de las anteriores. Es decir, podés no haber propuesto o comentado ideas pero interesarte por ser proyectista. Tampoco será necesario que participes del Foro o formes parte de la Comisión Universitaria para votar.
                    </p>
                  </div>
                  <div data-trigger="+ ¿Qué implica ser proyectista?">
                    <p className="p-padding">
                      Luego de los Foros, la segunda etapa del PP es la conformación de la Comisión Universitaria. La misma estará integrada por todas las personas que se hayan propuesto para transformar las ideas en proyectos. Funcionará durante dos meses  (agosto- septiembre) en el marco de algunos encuentros organizados por área temática. En dichos encuentros se trabajará de manera colaborativa con el resto de los/as proyectistas y participarán técnicos de la Universidad que contribuirán a darle factibilidad a los proyectos que serán elegidos por la comunidad y ejecutados en 2022. 
                    </p>
                  </div>
                  <div data-trigger="+ ¿Qué condiciones deben respetar los proyectos?">
                    <p className="p-padding">
                      <ul>
                        <li>Ser elaborados por integrantes de más de un claustro.</li>
                        <li>Incluir resultados para más de dos unidades académicas o algún espacio común.</li>
                        <li>No exceder el 70% del límite presupuestario.</li>
                        <li>No exceder el ámbito de la Universidad.</li>
                        <li>No afectar partidas presupuestarias de años posteriores.</li>
                        <li>Ser factibles técnicamente para poder ser ejecutados en caso de ser elegidos.</li>
                      </ul>
                    </p>
                  </div>
                <div data-trigger="+ ¿Qué espacios podemos intervenir con proyectos del PP?"> 
                  <p className="p-padding">
                    Tiene que incluir resultados para más de una unidad académica o bien para algún espacio común de la Universidad (comedores, gimnasios, Sede, Rectorado, CUR, anexo, etc.).  
                  </p>
                </div>
                <div data-trigger="+ ¿Cuál es el monto asignado al PPUNR edición 2021?">
                  <p className="p-padding">
                    $20.900.000<br/>
                    De los cuales se asignarán $1.300.000 a cada Escuela y $17.000.000 al PP Facultades. 
                  </p>
                </div>
                <div data-trigger="+ ¿Cómo elegiremos los proyectos a ejecutarse en 2022?">
                  <p className="p-padding">
                  Se realizarán jornadas de votación en el mes de octubre, previa difusión de los proyectos elegibles, para que toda la comunidad de la UNR pueda decidir cuáles serán ejecutados hasta alcanzar el total de la partida presupuestaria afectada al PP Facultades. Como ningún proyecto puede exceder el 70% del límite presupuestario, por lo menos dos proyectos serán los ganadores. 
                  </p>
                </div>
                <div data-trigger="+ ¿Puedo participar si pertenezco a las Sedes, Gimnasio UNR, ECU, comedores y otras dependencias?">
                  <p className="p-padding">
                  Si, claro! todas las personas que integran la comunidad UNR están invitadas a participar. En el campo Facultad del formulario de registro, encontrás la opción “Otras Sedes y Dependencias UNR” para vincularte.
                  </p>
                </div>
                <div data-trigger="+ ¿Pueden participar los/las estudiantes de posgrado?">
                  <p className="p-padding">
                    Sí, pueden participar todos/as los/as estudiantes de posgrado. 
                  </p>
                </div>
                
                <div data-trigger="+ ¿Pueden participar estudiantes y docentes de ProUaPam (Programa para Adultos Mayores)?">
                  <p className="p-padding">
                  Sí, pueden participar todos/as los/as integrantes del PRoUaPam. 
                  </p>
                </div>

                <div data-trigger="+ ¿Pueden participar integrantes de las extensiones áulicas?">
                  <p className="p-padding">
                  Sí, pueden participar integrantes de las extensiones áulicas.
                  </p>
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
