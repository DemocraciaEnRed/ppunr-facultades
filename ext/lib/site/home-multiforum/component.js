import React, { Component } from 'react'
import {Link} from 'react-router'
import config from 'lib/config'
import Anchor from 'ext/lib/site/anchor'
import BannerForoVecinal from 'ext/lib/site/banner-foro-vecinal/component'
import BannerWelcome from 'ext/lib/site/banner-welcome/component'
import ThumbsVoto from 'ext/lib/site/thumbs-voto/component'
// import Barrios from 'ext/lib/site/barrios/component'
import Jump from 'ext/lib/site/jump-button/component'
import Footer from 'ext/lib/site/footer/component'
// import forumStore from 'lib/stores/forum-store/forum-store'
// import topicStore from 'lib/stores/topic-store/topic-store'
import textStore from 'lib/stores/text-store'
import forumStore from 'lib/stores/forum-store/forum-store'

import TypeformButton from './typeform'

export default class HomeMultiforumOverride extends Component {
  constructor (props) {
    super(props)

    this.state = {
      texts: {},
      forum:{config:{}},
    }
  }

  componentWillMount () {
    Promise.all([
      textStore.findAllDict(),
      forumStore.findOneByName('proyectos')
    ])
    .then((results) => {
      const [textsDict, forum] = results

      this.setState({
        texts: textsDict,
        forum
      })
    }).catch((err) => {
      this.state = {
        texts: {},
        forum:null
      }
    })
  }

  componentDidMount () {
    this.goTop()
  }

  goTop () {
    Anchor.goTo('container')
  }

  render () {
    return (
      <div className='ext-home-multiforum'>
        <Anchor id='container'>
          <BannerForoVecinal title="Presupuesto participativo - Facultades" texts={this.state.texts} />
          <ThumbsVoto texts={this.state.texts} forumConfig={this.state.forum.config} />
          {/* <div className="banner-ideas">
            <img src="/ext/lib/site/home-multiforum/icon-idea.svg" alt="Ideas"/>
            <p>Conocé <strong>los proyectos </strong>que podés votar para que sean realidad en el 2022. <strong>¡Elegí hasta tres proyectos y votá!</strong>. Podés conocerlas aquí.</p>
            <Link to={'/propuestas'} className="boton-foro" href="">Ir a UNR DECIDE</Link>
          </div> */}
          {/* <Barrios /> */}
          <BannerWelcome forumConfig={this.state.forum.config} />
          <Jump goTop={this.goTop} />
          <Footer />
        </Anchor>
      </div>
    )
  }
}
