import React, { Component } from 'react'
import t from 't-component'
import 'whatwg-fetch'
import urlBuilder from 'lib/url-builder'
import { limit } from '../../api-v2/validate/schemas/pagination'
import moment from 'moment'

export default class BuscarDNI extends Component {
  constructor (props) {
    super(props)

    this.state = {
      inputDNI: '',
      result: null,
      showWarning: false,
      showSuccess: false,
      textWarning: '',
      textSuccess: ''
    }

    this.buscarDni = this.buscarDni.bind(this);
    this.closeNotifications = this.closeNotifications.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
  }

  componentDidMount () {

  }

  handleInputChange (e) {
    let data = {}
    data[e.target.name] = e.target.value
    this.setState(data)
  }

  closeWarnings () {
    this.setState({
      showWarning: false
    })
  }

  buscarDni (e) {
    e.preventDefault();
    let dni = this.state.inputDNI
    this.closeNotifications()
    // it should not be empty
    if (dni.length === 0) {
      this.setState({
        showWarning: true,
        textWarning: 'El DNI no puede estar vacio'
      })
      return
    }
    let aux = this.state.inputDNI
    window.fetch(`/api/padron/search/dni?dni=${this.state.inputDNI}&forum=${this.props.forum.name}`, {
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
      if (this.isEmpty(res)){
        this.setState({
          result: null,
          showWarning: true,
          textWarning: `No se encontro ningun usuario con el DNI ${aux}`
        })
        return
      }
      this.setState({
        result: res,
        showSuccess: true,
        textSuccess: `Se encontro el usuario con DNI ${aux}`
      })
    })
    .catch((err) => {
      console.log(err)
    })
  }

  // object is not empty
  isEmpty (obj) {
    for(var key in obj) {
      if(obj.hasOwnProperty(key))
        return false;
    }
    return true;
  }

  showUserData (user) {
    return (
      <div className="">
        <table className="table table-bordered">
          <tbody>
            <tr>
              <th>Nombre</th>
              <td>{user.lastName}, {user.firstName}</td>
            </tr>
            <tr>
              <th>DNI</th>
              <td>{user.dni}</td>
            </tr>
            <tr>
              <th>Email</th>
              <td>{user.email}</td>
            </tr>
            <tr>
              <th>Valido Email</th>
              <td>{user.emailValidated ? 'SI' : 'NO'}</td>
            </tr>
            <tr>
              <th>Claustro</th>
              <td>{this.getClaustro(user.claustro)}</td>
            </tr>
            <tr>
              <th>Fecha creacion</th>
              <td>{moment(user.createdAt).format('YYYY-MM-DD HH:mm')}</td>
            </tr>
            <tr>
              <th>ID</th>
              <td><small>{user._id}</small></td>
            </tr>
          </tbody>
        </table>
      </div>
    )
  }

  showFacultadData (user) {
    let facultad = this.props.facultades.find(f => f.value === user.facultad)
    if (facultad) {
      return (
        <div className="" key={`facultad-${facultad._id}`}>
          <table className="table table-bordered">
            <tbody>
              <tr>
                <th>Nombre</th>
                <td>{facultad.name}</td>
              </tr>
              <tr>
                <th>Abreviación</th>
                <td>{facultad.abreviacion}</td>
              </tr>
              <tr>
                <th>ID</th>
                <td><small>{facultad.value}</small></td>
              </tr>
            </tbody>
          </table>
        </div>
      )
    }
    return `Tiene asignado una facultad, pero no se ha encontrado... (Error? user.facultad = ${user.facultad})`
  }

  showVotesData (votes) {
    if (votes.length > 0) {
      return (
        <div>
          <p>Ha votado {votes.length} veces en los siguientes proyectos:</p>
          <ul>
            {votes.map((vote) => {
              return (
                <li key={`vote-${vote}`}><a href={`/propuestas/topic/${vote}`}>Voto</a></li>
              )
            })}
          </ul>
        </div>
      )
    }
    return `No ha votado ningun proyecto`
  }

  getClaustro (idClaustro) {
    let claustro = this.props.claustros.find((claustro) => {
      return claustro.value === idClaustro
    })
    if (claustro) {
      return claustro.name
    }
    return ''
  }

  closeNotifications () {
    this.setState({
      showWarning: false,
      showSuccess: false,
      textWarning: '',
      textSuccess: ''
    })
  }

  render () {
    const { forum, escuelas, claustros } = this.props
    // let { proyectistas } = this.state
    return (
      <div id="buscar-dni-component">
        <p className='h3'><i className="icon-search"></i> Busqueda por DNI</p>
        <p>Puede buscar si el DNI está en el padrón, y si existe un usuario ya registrado con ese DNI, sus datos aparecerán.</p>
        <div className='panel panel-default'>
          <div className='panel-body'>
            {
              this.state.showWarning &&
              <div className='alert alert-warning alert-dismissible' role='alert'>
                <button type='button' onClick={this.closeNotifications} className='close' data-dismiss='alert' aria-label='Close'><span aria-hidden='true'>&times;</span></button>
                { this.state.textWarning }
              </div>
            }
            <div className='form-group'>
              <label htmlFor=''>DNI a buscar</label>
              <input type='text' name="inputDNI" onChange={this.handleInputChange} className='form-control' id='' placeholder='DNI' />
            </div>
            <div className='form-group pull-right'>
              <button type='button' onClick={this.buscarDni} className='btn btn-primary'>Buscar</button>
            </div>
          </div>
        </div>
        {
          this.state.showSuccess &&
          <div className='alert alert-success alert-dismissible' role='alert'>
            <button type='button' onClick={this.closeNotifications} className='close' data-dismiss='alert' aria-label='Close'><span aria-hidden='true'>&times;</span></button>
            { this.state.textSuccess }
          </div>
        }
        { this.state.result &&

          <div className="row">
            {
              this.state.result.user &&
              <div className="col-md-6">
                <p className='h4'><b>Facultad</b></p>
                {
                  this.state.result.user && this.state.result.user.facultad && this.showFacultadData(this.state.result.user)
                }
                {
                  this.state.result.user && !this.state.result.user.facultad && <p>El usuario no tiene una facultad asignada... (Error?)</p>
                }
              </div>
            }
            { this.state.result.user ? 
              (
              <div className="col-md-6">
                <p className='h4'><b>Usuario</b></p>
                <div className=''>
                  {this.showUserData(this.state.result.user)}
                </div>
              </div>
              ) : (
                <div className="col-md-6">
                  <p className='h4'><b>Usuario</b></p>
                  <div className=''>
                    No existe un usuario registrado con este DNI
                  </div>
                </div>
              )
            }
            { this.state.result.user && this.state.result.votes ?
              (
              <div className="col-md-6">
                <p className='h4'><b>Votos</b></p>
                <div className=''>
                  {this.showVotesData(this.state.result.votes)}
                </div>
              </div>
              ) : (
                <div className="col-md-6">
                  <p className='h4'><b>Votos</b></p>
                  <div className=''>
                      No hay votos registrados
                  </div>
                </div>
              )
            }
          </div>
        }
      </div>
    )
  }
}
