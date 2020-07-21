import React from 'react'
import { Link } from 'react-router'
import userConnector from 'lib/site/connectors/user'

export default userConnector(function ThumbsVoto(props) {
  let userState = props.user.state
  let userLoggedIn = userState.fulfilled
  let userEscuelaId = userLoggedIn && userState.value.escuelas.length > 0 && userState.value.escuelas[0]._id
  let
    styleIcono1 = { backgroundImage: `url(${props.texts['home-icono1-imagen']})` },
    styleIcono2 = { backgroundImage: `url(${props.texts['home-icono2-imagen']})` },
    styleIcono3 = { backgroundImage: `url(${props.texts['home-icono3-imagen']})` };
  return (
    <section className="thumbs info-landing">
      <div className="container-fluid">
        <div className="row cont fondo-violeta">
          <div className="subtitulo">
            <h2>{ props.texts['home-subtitle'] }</h2>
            {/*<h3>Hasta el 31 de mayo inclusive tenés tiempo para presentar tus propuestas</h3> */}
            <h3>{ props.texts['home-subtitle-text'] }</h3>
            <div className="btn-container">
              {//<div className="boton-azul boton-blanco">
              //  <a href="https://forosvecinales.blob.core.windows.net/informes/Escrutinio-2019.xlsx">Ver Resultados</a>
              //</div>
              }
              { config.propuestasAbiertas && <Link
                to={ userLoggedIn ? `/formulario-idea?id=${userEscuelaId}` : '/formulario-idea' }
                className="boton-mandar-idea">
                Mandá tu idea
              </Link>
              }
              {/*<Link
                to='/proyectos'
                className="boton-azul boton-blanco">
                Ver Proyectos
              </Link>*/}
            </div>
          </div>
        </div>
        <div className="row cont">
          <div className="col-md-4">
            <div
              className="que-son img-responsive"
              style={styleIcono1}>
            </div>
            <h2
              className="text-center">
              { props.texts['home-icono1-titulo']}
            </h2>
            <p className="que-son-cont">
              { props.texts['home-icono1-texto']}
            </p>
          </div>

          <div className="col-md-4">
            <div
              className="que-propongo img-responsive"
              style={styleIcono2}>
            </div>
            <h2 className="text-center">{ props.texts['home-icono2-titulo']}</h2>
            <p className="que-propongo-cont">
              {/* props.texts['home-icono2-texto']*/}
              Registrá tu usuario, completá el espacio con tus ideas para hacer la Universidad que Queremos y envianos tus propuestas. Tenés tiempo hasta el 20 de julio. Podés, abrir nuevos temas o sumarte a una conversación activa&nbsp;
              <Link to={ userLoggedIn ? `/formulario-idea?id=${userEscuelaId}` : '/formulario-idea' }>
                aquí
              </Link>.
              <br />
              ¡Iremos subiendo las novedades en esta plataforma y en nuestras redes sociales! Entrá a <a href='https://presupuestoparticipativo.unr.edu.ar/' rel="noopener noreferer" target="_blank">nuestra web</a> para más información.
            </p>

          </div>

          <div className="col-md-4">
            <div
              className="como-sigo img-responsive"
              style={styleIcono3}>
            </div>
            <h2 className="text-center">
              { props.texts['home-icono3-titulo']}
            </h2>
            <p className="donde-voto-cont">
              { props.texts['home-icono3-texto']} <a href='https://presupuestoparticipativo.unr.edu.ar/como-participo/' rel="noopener noreferer" target="_blank">Presupuesto Participativo UNR</a>
            </p>
          </div>

        </div>

        {/* <div
          className='row'>
          <div className='cont-boton-azul'>
            <Link to='/s/acerca-de' className="boton-azul">
                    Más información
            </Link>
          </div>
        </div> */}
      </div>
    </section>
  )
})
