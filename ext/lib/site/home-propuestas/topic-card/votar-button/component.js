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
    const userVoto = userLoggedIn && user.state.value && user.state.value.voto
    const userDNI = userLoggedIn && user.state.value.dni
    const topicVoted = userVoto && user.state.value.voto.includes(topic.id)

    // si ya votó algo y no es este topic, no muestres botón
    if (userVoto && userVoto.length >= 3 && !topicVoted) return null

    if (topicVoted) openQuestion = false

    return (
        <div
          className='votar-button-wrapper'>
          { !config.votacionAbierta && topicVoted &&
            <button className='btn btn-primary btn-voted'>
              Votaste este proyecto
            </button>
          }
          { config.votacionAbierta && !openQuestion &&
            <button
              className={`btn btn-primary btn-${topicVoted ? 'voted' : 'filled'}`}
              onClick={
                userLoggedIn ?
                  !topicVoted && (() => this.setState({openQuestion: true}))
                :
                 () => window.location.href = `/signin?ref=${encodeURIComponent(window.location.pathname)}`
              }
              disabled={userLoggedIn && !userDNI}>
            {topicVoted ? <span><span className="glyphicon glyphicon-ok" />&nbsp;&nbsp;Votaste este proyecto</span> : 'Votar este proyecto'}
            </button>
          }
        { config.votacionAbierta && openQuestion &&
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
