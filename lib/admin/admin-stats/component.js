import React, { Component } from 'react'
import 'whatwg-fetch'
// import urlBuilder from 'lib/url-builder'
// import { limit } from '../../api-v2/validate/schemas/pagination'

export default class AdminStats extends Component {
  constructor (props) {
    super(props)
    this.state = {
      users: 0,
      userNotEmailValidated: 0,
      topics: 0,
      likes: 0,
      attendies: 0,
      comments: 0,
      replies: 0,
      isLoading: true
    }
  }

  componentDidMount () {
    this.getStats()
  }

  getStats = () => {
    window.fetch(`/api/stats`, {
      method: 'GET',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    })
    .then((res) => {
      if (res.status === 200) {
        return res
      }
    })
    .then((res) => res.json())
    .then((res) => {
      this.setState({
        users: res.stats.users,
        userNotEmailValidated: res.stats.userNotEmailValidated,
        topics: res.stats.topics,
        likes: res.stats.likes,
        attendies: res.stats.attendies,
        comments: res.stats.comments,
        replies: res.stats.replies,
        isLoading: false
      })
    })
    .catch((err) => {
      console.log(err)
    })
  }

  render () {

    // const { forum } = this.props
    let { users, userNotEmailValidated, topics, likes, attendies, comments, replies } = this.state
    return (
      <div>
        <h2>Stats</h2>
        <hr />
        <p className='h4'><i className="icon-book"></i> Usuarios</p>
        <table className='table table-bordered'>
          <tbody>
            <tr>
              <th>Registrados</th>
              <td className="text-center">{users}</td>
            </tr>
            <tr>
              <th>Registrados sin validar email</th>
              <td className="text-center">{userNotEmailValidated}</td>
            </tr>
            <tr>
              <th>Registrados validados</th>
              <td className="text-center">{users - userNotEmailValidated}</td>
            </tr>
          </tbody>
        </table>
        <p className='h4'><i className="icon-book"></i> Contenido</p>
        <table className='table table-bordered'>
          <tbody>
            <tr>
              <th>Proyectos</th>
              <td className="text-center">{topics}</td>
            </tr>
            <tr>
              <th>Me gusta</th>
              <td className="text-center">{likes}</td>
            </tr>
            <tr>
              <th>Comentarios</th>
              <td className="text-center">{comments}</td>
            </tr>
            <tr>
              <th>Respuestas en comentarios</th>
              <td className="text-center">{replies}</td>
            </tr>
          </tbody>
        </table>
        <p className='h4'><i className="icon-book"></i> Agenda</p>
        <table className='table table-bordered'>
          <tbody>
            <tr>
              <th>Asistentes a eventos</th>
              <td className="text-center">{attendies}</td>
            </tr>
          </tbody>
        </table>
      </div>
    )
  }
}
