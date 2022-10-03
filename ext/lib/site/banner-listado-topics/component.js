import React from 'react'

export default function BannerListadoTopics(props) {

  const {votes, dni, userLoggedIn } = props.voterInformation

  const socialLinksUrl = window.location
  const twitterText = `Sumate a elegir proyectos para la Universidad que queremos. ` + socialLinksUrl
  
  const messageVoto = (votes) => {
    switch (3 - votes.length) {
      case 3: return "Tenés 3 votos disponibles"
      case 2: return "Todavía podés votar 2 proyectos!"
      case 1: return "Todavía podés votar 1 proyecto!"
      case 0: return `Ya votaste tres proyectos. <a target='_blank' href='http://twitter.com/share?text=${twitterText}' rel='noopener noreferrer'>Compartí para que más personas voten</a>`
      default: return false
    }
  }

  return (
    <div>
      {userLoggedIn && dni !== '' && votes && 
        <header className='banner-votos'>
          <h1 className='votos-title'>
            <div dangerouslySetInnerHTML={{__html: messageVoto(votes)}} />
          </h1>
        </header>
      }
    <header className='banner-proyectos'>
      {/* <h1 className='proyectos-title'>{stage === 'votacion' ? 'Proyectos ganadores' : 'Seguimiento de proyectos' }</h1> */}
      {/* <h2 className='proyectos-subtitle'>{stage === 'votacion' ? 'Acá podes encontrar los proyectos ganadores de 2019' : 'Acá podés encontrar los proyectos que fueron aprobados en votaciones anteriores y ver en qué estado de su ejecución se encuentran.'}</h2> */}
      {/*  <h1 className='proyectos-title'>{stage === 'votacion' ? 'Proyectos Ganadores' : 'Seguimiento de proyectos' }</h1> */}
      {/* <h2 className='proyectos-subtitle'>{stage === 'votacion' ? 'Acá podés encontrar los proyectos ganadores que vamos a ejecutar en 2020' : 'Acá podés encontrar los proyectos que fueron aprobados en votaciones anteriores y ver en qué estado de su ejecución se encuentran.'}</h2> */}
      {/* <h1 className='proyectos-title'>Estamos trabajando, falta poco para que publiquemos los proyectos a votacion.</h1> */}
      {
      (userLoggedIn && props.handlerVotacion) ? 
      <button className='iniciar-votacion' onClick={props.handlerVotacion}>{dni === '' ? 'Iniciar Votación': 'Finalizar Votación'}</button> :
      <h1 className='proyectos-title'>{props.title}</h1>
      }
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
