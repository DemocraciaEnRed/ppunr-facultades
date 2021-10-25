import React, { Component } from 'react'
import userConnector from 'lib/site/connectors/user'

class VerTodosButton extends Component {

  render() {
    return (
        <div
          className='votar-button-wrapper'>
            <button
              className="btn btn-empty"
              onClick={() => window.location.href = `/propuestas`
              }>
                Ver todos los proyectos
              </button>
        </div>
    )
  }
}

export default userConnector(VerTodosButton)
