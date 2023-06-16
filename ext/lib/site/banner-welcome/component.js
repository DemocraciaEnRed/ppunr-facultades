import React, { Component } from 'react'
import { Link } from 'react-router'
import userConnector from 'lib/site/connectors/user'
import config from 'lib/config'

class BannerWelcome extends Component {
  constructor (props) {
    super(props)
    this.state = {

    }
  }

  render () {
    const { forumConfig } = this.props
    return (
      <div id='bannerwelcome' className='banner-welcome'>
        <img src="/ext/lib/site/banner-welcome/vector.png" className="image-large" alt="Icono proyectistas"/>
        <p className="title"><strong>{
          config.votacionAbierta ? '¡Ya iniciamos la votación!' : 
          `PPUNR ${config.currentEdition}` 
          }</strong></p>
        <p className="subtitle">{
        config.votacionAbierta ? 'Podés votar hasta 3 proyectos' : 
        'Te invitamos a ver más información en: presupuestoparticipativo.unr.edu.ar'
        }</p>

        <div className="container">
        <div className="row">
          <div className="col-md-3">
            <Link to={'/propuestas'} className="boton-foro-virtual" href="">{forumConfig.ideacion? 'IDEAS' : 'PROYECTOS'}</Link>
          </div>
          {/* <div className="col-md-3">
            <Link to={'/s/agenda'} className="boton-foro-presencial" href="">Votación Presencial</Link>
          </div> */}
        </div>
      </div>
      </div>
    )
  }
}

export default userConnector(BannerWelcome)
