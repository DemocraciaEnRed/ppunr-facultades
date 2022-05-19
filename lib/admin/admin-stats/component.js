import React, { Component } from 'react'
import 'whatwg-fetch'
import moment from 'moment'
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
      emailsNotValidated: [],
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
        emailsNotValidated: res.stats.emailsNotValidated,
        isLoading: false
      })
    })
    .catch((err) => {
      console.log(err)
    })
  }

  render () {

    // const { forum } = this.props
    let { users, userNotEmailValidated, topics, likes, attendies, comments, replies, emailsNotValidated } = this.state
    return (
      <div>
        <h2>Stats</h2>
        <hr />
        <p className='h3'><i className="icon-bar-chart"></i> Usuarios</p>
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
        <p className='h3'><i className="icon-bar-chart"></i> Contenido</p>
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
        <p className='h3'><i className="icon-bar-chart"></i> Agenda</p>
        <table className='table table-bordered'>
          <tbody>
            <tr>
              <th>Asistentes a eventos</th>
              <td className="text-center">{attendies}</td>
            </tr>
          </tbody>
        </table>
        <p className='h3'><i className="icon-bar-chart"></i> Registros sin validar</p>
        <div className="clearfix">
          <div className="pull-left">
            <p>Descarge el listado de registros sin validar en una planilla</p>
          </div>
          <div className="pull-right">
            <a href='/api/v2/stats/registrosNoValidos/csv'
              download
              className='btn btn-primary'>
              Descargar CSV    
            </a>
          </div>
        </div>
        <br/>
        <table className='table table-bordered table-condensed' style={{ fontSize: '11px' }}>
          <thead>
            <tr>
              <th>Apellido, Nombre</th>
              <th>Email</th>
              <th>Claustro</th>
              <th>Facultad</th>
              <th>Fecha registro</th>
            </tr>
          </thead>
          <tbody>
            { emailsNotValidated.map( user => (
              <tr>
                <td>{user.lastName}, {user.firstName}</td>
                <td>{user.email}</td>
                <td>{user.claustro}</td>
                <td>{user.facultad}</td>
                <td>{moment(user.createdAt).format('YYYY-MM-DD HH:mm:ss')}</td>
              </tr>
            ))
            }
          </tbody>
        </table>
      </div>
    )
  }
}
