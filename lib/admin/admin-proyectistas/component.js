import React, { Component } from 'react'
import t from 't-component'
import 'whatwg-fetch'
import urlBuilder from 'lib/url-builder'
import { limit } from '../../api-v2/validate/schemas/pagination'

export default class AdminProyectistas extends Component {
  constructor (props) {
    super(props)

    this.state = {
      proyectistas: [],
      isLoading: true,
      limit: 10,
      responseSuccess: null,
      responseFail: null,
      isLoadingAddProyectista: false,
      inputEmail: '',
      inputDNI: '',
      addEmailDisabled: false,
      addDNIDisabled: false
    }

    this.addMore = this.addMore.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
  }

  componentDidMount () {
    this.getProyectistas()
  }

  getProyectistas = () => {
    window.fetch(`/api/proyectistas/all`, {
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
    .then(res => res.json())
    .then(res => {
      this.setState({
        proyectistas: res,
        isLoading: false
      })
    })
    .catch((err) => {
      console.log(err)
    })
  }

  handleChangeEmail = (event) => {
    this.setState({
      inputEmail: event.target.value,
      inputDNI: '',
      addDNIDisabled: true,
      addEmailDisabled: false
    })
    // clear #inputDNI
    document.getElementById('inputDNI').value = ''
  }
  
  handleChangeDNI = (event) => {
    this.setState({
      inputDNI: event.target.value,
      inputEmail: '',
      addDNIDisabled: false,
      addEmailDisabled: true
      
    })
    // clear #inputEmail
    document.getElementById('inputEmail').value = ''
  }

  handleSubmit = (event) => {
    event.preventDefault()
    let body
    if (this.state.inputDNI.length === 0 && this.state.inputEmail.length === 0) return;
    if (this.state.inputDNI.length > 0 && this.state.inputEmail.length > 0) return;
    if (this.state.inputDNI.length > 0 && this.state.inputEmail.length === 0)  {
      body = {
        dni: this.state.inputDNI
      }
    }
    if (this.state.inputDNI.length === 0 && this.state.inputEmail.length > 0)  {
      // validate its an email
      if (!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(this.state.inputEmail)) {
        this.setState({
          responseFail: 'El email está mal formado'
        })
        setTimeout(() => {
          this.setState({
            responseSuccess: null,
            responseFail: null
          })
        }, 5000)
        return
      }
      body = {
        email: this.state.inputEmail
      }
    }
    this.setState({
      isLoadingAddProyectista: true
    })
    window.fetch('/api/proyectistas/add', {
      method: 'POST',
      credentials: 'include',
      body: JSON.stringify(body),
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    })
    .then((response) => response.json())

    .then((response) => {
      switch (response.code) {
        case 'USER_NOT_FOUND':
        case 'ALREADY_PROYECTISTA':
          this.setState({
            responseSuccess: null,
            responseFail: response.message,
            isLoadingAddProyectista: false
          })
          break
        case 'OK':
          this.setState({
            responseSuccess: response.message,
            responseFail: null,
            isLoadingAddProyectista: false,
            addEmailDisabled: false,
            addDNIDisabled: false,
            isLoading: true,
            inputEmail: '',
            inputDNI: ''
          })
          document.getElementById('inputDNI').value = ''
          document.getElementById('inputEmail').value = ''
          this.getProyectistas()
          break
        default:
          break
      }
    })
    .catch((err) => {
      console.log(err)
      this.setState({
        responseSuccess: null,
        responseFail: `Error Interno...`,
        isLoadingAddProyectista: false,
        addEmailDisabled: false,
        addDNIDisabled: false,
        inputEmail: '',
        inputDNI: ''
      })
      // after 3 seconds, clear the message
    }).finally(() => {
      setTimeout(() => {
        this.setState({
          responseSuccess: null,
          responseFail: null
        })
      }, 5000)
    })
  }

  addMore () {
    this.setState({
      limit: this.state.limit+50
    })
  }

  render () {
    // const { forum } = this.props
    let { proyectistas, isLoading, limit, responseFail, responseSuccess, isLoadingAddProyectista, addEmailDisabled, addDNIDisabled } = this.state
    return (
      <div>
        <h2>Proyectistas</h2>
        <hr/>
        <p className='h3'>Descargar listado</p>
        <div className="clearfix">
          <div className="pull-left">
            <p>Descarge el listado de proyectistas en una planilla</p>
          </div>
          <div className="pull-right">
            <a href='/api/v2/proyectistas/all/csv'
              download
              className='btn btn-primary'>
              Descargar CSV    
            </a>
          </div>
        </div>
        <hr/>
        <p className='h3'>Agregar nuevo proyectista</p>
        <p><i className="glyphicon glyphicon-exclamation-sign text-danger"></i> <b className="text-danger">Importante:</b> El proyectista debe tener una cuenta en la plataforma</p>
        <div className="row">
          <div className="col-md-6">
            <div className="panel panel-default">
              <div className="panel-heading">
                Agregar por email
              </div>
              <div className="panel-body">
                <div className="form-group">
                  <input id="inputEmail" type="email" onChange={this.handleChangeEmail} className="form-control" placeholder="Ej: usuario@gmail.com"/>
                </div>
                <button type="button" onClick={this.handleSubmit} disabled={isLoadingAddProyectista || addEmailDisabled} className="btn btn-default pull-right"><i className="glyphicon glyphicon-plus"></i> Agregar por email</button>
              </div>
            </div>
          </div>
          <div className="col-md-6">
            <div className="panel panel-default">
              <div className="panel-heading">
                Agregar por DNI
              </div>
              <div className="panel-body">
                <div className="form-group">
                  <input id="inputDNI" type="text" onChange={this.handleChangeDNI} className="form-control" placeholder="33225588"/>
                </div>
                <button type="button" onClick={this.handleSubmit} disabled={isLoadingAddProyectista || addDNIDisabled} className="btn btn-default pull-right"><i className="glyphicon glyphicon-plus"></i> Agregar por DNI</button>
              </div>
            </div>
          </div>
        </div>
        {
          responseSuccess && (
            <div className="alert alert-success" role="alert">
              <b>Exito!</b> {responseSuccess}
            </div>
          )
        }
        {
          responseFail && (
            <div className="alert alert-danger" role="alert">
              <b>Error!</b> {responseFail}
            </div>
          )
        }
        <hr/>
        <p className='h3'>Listado de proyectistas ({isLoading ? 'Cargando...' : proyectistas.length})</p>
        <p><i className="glyphicon glyphicon-search"></i> <b>TIP</b>: Puede utilizar <b>Ctrl+F</b> para hacer busqueda por texto</p>
        <table className='table table-striped'>
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Email</th>
              <th>DNI</th>
              <th>Claustro</th>
              <th>Facultad</th>
            </tr>
          </thead>
          <tbody>
            {
              proyectistas.slice(0,limit).map((proyectista, i) => {
                return (
                  <tr key={i}>
                    <td>{proyectista.lastName}, {proyectista.firstName}</td>
                    <td>{proyectista.email}</td>
                    <td>{proyectista.dni}</td>
                    <td>{proyectista.claustro && proyectista.claustro.nombre}</td>
                    <td title={proyectista.facultad.nombre}>{proyectista.facultad && proyectista.facultad.abreviacion}</td>
                  </tr>
                )
              })
            }
            {
              (limit < proyectistas.length) && <tr>
                <td colSpan='5'><a onClick={this.addMore}>Mostrar 50 mas</a></td>
              </tr>
            }
            {
              isLoading && <tr>
                <td colSpan='5'>Cargando...</td>
              </tr>
            }
          </tbody>
        </table>
      </div>
    )
  }
}
