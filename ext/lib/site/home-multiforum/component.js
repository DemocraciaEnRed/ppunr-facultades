import React, { Component } from 'react'
import {Link} from 'react-router'
import config from 'lib/config'
import Anchor from 'ext/lib/site/anchor'
import BannerForoVecinal from 'ext/lib/site/banner-foro-vecinal/component'
import ThumbsVoto from 'ext/lib/site/thumbs-voto/component'
// import Barrios from 'ext/lib/site/barrios/component'
// import Proyectos from 'ext/lib/site/proyectos/component'
// import ProyectosFactibles from 'ext/lib/site/proyectosFactibles/component'
// import ProyectosGanadores from 'ext/lib/site/proyectosGanadores/component'
import Jump from 'ext/lib/site/jump-button/component'
import Footer from 'ext/lib/site/footer/component'
// import forumStore from 'lib/stores/forum-store/forum-store'
// import topicStore from 'lib/stores/topic-store/topic-store'
import textStore from 'lib/stores/text-store'
import escuelaStore from 'lib/stores/escuela-store'

export default class HomeMultiforumOverride extends Component {
  constructor (props) {
    super(props)

    this.state = {
      texts: {},
      escuelas: []
    }
  }

  componentWillMount () {
    textStore.findAllDict().then((textsDict) => {
      this.setState({
        texts: textsDict
      })
    }).catch((err) => {
      this.state = {
        texts: {}
      }
    })
  }

  componentDidMount () {
    this.goTop()
    escuelaStore.findAll().then(escuelas => this.setState({escuelas}))

  }

  goTop () {
    Anchor.goTo('container')
  }

  render () {
    return (
      <div className='ext-home-multiforum'>
        <Anchor id='container'>
          <BannerForoVecinal title="Presupuesto participativo - Escuelas" texts={this.state.texts} />
          <ThumbsVoto texts={this.state.texts} />
          <div className="banner-escuelas">
            <h4>Elegí tu proyecto favorito</h4>
            {this.state.escuelas.length > 0 && this.state.escuelas.map(escuela => (
              <div
              key={escuela._id}
              className={`bloque-escuela bloque-escuela-${escuela.abreviacion}`}>
                <p>Conocé los proyectos de {escuela.abreviacion == 'IPS' ? 'el' : 'la'} <b>{escuela.tituloForo}</b></p>
                <a className="foro-escuela-link"
                 href={`/propuestas?id=${escuela._id}`}>
                  <span className="glyphicon glyphicon-menu-right"></span>
                  Accedé a<br />
                  <span>{escuela.abreviacion == 'EAC' ? 'LA' : 'EL'} {escuela.abreviacion == 'ESUPCOM' ? 'Superior' : escuela.nombre} ELIGE</span>
                </a>
              </div>
            ))}
          </div>
          {/* <Proyectos /> */}
          {/* <ProyectosFactibles /> */}
          {/* <ProyectosGanadores /> */}
          {/* <Barrios /> */}
          <Jump goTop={this.goTop} />
          <Footer />
        </Anchor>
      </div>
    )
  }
}
