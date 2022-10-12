import React, { Component } from 'react'
import bus from 'bus'
import t from 't-component'
import urlBuilder from 'lib/url-builder'
import userConnector from 'lib/site/connectors/user'
import Header from './header/component'
import Content from './content/component'
import Footer from './footer/component'
import Social from './social/component'
import Vote from './vote/component'
import Poll from './poll/component'
import Cause from './cause/component'
import Comments from './comments/component'
import AdminActions from './admin-actions/component'
import Proyectos from 'ext/lib/site/proyectos/component'
import { Link } from 'react-router'
import VotarButton from 'ext/lib/site/home-propuestas/topic-card/votar-button/component'
// import VerTodosButton from 'ext/lib/site/home-propuestas/topic-card/ver-todos-button/component'
import config from 'lib/config'

class TopicArticle extends Component {
  constructor (props) {
    super(props)

    this.state = {
      showSidebar: false
    }
  }

  componentWillMount () {
    bus.on('sidebar:show', this.toggleSidebar)
  }

  componentDidUpdate () {
    document.body.scrollTop = 0
  }

  componentWillUnmount () {
    bus.off('sidebar:show', this.toggleSidebar)
  }

  toggleSidebar = (bool) => {
    this.setState({
      showSidebar: bool
    })
  }

  handleCreateTopic = () => {
    window.location = urlBuilder.for('admin.topics.create', {
      forum: this.props.forum.name
    })
  }

  handleBarrio = (barrio) => {
    const barrios = {
    }
    let barrioName = ''
    Object.keys(barrios).find((key) => {
      if (barrio === key) {
        barrioName = barrios[key]
      }
    })
    return barrioName
  }

  getEstado (name) {
    switch (name) {
      case 'pendiente':
        return 'pendiente'
        break
      case 'no-factible':
        return 'no factible'
        break
      case 'integrado':
        return 'integrada'
        break
      default:
        return 'factible'
        break
    }
  }

  twitText = () => {
    return encodeURIComponent('Sumate a elegir proyectos para la Universidad que queremos. ')
  }

  render () {
    const {
      topic,
      forum,
      user,
      onVote
    } = this.props

    const userAttrs = user.state.fulfilled && (user.state.value || {})
    const noUser = user.state.rejected
    const canCreateTopics = userAttrs.privileges &&
      userAttrs.privileges.canManage &&
      forum &&
      forum.privileges &&
      forum.privileges.canChangeTopics
    const isSistematizada = topic && topic.attrs && topic.attrs.state == 'sistematizada'
    const isIdeaProyecto = topic && topic.attrs && topic.attrs.state == 'idea-proyecto'
    const isProyecto = topic && topic.attrs && topic.attrs.state == 'proyecto'

    if (!topic) {
      return (
        <div className='no-topics'>
          <p>{t('homepage.no-topics')}</p>
          {
            canCreateTopics && (
              <button
                className='btn btn-primary'
                onClick={this.handleCreateTopic} >
                {t('homepage.create-debate')}
              </button>
            )
          }
        </div>
      )
    }

    const socialLinksUrl = window.location.origin + topic.url
    const twitterText = this.twitText()

    const editUrl = userAttrs.staff ?
      urlBuilder.for('admin.topics.id', {forum: forum.name, id: topic.id})
    :
      `/formulario-idea/${topic.id}`
    ;

    return (
      <div className='topic-article-wrapper'>
        {
          this.state.showSidebar &&
            <div onClick={hideSidebar} className='topic-overlay' />
        }
        <div className="banner">
          <Header
            closingAt={topic.closingAt}
            closed={topic.closed}
            author={null}
            authorUrl={null}
            tags={topic.tags}
            forumName={forum.name}
            mediaTitle={topic.mediaTitle}
            numero={topic.attrs && topic.attrs.numero} />
        </div>

        <div className='topic-article-content entry-content skeleton-propuesta'>
         <div className='topic-article-status-container'>
        {
          (forum.privileges && forum.privileges.canChangeTopics && config.propuestasAbiertas)
            ? (
              <div className='topic-article-content topic-admin-actions'>
                  <Link href={editUrl} className='btn btn-default btn-block btn-sm'>
                    <i className='icon-pencil' />
                    &nbsp;
                    Editar proyecto
                  </Link>
              </div>
            )
            : (topic.privileges && topic.privileges.canEdit && config.propuestasAbiertas) &&

               (
                 <div className='topic-article-content topic-admin-actions'>
                   <Link
                     href={editUrl}
                     className='btn btn-default btn-block btn-sm'>
                     <i className='icon-pencil' />
                      &nbsp;
                     Editar proyecto
                   </Link>
                 </div>
               )
              }
        </div>
          {/* { !isProyecto && <div className='topic-article-nombre'>Autor: {topic.owner.firstName}</div> }
          { isProyecto && <div className='topic-article-presupuesto'>Monto estimado: ${topic.attrs.presupuesto.toLocaleString()}</div> } */}
          { /* <h2 className='topic-article-subtitulo'>subtítulo de la propuesta</h2> */ }
          <div className="panel panel-default pre-info" style={{borderLeftColor: topic.tag.color }}>
            <div className="panel-body">
              {/* { !isProyecto && <div><b>Creado por</b><br />{topic.owner.firstName}</div> } */}
              <div><b>Tema</b><br /><div className="tema" style={{backgroundColor: topic.tag.color }}>{ topic.tag.name }</div></div>
              <div><b>Tipo</b><br />{ isProyecto ? 'Proyecto' : 'Idea' }</div>
              {isProyecto && <div><b>Monto estimado</b><br />${topic.attrs.presupuesto.toLocaleString()}</div>}
              </div>
          </div>
          {/* <span className='topic-article-span'>{isProyecto ? 'Proyecto' : 'Idea'}</span> */}
          {topic.attrs.problema &&
            <div
              className='topic-article-p'
              dangerouslySetInnerHTML={{
                __html: topic.attrs.problema.replace(/https?:\/\/[a-zA-Z0-9./]+/g, '<a href="$&" rel="noopener noreferer" target="_blank">$&</a>')
              }}>
            </div>
          }
        </div>
        <Social
          topic={topic}
          twitterText={twitterText}
          socialLinksUrl={socialLinksUrl} />
        {/*topic.attrs.state !== 'pendiente' && topic.attrs.state !== 'no-factible' && topic.attrs.state !== 'integrado' && (topic.attrs.anio === '2019' || topic.attrs.anio === '2020')  &&
          <div className='topic-article-content alert alert-success alert-proyecto' role='alert'>
            Podés ver el proyecto final presentado en la votación <Link to={`/proyectos/topic/${topic.id}`} className='alert-link'>aquí</Link>.
          </div>
        */}
        <div className='topic-actions topic-article-content'>
          { !noUser && !isProyecto && config.habilitarApoyo && <Cause
            topic={topic}
            canVoteAndComment={forum.privileges.canVoteAndComment} /> }
          {/* { !noUser && isProyecto && config.votacionAbierta &&
            <VotarButton topic={topic} onVote={onVote} />
          } */}
          {/* <VerTodosButton /> */}
          <Link href="/proyectos" className="btn btn-go">
            {/* Ver todas las ideas */}
            Ver todos los proyectos
          </Link>
        </div>
        {/* <div className='topic-tags topic-article-content'>
          {
            this.props.topic.tags && this.props.topic.tags.map((tag, i) => <span className='topic-article-tag' key={i}>{ tag } </span>)
          }
        </div> */}

        {/* { (topic.privileges && !topic.privileges.canEdit && user.state.value && topic.owner.id === user.state.value.id) &&
            (
              <p className='alert alert-info alert-propuesta'>
                El estado de ésta propuesta fue cambiado a {this.getEstado(topic.attrs.state)}, por lo tanto ya no puede ser editada por su autor/a.
              </p>
            )
        }
        {
          (topic.attrs['admin-comment'] && topic.attrs['admin-comment'] !== '') &&
            (
              <div className='alert alert-info alert-propuesta' role='alert'>
                <p>{topic.attrs['admin-comment']}</p>

                {topic.attrs['admin-comment-referencia'] && topic.attrs['admin-comment-referencia'] !== '' &&
                  <p className='admin-comment-referido'>Podés ver las ideas sistematizadas <a className='admin-comment-referido' href={topic.attrs['admin-comment-referencia']}>aquí</a>.</p>
                }
                <p className='font-weight-bold'>Equipo de Coordinación y Gestión PPUNR</p>
              </div>
            )
        } */}
        <div className={`topic-article-content ${!config.enableUploadPictures && 'hide'}`}>
          <div className='topic-article-album'>
            { ((forum.privileges && forum.privileges.canChangeTopics) || (topic.privileges && topic.privileges.canEdit)) &&
              <Link href={`/formulario-idea/${topic.id}/album`} className="btn btn-default btn-sm pull-right"><i className="icon-pencil"></i> Editar album</Link>
            }
            <h3>Albúm de imágenes</h3>
            <div className="row">
              {
              topic.extra && topic.extra.album && topic.extra.album.length > 0 && topic.extra.album.map((image, i) => (
                  <div className='col-md-4 col-sm-3 col-xs-6' key={i}>
                    <a href={image.url} target="_blank">
                      <img src={image.thumbnailUrl} className="img-responsive" style={{marginBottom: '20px'}} />
                    </a>
                  </div>
                // <div className="gallery-item" key={i}>
                //   <a href={image.url} target="_blank">
                //     <img src={image.thumbnailUrl} className="gallery-image" />
                //   </a>
                // </div>
                ))
              }
              {
                (!topic.extra || (topic.extra && !topic.extra.album) || (topic.extra && !topic.extra.album && topic.extra.album.length === 0)) && 
                <div className='col-md-12 col-xs-12 col-sm-12 '>
                  No hay fotos en este album
                </div>
              }
            </div>
          </div>
        </div>
        {
          !user.state.pending && !isSistematizada && !isIdeaProyecto && !isProyecto && <Comments forum={forum} topic={topic} />
        }
      </div>
    )
  }
}

export default userConnector(TopicArticle)

function hideSidebar () {
  bus.emit('sidebar:show', false)
}
