import React, { Component } from 'react'
import userConnector from 'lib/site/connectors/user'
import config from 'lib/config'

class VotarButton extends Component {
  constructor () {
    super()
    
    this.state = {
      openQuestion: false,
      disabled: false
    }
    this.handleVote = this.handleVote.bind(this)
  }

  handleVote = (topicId) => () => {
    this.setState({disabled: true})
    this.props.onVote(topicId, false)
  }

  render() {
    const { topic, onVote, user, voterInformation } = this.props
    let { openQuestion } = this.state

    const topicVoted = voterInformation.votes && voterInformation.votes.includes(topic.id)
    // si ya votó algo y no es este topic, no muestres botón
    if (voterInformation.votes && voterInformation.votes.length >= 3 && !topicVoted) return null

    if (topicVoted) openQuestion = false
    if (!voterInformation.dni) return <div></div>

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
                voterInformation.userLoggedIn ?
                  !topicVoted && (() => this.setState({openQuestion: true}, () => setTimeout(() => this.setState({openQuestion: false}), 10000)))
                :
                 () => window.location.href = `/signin?ref=${encodeURIComponent(window.location.pathname)}`
              }
              disabled={voterInformation.userLoggedIn && !voterInformation.dni}>
            {topicVoted ? <span><span className="glyphicon glyphicon-ok" />&nbsp;&nbsp;Votaste este proyecto</span> : 'Votar este proyecto'}
            </button>
          }
        { config.votacionAbierta && openQuestion &&
            <div>
              <span className='confirmas-voto'>{ this.state.disabled ? 'Enviando..' : '¿Confirmás tu voto?'}</span>
              <button
                className={`btn btn-primary btn-filled btn-si`}
                onClick={this.handleVote(topic.id)}
                disabled={this.state.disabled}>
                Sí
              </button>
              <button
                className={`btn btn-primary btn-filled`}
                onClick={() => this.setState({openQuestion: false})}
                disabled={this.state.disabled}>
                No
              </button>
            </div>
          }
        </div>
    )
  }
}

export default userConnector(VotarButton)
