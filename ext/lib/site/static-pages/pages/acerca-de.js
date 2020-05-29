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
              <h1>Presupuesto Participativo</h1>
            </div>
          </div>
        </section>
        <div id='container'>
          <div className='ext-acerca-de container'>
            <div className="filas">
              <div className="fila faq text-left">
                <p className='p-padding'>Podés leer el reglamento completo haciendo click <a href="https://presupuestoparticipativo.unr.edu.ar/?page_id=1551" rel="noopener noreferer" target="_blank">aquí</a></p>

                <Accordion>
                  <div data-trigger="+ ¿Quiénes pueden participar?">
                    <p className='p-padding'>Pueden participar docentes, nodocentes, estudiantes y graduados/as de la UNR.</p>
                  </div>

                  <div data-trigger="+ ¿En qué se basa esta etapa del Presupuesto Participativo de la Universidad?" data-triggerDisabled={true}>
                    <p className='p-padding'>Esta etapa de los Foros tiene por objetivo proponer ideas en base a los ejes temáticos propuestos adaptados de la Agenda 2030.</p>
                  </div>

                  <div data-trigger="+ ¿Quiénes pueden participar?">
                    <p className='p-padding'>Pueden participar docentes, nodocentes, estudiantes y graduados/as de la UNR.</p>
                  </div>

                  <div data-trigger="+ ¿Cuáles son los ejes para proponer ideas?">
                  <p>Los ejes que proponemos para que nos dejes tu idea son:</p>
                  <p>1. Innovación</p>
                  <p>2. Accesibilidad y sustentabilidad</p>
                  <p>3. Género e inclusión</p>
                  <p>4. Aprendizajes</p>
                  <p>5. Modernización y transparencia</p>
                  <p>6. Bioseguridad</p>
                  </div>

                  <div data-trigger="+ ¿Cómo subo una idea?">
                    <p className='p-padding'>Encontrarás <Link to='/formulario-propuesta'>aquí</Link> el espacio para colocar tu idea: elegí un eje; incluí un título y escribí un breve párrafo explicando tu idea. Podés agregar etiquetas preconfiguradas que complementen tu idea. Eso ayudará a agrupar las ideas por afinidad para la próxima etapa.</p>
                    <p className='p-padding'>Podes cargar todas las ideas que quieras pero en formularios distintos.</p>
                  </div>

                  <div data-trigger="+ ¿Cómo participo?">
                    <p className='p-padding'>Te invitamos a comentar las ideas de otros/as participantes. Incluso manifestar tu interés en apoyar y sumarte a alguna de ellas. Es muy importante que fomentemos el diálogo informado y respetuoso.</p>
                  </div>

                  <div data-trigger="+ ¿Qué tipo de ideas esperamos?">
                    <p className='p-padding'>Tené presente que las ideas y posteriormente los proyectos tiene que incluir aportes para más de una unidad académica. Es decir, no pueden ser ideas que sólo impacten en una Facultad. Esto tiene por objetivo que podamos pensar la Universidad en un sentido más transversal e inclusivo así como generar propuestas multidisciplinarias.</p>
                  </div>
                </Accordion>

              </div>

              <div className="fila no-bg hidden">
                <Anchor id='mapa'>
                  <div className="map-box">
                    <div className='mapa'>
                      <iframe src="https://www.google.com/maps/d/u/0/embed?mid=1DEX8V6qaMQy-8NYKNPhsLH_xQnY&z=11&ll=-34.5174, -58.5026" width="640" height="480"></iframe>
                    </div>
                  </div>
                </Anchor>
                <Anchor id='cronograma'>
                  <div className='table-responsive'>
                    <h3>Cronograma de reuniones por barrio</h3>
                    <div>El horario de las reuniones de presentación de propuestas es de 19 a 21 hs</div>
                    <table className='table tabla-reuniones'>
                      <tbody>
                        <tr>
                          <th>Olivos</th>
                          <th>Martes 20 de marzo</th>
                          <th>Colegio Virgen Del Carmen</th>
                          <th>Valle Grande 3141</th>
                        </tr>
                        <tr>
                          <td>Olivos</td>
                          <td>Jueves 22 de marzo</td>
                          <td>Colegio Asunción De La Virgen</td>
                          <td>Ugarte 2379</td>
                        </tr>
                        <tr>
                          <td>Olivos</td>
                          <td>Jueves 5 de abril</td>
                          <td>Escuela Primaria nº 2</td>
                          <td>Pelliza 1390</td>
                        </tr>
                        <tr>
                          <td>La Lucila</td>
                          <td>Martes 10 de abril</td>
                          <td>Jardín De Infantes nº 8</td>
                          <td>Díaz Vélez 1129</td>
                        </tr>
                        <tr>
                          <td>Munro</td>
                          <td>Jueves 12 de abril</td>
                          <td>Inst. De Ed. Integral De Munro</td>
                          <td>Carlos Tejedor 2761</td>
                        </tr>
                        <tr>
                          <td>Munro</td>
                          <td>Martes 17 de abril</td>
                          <td>Colegio María Auxiliadora</td>
                          <td>Panamá 3274</td>
                        </tr>
                        <tr>
                          <td>Vicente López</td>
                          <td>Jueves 19 de abril</td>
                          <td>Colegio Saint Gregory</td>
                          <td>Melo 948</td>
                        </tr>
                        <tr>
                          <td>Carapachay</td>
                          <td>Jueves 3 de Mayo</td>
                          <td>Escuela Secundaria nº 3</td>
                          <td>Drysale 5635</td>
                        </tr>
                        <tr>
                          <td>Florida Oeste</td>
                          <td>Martes 8 de mayo</td>
                          <td>Instituto Florentino Ameghino</td>
                          <td>C. De Alvear 1144</td>
                        </tr>
                        <tr>
                          <td>Villa Martelli</td>
                          <td>Jueves 10 de mayo</td>
                          <td>Instituto Fátima</td>
                          <td>Laprida 4075</td>
                        </tr>

                        <tr>
                          <td>Villa Adelina</td>
                          <td>Martes 15 de mayo</td>
                          <td>Avapea</td>
                          <td>Plaza Ader</td>
                        </tr>
                        <tr>
                          <td>Florida Este</td>
                          <td>Jueves 17 de mayo</td>
                          <td>Escuela Primaria nº 12</td>
                          <td>Haedo 2180</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </Anchor>
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
