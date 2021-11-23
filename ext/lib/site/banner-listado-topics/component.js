import React from 'react'

export default function BannerListadoTopics(props) {

  const votos = (props.user.state.fulfilled && props.user.state.value.voto) ? props.user.state.value.voto : []

  const socialLinksUrl = window.location
  const twitterText = `Sumate a pensar la Universidad que queremos. ` + socialLinksUrl

  const messageVoto = (votos) => {
    switch (3 - votos.length) {
      case 3: return "Tenés 3 votos disponibles"
      case 2: return "Todavía podés votar 2 proyectos!"
      case 1: return "Todavía podés votar 1 proyectos!"
      case 0: return `Ya votaste tres proyectos. <a target='_blank' href='http://twitter.com/share?text=${twitterText}' rel='noopener noreferrer'>Compartí para que más personas voten</a>`
      default: return false
    }
  }

  return (
    <div>
      {props.user.state.fulfilled && 
        <header className='banner-votos'>
          <h1 className='votos-title'>
            <div dangerouslySetInnerHTML={{__html: messageVoto(votos)}} />
          </h1>
        </header>
      }
    <header className='banner-proyectos'>
      {/* <h1 className='proyectos-title'>{stage === 'votacion' ? 'Proyectos ganadores' : 'Seguimiento de proyectos' }</h1> */}
      {/* <h2 className='proyectos-subtitle'>{stage === 'votacion' ? 'Acá podes encontrar los proyectos ganadores de 2019' : 'Acá podés encontrar los proyectos que fueron aprobados en votaciones anteriores y ver en qué estado de su ejecución se encuentran.'}</h2> */}
      {/*  <h1 className='proyectos-title'>{stage === 'votacion' ? 'Proyectos Ganadores' : 'Seguimiento de proyectos' }</h1> */}
      {/* <h2 className='proyectos-subtitle'>{stage === 'votacion' ? 'Acá podés encontrar los proyectos ganadores que vamos a ejecutar en 2020' : 'Acá podés encontrar los proyectos que fueron aprobados en votaciones anteriores y ver en qué estado de su ejecución se encuentran.'}</h2> */}
      {/* <h1 className='proyectos-title'>Estamos trabajando, falta poco para que publiquemos los proyectos a votacion.</h1> */}
      <h1 className='proyectos-title'>{props.title}</h1>
      { props.subtitle &&
        <h2 className='proyectos-subtitle' dangerouslySetInnerHTML={{__html: props.subtitle}}></h2>
      }
      { props.btnText &&
        <a className='proyectos-button boton-mandar-idea' tabIndex="0" href={props.btnLink}>{props.btnText}</a>
      }
    </header>
    </div>
  )
}
