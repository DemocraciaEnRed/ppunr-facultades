import React, { Component } from 'react'
import { Link, browserHistory } from 'react-router'
import moment from 'moment'
import userConnector from 'lib/site/connectors/user'

const estados = (state) => {
  switch (state) {
    case 'no-factible':
      return 'No factible'
      break
    case 'integrado':
      return 'Integrada'
      break
    case 'pendiente':
      return 'Pendiente'
      break
    default:
      return 'Factible'
      break
  }
}

export class TopicCard extends Component {
  handleWrapperClick = (e) => {
    // https://stackoverflow.com/questions/22119673/find-the-closest-ancestor-element-that-has-a-specific-class
    function findAncestor (el, cls) {
      while ((el = el.parentElement) && !el.classList.contains(cls));
      return el;
    }

    let targTag = e.target && e.target.tagName

    const isSeguirButton = findAncestor(e.target, 'cause-wrapper')
    const isProyectistaButton = findAncestor(e.target, 'proyectista-wrapper')

    if (!isSeguirButton && !isProyectistaButton)
      browserHistory.push(`/propuestas/topic/${this.props.topic.id}`)
  }
  render() {
    const { topic, onVote, onProyectista, user } = this.props
    const isStaff = !user.state.rejected && user.state.value.staff
    const isSistematizada = topic && topic.attrs && topic.attrs.state == 'sistematizada'
    const isProyectista = !user.state.rejected && topic.proyectistas && topic.proyectistas.length > 0 && topic.proyectistas.includes(user.state.value.id)

    const likesCssClass = topic.voted ? 'voted' : (
      topic.privileges && topic.privileges.canVote && !isStaff ? 'not-voted' : 'cant-vote'
    )
    const likesCountDiv = (
      <div className='participants'>
        <span className='icon-like' />
        &nbsp;
        {topic.action.count}
      </div>
    )

    const subscribeCssClass = 'not-subscribed'
    const subscribesCountDiv = (
      <div className='participants'>
        <span className='icon-arrow-right' />
      </div>
    )

    function capitalizeFirstLetter(str) {
      if (!str) return ''
      return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
    }

    return (
      <div className='ext-topic-card ideas-topic-card' onClick={this.handleWrapperClick}>
        <div className='topic-card-info'>
          <div className='topic-card-attrs'>
            {topic.eje &&
              <span className='badge badge-default'>{topic.eje.nombre}</span>
            }
          </div>

          {isSistematizada ?
            <div className='topic-creation'>
              <span>Creado por: <span className='topic-card-author'>PPUNR</span></span>
            </div>
            :
            <div className='topic-creation'>
              <span>Creado por: <span className='topic-card-author'>{topic.owner.firstName}</span></span>
              {topic.owner.facultad && topic.owner.claustro &&
                <span className='topic-card-facultad-claustro'>({topic.owner.facultad.abreviacion}, {topic.owner.claustro.nombre})</span>
              }
              {topic.owner.facultad && !topic.owner.claustro &&
              <span className='topic-card-facultad'>({topic.owner.facultad.abreviacion})</span>
              }
              {!topic.owner.facultad && topic.owner.claustro &&
                <span className='topic-card-claustro'>({topic.owner.claustro.nombre})</span>
              }
              {!topic.owner.facultad && topic.attrs && topic.attrs.facultad && topic.attrs.facultad != 'ninguna' &&
              <span className='topic-card-facultad'>
                ({this.props.facultades.length > 0 && this.props.facultades.find(f => f.value == topic.attrs.facultad).name})
              </span>
              }
              <span
                className={`date ${(topic.attrs.state !== 'pendiente') && 'space'}`}>
                {moment(topic.createdAt).format('D-M-YYYY')}
              </span>
            </div>
          }

          <h1 className='topic-card-title'>
            {topic.mediaTitle}
          </h1>
          <p className='topic-card-description'>
            {createClauses(topic)}
          </p>

        </div>

        <div className='topic-card-footer'>
          { topic.tags && topic.tags.length > 0 && (
              <div className='topic-card-tags'>
                <span className="glyphicon glyphicon-tag"></span>
                {topic.tags.slice(0, 12).map((tag, i) => (
                  <span
                    key={`${tag}-${i}`}
                    className='tag-wrapper' >
                    {capitalizeFirstLetter(tag)}
                  </span>
                ))}
              </div>
          ) }

          <div className='buttons-wrapper'>
            {!isSistematizada && /* antes en className estaba tmb ${likesCssClass} */
              <div className={`cause-wrapper`}>
                <div
                  className='btn btn-primary btn-empty'>
                  Seguidores
                  {likesCountDiv}
                </div>
              {/*topic.voted && (
                  <button
                    onClick={() => onVote(topic.id, topic.voted)}
                    className='btn btn-primary btn-filled'>
                    Ya seguís
                    {likesCountDiv}
                  </button>
                )}
              {!topic.voted && (
                  <button
                    disabled={!topic.privileges.canVote || isStaff}
                    onClick={() => onVote(topic.id, topic.voted)}
                    className='btn btn-primary btn-empty'>
                    Seguir
                    {likesCountDiv}
                  </button>
                )*/}
              </div>
            }
            {!isSistematizada &&
              <div
                className={`subscribe-wrapperr ${subscribeCssClass}`}
                onClick={this.handleWrapperClick}>
                <div
                  className='btn btn-primary btn-empty'>
                  Comentarios
                  {subscribesCountDiv}
                </div>
              </div>
            }
            {/*isSistematizada &&
              <div
                className='proyectista-wrapper'>
                <button
                  className={`btn btn-primary btn-${isProyectista ? 'empty' : 'filled'}`}
                  onClick={() => onProyectista(topic.id, !isProyectista)}
                  disabled={isProyectista}>
                  {isProyectista ? '¡Ya sos proyectista!' : '¡Quiero ser proyectista!'}
                </button>
              </div>
            */}
          </div>

        </div>
      </div>
    )
  }
}

function createClauses({ attrs, clauses }) {
  let div = document.createElement('div')
  let content
  if (!attrs) {
    content = clauses
      .sort(function (a, b) {
        return a.position > b.position ? 1 : -1
      })
      .map(function (clause) {
        return clause.markup
      })
      .join('')
  } else {
    const { problema } = attrs
    content = `${problema}`
  }
  div.innerHTML = content
  return div.textContent.replace(/\r?\n|\r/g, '').slice(0, 340) + '...'
}

export default userConnector(TopicCard)
