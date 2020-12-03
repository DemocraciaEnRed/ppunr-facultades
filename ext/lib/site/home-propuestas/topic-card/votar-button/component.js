import React, { Component } from 'react'
import userConnector from 'lib/site/connectors/user'
import config from 'lib/config'

class VotarButton extends Component {
  state = {
    openQuestion: false
  }

  render() {
    const { topic, onVote, user } = this.props
    let { openQuestion } = this.state

    const userLoggedIn = user.state && user.state.fulfilled
    const userVoto = user.state && user.state.value && user.state.value.voto
    const topicVoted = userVoto && userVoto == topic.id

    // si ya votó algo y no es este topic, no muestres botón
    if (userVoto && !topicVoted) return null

    if (topicVoted) openQuestion = false

    return (
        <div
          className='votar-button-wrapper'>
          { !config.propuestasAbiertas && topicVoted &&
            <button className='btn btn-primary btn-voted'>
              Votaste este proyecto
            </button>
          }
          { config.propuestasAbiertas && !openQuestion &&
            <button
              className={`btn btn-primary btn-${topicVoted ? 'voted' : 'filled'}`}
              onClick={
                userLoggedIn ?
                  !topicVoted && (() => this.setState({openQuestion: true}))
                :
                 () => window.location.href = `/signin?ref=${encodeURIComponent(window.location.pathname + window.location.search)}`
              }>
              {topicVoted ? 'Votaste este proyecto' : 'Votar este proyecto'}
            </button>
          }
          { config.propuestasAbiertas && openQuestion &&
            <div>
              <span className='confirmas-voto'>¿Confirmás tu voto?</span>
              <button
                className={`btn btn-primary btn-filled btn-si`}
                onClick={() => onVote(topic.id, false)}>
                Sí
              </button>
              <button
                className={`btn btn-primary btn-filled`}
                onClick={() => this.setState({openQuestion: false})}>
                No
              </button>
            </div>
          }
        </div>
    )
  }
}

export default userConnector(VotarButton)
