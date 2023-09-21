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
      isLoading: true,
      isLoadingVotacion: true,
      votesCount: 0,
      dniCount: 0,
      usersWhoDidntVotedCount: 0,
      votosPresencial: 0,
      votosOnline: 0,
      facultades: {},
      claustros: {},
      errorVotacion: false,
      errorGeneral: false,
      showFakeDeleteVotes: true,
      showTrueDeleteVotes: false
    }
  }

  componentDidMount () {
    this.getStats()
    this.getStatsVotacion()
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

  getStatsVotacion = () => {
    window.fetch(`/api/stats/votacion`, {
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
        votesCount: res.stats.votesCount,
        dniCount: res.stats.dniCount,
        usersWhoDidntVotedCount: res.stats.usersWhoDidntVotedCount,
        votosPresencial: res.stats.votosPresencial,
        votosOnline: res.stats.votosOnline,
        facultades: res.stats.facultades,
        claustros: res.stats.claustros,
        isLoadingVotacion: false
      })
    })
    .catch((err) => {
      console.log(err)
    })
  }

  preDeleteVotes = () => {
    this.setState({
      isLoadingVotacion: true,
      isLoading: true
    })
    this.deleteVotes()
  }


  deleteVotes = () => {
    window.fetch(`/api/padron/votes/clean`, {
      method: 'DELETE',
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
      this.getStats()
      this.getStatsVotacion()
    })
    .catch((err) => {
      console.log(err)
    })
  }

  render () {

    // const { forum } = this.props
    let { users, userNotEmailValidated, topics, likes, attendies, comments,
      replies, emailsNotValidated, votesCount, dniCount, isLoading,
      usersWhoDidntVotedCount, isLoadingVotacion, votosOnline, facultades, claustros,
      votosPresencial, showFakeDeleteVotes, showTrueDeleteVotes } = this.state

    let facultadesRows = () => {
      let rows = []
      rows.push(
        <tr>
          <td>-- Votos por facultades...</td>
          <td className="text-center">-</td>
        </tr>
      )
      for (let facultad in facultades) {
        rows.push(
          <tr key={`escuela-${facultad}`}>
            <th>Personas de {facultad} que votaron</th>
            <td className="text-center">{facultades[facultad]}</td>
          </tr>
        )
      }
      return rows
    }

    let claustrosRows = () => {
      let rows = []
      rows.push(
        <tr>
          <td>-- Votos por claustro...</td>
          <td className="text-center">-</td>
        </tr>
      )
      for (let claustro in claustros) {
        rows.push(
          <tr key={`claustro-${claustro}`}>
            <th>Personas "{claustro}" que votaron</th>
            <td className="text-center">{claustros[claustro]}</td>
          </tr>
        )
      }
      return rows
    }

    return (
      <div>
        <h2>Stats</h2>
        <hr />
        <p className='h3'><i className="icon-bar-chart"></i> Usuarios {isLoading && <span className="text-info">(Cargando)</span>}</p>
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
        <p className='h3'><i className="icon-bar-chart"></i> Contenido {isLoading && <span className="text-info">(Cargando)</span>}</p>
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
        <p className='h3'><i className="icon-bar-chart"></i> Agenda {isLoading && <span className="text-info">(Cargando)</span>}</p>
        <table className='table table-bordered'>
          <tbody>
            <tr>
              <th>Asistentes a eventos</th>
              <td className="text-center">{attendies}</td>
            </tr>
          </tbody>
        </table>
        <p className='h3'><i className="icon-bar-chart"></i> Votación {isLoadingVotacion && <span className="text-info">(Cargando)</span>}</p>
        {this.state.errorVotacion ? <p className='text-danger'>Error al obtener los datos de la votación</p> : null}
        <table className='table table-bordered'>
          <tbody>
            <tr>
              <th>Votos en total<br></br><small style={{fontWeight: 300}}>Sin agrupar por DNI</small></th>
              { isLoadingVotacion ? <td className="text-center">Cargando...</td> :
               <td className="text-center">{votesCount}</td> }
            </tr>
            <tr>
              <th>Personas que votaron online</th>
              { isLoadingVotacion ? <td className="text-center">Cargando...</td> :
               <td className="text-center">{votosOnline}</td> }
            </tr>
            <tr>
              <th>Personas que votaron presencial</th>
              { isLoadingVotacion ? <td className="text-center">Cargando...</td> :
               <td className="text-center">{votosPresencial}</td> }
            </tr>
            <tr>
              <th>Personas que votaron en total<br></br><small style={{fontWeight: 300}}>Se desprende de la cantidad de DNIs unicos.<br></br>Cuentan personas no registradas, y personas registradas (usuarios del sistema)</small></th>
              { isLoadingVotacion ? <td className="text-center">Cargando...</td> :
               <td className="text-center">{dniCount}</td> }
            </tr>
            <tr>
              <th>Personas NO REGISTRADAS que al menos cuentan con un voto<br></br><small style={{fontWeight: 300}}>Nota: Se puede asumir que hayan votado presencialmente</small></th>
              { isLoadingVotacion ? <td className="text-center">Cargando...</td> :
               <td className="text-center">{usersWhoDidntVotedCount > 0 ? (dniCount - (users - usersWhoDidntVotedCount)) : 0}</td> }
            </tr>
            <tr>
              <th>Usuarios (Personas REGISTRADAS) que al menos cuentan con un voto<br></br><small style={{fontWeight: 300}}>Nota: Solamente de los usuarios registrados (Validados y no validados)</small></th>
              { isLoadingVotacion ? <td className="text-center">Cargando...</td> :
               <td className="text-center">{usersWhoDidntVotedCount > 0 ? (users - usersWhoDidntVotedCount) : 0}</td> }
            </tr>
            <tr>
              <th>Usuarios (Personas REGISTRADAS) que no votaron<br></br><small style={{fontWeight: 300}}>Nota: Solamente de los usuarios registrados (Validados y no validados)</small></th>
              { isLoadingVotacion ? <td className="text-center">Cargando...</td> :
               <td className="text-center">{usersWhoDidntVotedCount}</td> }
            </tr>
            { facultadesRows() }
            { claustrosRows() }
          </tbody>
        </table>
        <div className="clearfix">
          <div className="pull-left">
            <p>Descargar listado de usuarios (registrados) que NO votaron</p>
          </div>
          <div className="pull-right">
            <a href='/api/v2/stats/usuariosQueNoVotaron/csv'
              download
              className='btn btn-primary'>
              Descargar CSV    
            </a>
          </div>
        </div>
        <div className="clearfix">
          <div className="pull-left">
            <p>Descargar listado de votos por votante (agrupados por DNI)</p>
          </div>
          <div className="pull-right">
            <a href='/api/v2/stats/listadoDeVotosPorVotante/csv'
              download
              className='btn btn-primary'>
              Descargar CSV    
            </a>
          </div>
        </div>
        <div className="clearfix">
          <div className="pull-left">
            <p>Descargar listado de votos (No agrupados por DNI)</p>
          </div>
          <div className="pull-right">
            <a href='/api/v2/stats/listadoDeVotos/csv'
              download
              className='btn btn-primary'>
              Descargar CSV    
            </a>
          </div>
        </div>
        <div className="clearfix">
          <div className="pull-left">
            <p>Descargar listado total de votos por proyecto</p>
          </div>
          <div className="pull-right">
            <a href='/api/v2/stats/votosPorProyectos/csv'
              download
              className='btn btn-primary'>
              Descargar CSV    
            </a>
          </div>
        </div>
        {/* DANGER ZONE: Limpiar votos */}
        <div className="alert alert-danger" role="alert">
          <div className="clearfix">
            <div className="pull-left">
              <p><b>Borrar todos los votos</b><br/>Para limpiar la base de datos de votos, haga clic y confirme la acción</p>
            </div>
            {
              showFakeDeleteVotes && <div className="pull-right">
                <button className='btn btn-danger' onClick={() => { this.setState({ showFakeDeleteVotes: false, showTrueDeleteVotes: true }) }}>
                  Limpiar votos    
                </button>
              </div>
            }
            {
              showTrueDeleteVotes  && <div className="pull-right text-right">
                <p><b>¿Está seguro?</b></p>
                <div className="btn-group">
                  <button className='btn' onClick={() => { this.setState({ showFakeDeleteVotes: true, showTrueDeleteVotes: false }) }}>
                    Cancelar    
                  </button>
                  <button className='btn btn-danger' onClick={this.preDeleteVotes}>
                    Confirmar   
                  </button>
                </div>
              </div>
            }
          </div>
        </div>
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
