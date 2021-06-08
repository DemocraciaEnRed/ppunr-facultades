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

                  <div data-trigger="+ ¿Cómo participo?">
                    <p className='p-padding'>Te invitamos a registrarte <Link to='/signup'>aquí</Link> para luego ingresar en UNR Decide y poder votar. Podrás elegir un proyecto que de resultar ganador se ejecutará durante 2022.</p>
                  </div>

                  <div data-trigger="+ ¿Qué pasa si no puedo registrarme?">
                    <p className='p-padding'>Te invitamos a que nos mandes un correo con todos tus datos (nombre completo, DNI, Facultad, claustro, mail o forma de contacto) a <a href="mailto:presupuestoparticipativo@unr.edu.ar">presupuestoparticipativo@unr.edu.ar</a></p>
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

                  <div data-trigger="+ ¿Cómo elegiremos los proyectos a ejecutarse en 2022?">
                    <p className='p-padding'>Previa difusión de los proyectos para que toda la comunidad de la UNR pueda conocerlos, se realizará la votación, a través de la cual se decidirá cuál/es será/n ejecutado/s hasta alcanzar el total de la partida presupuestaria afectada al PP Facultades. Es decir que, de acuerdo al monto de los proyectos elegidos, podrán ejecutarse uno o más proyectos.</p>
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
