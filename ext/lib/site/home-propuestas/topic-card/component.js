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
    let targTag = e.target && e.target.tagName
    // si hace click en cualquier lugar que no sea un botón o un link mandar a propuesta
    if (targTag != 'BUTTON' && targTag != 'A')
      browserHistory.push(`/propuestas/topic/${this.props.topic.id}`)
  }
  render() {
    const { topic, onVote, user } = this.props
    const isStaff = !user.state.rejected && user.state.value.staff

    const likesCssClass = topic.voted ? 'voted' : (
      topic.privileges.canVote && !isStaff ? 'not-voted' : 'cant-vote'
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
            <span
              className={`date ${(topic.attrs.state !== 'pendiente') && 'space'}`}>
              {moment(topic.createdAt).format('D-M-YYYY')}
            </span>
          </div>

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
            <div className={`cause-wrapper ${likesCssClass}`}>
              {topic.voted && (
                <button disabled className='btn btn-primary btn-filled'>
                  Ya seguís
                  {likesCountDiv}
                </button>
              )}
              {!topic.voted && (
                <button
                  disabled={!topic.privileges.canVote || isStaff}
                  onClick={() => onVote(topic.id)}
                  className='btn btn-primary btn-empty'>
                  Seguir
                  {likesCountDiv}
                </button>
              )}
            </div>

            <div
              className={`subscribe-wrapperr ${subscribeCssClass}`}
              onClick={this.handleWrapperClick}>
              <div
                className='btn btn-primary btn-empty'>
                Comentar
                {subscribesCountDiv}
              </div>
            </div>
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
