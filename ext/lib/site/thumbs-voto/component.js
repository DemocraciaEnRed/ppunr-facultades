import React from 'react'
import { Link } from 'react-router'

export default function ThumbsVoto(props) {
  let
    styleIcono1 = { backgroundImage: `url(${props.texts['home-icono1-imagen']})` },
    styleIcono2 = { backgroundImage: `url(${props.texts['home-icono2-imagen']})` },
    styleIcono3 = { backgroundImage: `url(${props.texts['home-icono3-imagen']})` };

  let subtitle = props.texts['home-subtitle']

  const urlRegex = /(https?:\/\/)([a-zA-Z]+(?:\.[a-zA-Z]+){2,})/
  let subtitleUrl = null
  try {
    if (subtitle && urlRegex.test(subtitle)){
      let groups = urlRegex.exec(subtitle)
      subtitleUrl = groups[0]
      let subtitleUrlName = groups[2]
      // escapeamos por si trae cosas raras
      subtitle = subtitle.replace(/</g, '&lt;').replace(/>/g, '&gt;')
      subtitle = subtitle.replace(subtitleUrl, `<a href="${subtitleUrl}">${subtitleUrlName}</a>`)
    }
  } catch (e) {}

  return (
    <section className="thumbs info-landing">
      <div className="container-fluid">
        <div className="row cont fondo-violeta">
          <div className="subtitulo">
            { subtitleUrl ?
              <h2 dangerouslySetInnerHTML={{__html: subtitle}} />
              :
              <h2>{ subtitle }</h2>
            }
            {/*<h3>Hasta el 31 de mayo inclusive tenés tiempo para presentar tus propuestas</h3> */}
            <h3>{ props.texts['home-subtitle-text'] }</h3>
            <div className="btn-container">
              {//<div className="boton-azul boton-blanco">
              //  <a href="https://forosvecinales.blob.core.windows.net/informes/Escrutinio-2019.xlsx">Ver Resultados</a>
              //</div>
              }
              {/*
                <Link
                to='/formulario-idea'
                className="boton-mandar-idea">
                Subí tu idea
              </Link>
              */
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
            <h2 className="text-center">{props.texts['home-icono2-titulo']}</h2>
            <p className="que-propongo-cont">
              {props.texts['home-icono2-texto']}
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
              {props.texts['home-icono3-texto']}
            </p>
          </div>

        </div>
        {/*
        <div className='row'>
          <div className='cont-boton-azul'>
            <Link to='https://presupuestoparticipativo.unr.edu.ar/como-participo/' className="boton-azul">
              ¿Como participo?
            </Link>
          </div>
        </div>
        */}      
        
      </div>
    </section>
  )
}
