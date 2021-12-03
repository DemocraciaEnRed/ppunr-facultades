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
                    <p className='p-padding'>
                      Pueden participar docentes, nodocentes, estudiantes, graduados y graduadas de las 12 Facultades y otras Sedes y dependencias de la UNR.
                    </p>
                  </div>
                  <div data-trigger="+ ¿Cuántos proyectos puedo elegir?">
                    <p className='p-padding'>
                      Podés votar uno, dos o tres proyectos.
                    </p>
                  </div>
                  <div data-trigger="+ ¿Qué pasa si no puedo registrarme?">
                    <p className='p-padding'>Te invitamos a que nos mandes un correo con todos tus datos (nombre completo, DNI, Facultad, claustro, mail o forma de contacto) a presupuestoparticipativo@unr.edu.ar </p>
                  </div>
                  <div data-trigger="+ Si no participé de una etapa anterior, ¿puedo sumarme?">
                    <p className='p-padding'>
                      Podés sumarte en cualquier etapa del proceso aunque no hayas participado de las anteriores. Es decir, podés no haber propuesto o comentado ideas pero interesarte por ser proyectista. Tampoco será necesario que participes del Foro o formes parte de la Comisión Universitaria para votar.
                    </p>
                  </div>

                  <div data-trigger="+ ¿Cuál es el monto asignado al PPUNR edición 2021?">
                    <p className="p-padding">
                      $20.900.000. De los cuales se asignarán $1.300.000 a cada Escuela y $17.000.000 al PP Facultades.
                    </p>
                  </div>

                  <div data-trigger="+ ¿Cómo elegimos los proyectos a ejecutarse en 2022?">
                    <p className='p-padding'>
                      Se realizarán jornadas de votación desde el 24/11 a las 10hs hasta el 03/12 a las 23hs, previa difusión de los proyectos elegibles, para que toda la comunidad de la UNR pueda decidir cuáles serán ejecutados hasta alcanzar el total de la partida presupuestaria afectada al PP Facultades. Como ningún proyecto puede exceder el 70% del límite presupuestario, por lo menos dos proyectos serán los ganadores. 
                    </p>
                  </div>
                  
                  <div data-trigger="+ ¿Puedo participar si pertenezco a las Sedes, Gimnasio UNR, ECU, comedores y otras dependencias?">
                    <p className="p-padding">
                      ¡Sí, claro! todas las personas que integran la comunidad UNR están invitadas a participar. En el campo Facultad del formulario de registro, encontrás la opción “Otras Sedes y Dependencias UNR” para sumarte.
                    </p>
                  </div>

                  <div data-trigger="+ ¿Pueden participar los/las estudiantes de posgrado?">
                    <p className="p-padding">
                      Sí, pueden participar todos/as los/as estudiantes de posgrado. 
                    </p>
                  </div>
                  
                  <div data-trigger="+ ¿Pueden participar los/las estudiantes y docentes de ProUaPam (Programa para Adultos Mayores)?">
                    <p className="p-padding">
                      Sí, pueden participar todos/as los/as integrantes del PRoUaPam.
                    </p>
                  </div>
                  
                  <div data-trigger="+ ¿Pueden participar los/las integrantes de las extensiones áulicas?">
                    <p className="p-padding">
                      Sí, pueden participar todos/as los/as integrantes de las extensiones áulicas.
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
