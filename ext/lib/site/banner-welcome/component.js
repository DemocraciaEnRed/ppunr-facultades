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
        <p className="title"><strong>¡Iniciamos el PPUNR {config.currentEdition}!</strong></p>
        <p className="subtitle">Te invitamos a conocer las ideas subidas en el Foro  virtual o conocer mas sobre los foros prescenciales</p>

        <div className="container">
        <div className="row">
          <div className="col-md-3">
            <Link to={'/propuestas'} className="boton-foro-virtual" href="">Foro Virtual</Link>
          </div>
          <div className="col-md-3">
            <Link to={'/s/foro-presencial'} className="boton-foro-presencial" href="">Foro Presencial</Link>
          </div>
        </div>
      </div>
      </div>
    )
  }
}

export default userConnector(BannerWelcome)
