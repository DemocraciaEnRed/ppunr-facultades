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
                  <div data-trigger="+ ¿Quiénes pueden participar del PP Escuelas?">
                    <p className='p-padding'>Pueden participar docentes, nodocentes, estudiantes, graduados y graduadas de cada Escuela: Agrotécnica, Superior y Politécnico.</p>
                  </div>

                  <div data-trigger="+ ¿Cómo participo?">
                    <p className='p-padding'>Te invitamos a registrarte <Link to='/signup'>aquí</Link> para luego ingresar en UNR Decide y poder votar. Podrás elegir un proyecto que de resultar ganador se ejecutará durante 2021.</p>
                  </div>

                  <div data-trigger="+ ¿Qué pasa si no puedo registrarme?">
                    <p className='p-padding'>Te invitamos a que nos mandes un correo con todos tus datos (nombre completo, DNI, Facultad, claustro, mail o forma de contacto) al mail de tu escuela:
                      <ul>
                        <li>Agrotécnica: <a href="mailto:presupuestoparticipativoagro@gmail.com">presupuestoparticipativoagro@gmail.com</a></li>
                        <li>Superior: <a href="mailto:superiorparticipativo@unr.edu.ar">superiorparticipativo@unr.edu.ar</a></li>
                        <li>Politécnico: <a href="mailto:presupuestoparticipativo@ips.edu.ar">presupuestoparticipativo@ips.edu.ar</a></li>
                      </ul>
                    </p>
                  </div>

                  <div data-trigger="+ ¿Qué condiciones deben respetar los proyectos?">
                    <ul className='p-padding'>
                      <li>Ser elaborados por integrantes de más de un claustro.</li>
                      <li>No exceder el límite presupuestario (1 millón de pesos).</li>
                      <li>No exceder el ámbito de la Universidad.</li>
                      <li>No afectar partidas presupuestarias de años posteriores.</li>
                      <li>Ser factibles técnicamente para poder ser ejecutados en caso de ser elegido.</li>
                    </ul>
                  </div>

                  <div data-trigger="+ ¿Cuál es el monto asignado para cada Escuela en el PPUNR 2020?">
                    <p className='p-padding'>Cada Escuela tendrá disponible un millón de pesos para discutir en el marco de su comunidad.</p>
                  </div>

                  <div data-trigger="+ ¿Cómo elegiremos los proyectos a ejecutarse en 2021?">
                    <p className='p-padding'>Previa difusión de los proyectos para que toda la comunidad de la Escuela pueda conocerlos, se realizará la votación, a través de la cual se decidirá cuál/es será/n ejecutado/s hasta alcanzar el total de la partida presupuestaria afectada al PP de tu Escuela. Es decir que, de acuerdo al monto de los proyectos elegidos, podrán ejecutarse uno o más proyectos.</p>
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
