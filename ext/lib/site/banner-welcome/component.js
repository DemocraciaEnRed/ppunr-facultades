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
    return (
      <div id='bannerwelcome' className='banner-welcome'>
        <img src="/ext/lib/site/banner-welcome/vector.png" className="image-large" alt="Icono proyectistas"/>
        <p className="title"><strong>{
          config.votacionAbierta ? '¡Ya iniciamos la votación!' : 
          `¡Iniciamos el PPUNR ${config.currentEdition}!` 
          }</strong></p>
        <p className="subtitle">{
        config.votacionAbierta ? 'Podés votar hasta 3 proyectos' : 
        'Te invitamos a conocer las ideas subidas en el Foro  virtual o conocer más sobre los foros presenciales'
        }</p>

        <div className="container">
        <div className="row">
          <div className="col-md-3">
            <Link to={'/propuestas'} className="boton-foro-virtual" href="">VOTÁ</Link>
          </div>
          {/* <div className="col-md-3">
            <Link to={'/s/foro-presencial'} className="boton-foro-presencial" href="">Votación Presencial</Link>
          </div> */}
        </div>
      </div>
      </div>
    )
  }
}

export default userConnector(BannerWelcome)
