import React, { Component } from 'react'
import 'whatwg-fetch'
// import urlBuilder from 'lib/url-builder'
// import { limit } from '../../api-v2/validate/schemas/pagination'

export default class AdminAgenda extends Component {
  constructor (props) {
    super(props)
    
    this.state = {
      agenda: [],
      futureEvents: [],
      pastEvents: [],
      isLoading: true,
      isSending: false,
      previousDay: null,
      responseFail: null,
      responseSuccess: null,
      isFirefox: false
    }
    this.monthOnChange = this.monthOnChange.bind(this)
    this.yearOnChange = this.yearOnChange.bind(this)
    this.dayOnChange = this.dayOnChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
    this.handleAttendList = this.handleAttendList.bind(this)
  }

  componentDidMount () {
    this.getAgenda()
    var monthSelect = document.getElementById('selectMonth')
    this.populateDays(monthSelect.value)
    this.populateYears()
    this.setState({
      isFirefox: navigator.userAgent.toLowerCase().indexOf('firefox') > -1
    })
  }

  getAgenda = () => {
    window.fetch(`/api/agenda/all`, {
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
      let today = new Date()
      let futureEvents = res.filter((item) => {
        let date = new Date(item.datetime)
        return date > today
      })
      let pastEvents = res.filter((item) => {
        let date = new Date(item.datetime)
        return date < today
      })
      this.setState({
        agenda: res,
        futureEvents: futureEvents,
        pastEvents: pastEvents,
        isLoading: false
      })
    })
    .catch((err) => {
      console.log(err)
    })
  }

  handleSubmit = (event) => {
    event.preventDefault()
    // get all the values from the inputs and selects
    var nombre = document.getElementById('inputNombre').value
    var lugar = document.getElementById('inputLugar').value
    // var descripcion = document.getElementById('inputDescripcion').value
    var monthSelect = document.getElementById('selectMonth')
    var monthValue = this.monthNameToNumber(monthSelect.value) 
    var yearSelect = document.getElementById('selectYear')
    var daySelect = document.getElementById('selectDay')
    var dayValue = this.pad(daySelect.value, 2)
    var hourSelect = document.getElementById('selectHour')
    // validate inputs are not empty
    if (nombre === '' || lugar === '' || monthValue === null || yearSelect.value === '' || daySelect.value === '' || hourSelect.value === '') {
      alert('Todos los campos son obligatorios')
      return 
    }
    // create datetime object
    var datetime = new Date(`${yearSelect.value}-${monthValue}-${dayValue}, ${hourSelect.value}:00`)
    this.setState({
      isSending: true
    })
    var agenda = {
      nombre,
      lugar,
      // descripcion,
      fecha: `${yearSelect.value}-${monthValue}-${dayValue}`,
      dia: dayValue,
      mes: monthSelect.value,
      ano: yearSelect.value,
      hora: hourSelect.value,
      datetime
    }
    window.fetch(`/api/agenda/add`, {
      method: 'POST',
      credentials: 'include',
      body: JSON.stringify(agenda),
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
        responseSuccess: 'Se agrego el evento de forma correcta',
        isSending: false,
        isLoading: true
      }, this.getAgenda)
    })
    .catch((err) => {
      console.log(err)
      this.setState({
        responseFail: 'Ocurrio un error...',
        isSending: false
      })
    })
  }

  handleAttendList = (agendaId) => {
    window.fetch('/api/agenda/assist', {
      method: 'POST',
      credentials: 'include',
      body: JSON.stringify({
        id: agendaId
      }),
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    })
    .then((res) => {
      if (res.status === 200) {
        alert('success!')
        return res
      }
    })
    .catch((err) => {
      console.log(err)
    })
  }

  handleDeleteEvent = (agendaId) => {
    window.fetch('/api/agenda/delete', {
      method: 'DELETE',
      credentials: 'include',
      body: JSON.stringify({
        id: agendaId
      }),
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    })
    .then((res) => {
      this.setState({
        responseSuccess: 'Se elimino el evento de forma correcta',
        isSending: false,
        isLoading: true
      }, this.getAgenda)
    })
    .catch((err) => {
      console.log(err)
      this.setState({
        responseFail: 'Ocurrio un error...',
        isSending: false
      })
    })
    .catch((err) => {
      console.log(err)
    })
  }

  pad (num, size) {
    num = num.toString()
    while (num.length < size) num = '0' + num
    return num
  }

  monthNameToNumber (monthName) {
    switch (monthName.toLowerCase()) {
      case 'enero':
        return '01'
      case 'febrero':
        return '02'
      case 'marzo':
        return '03'
      case 'abril':
        return '04'
      case 'mayo':
        return '05'
      case 'junio':
        return '06'
      case 'julio':
        return '07'
      case 'agosto':
        return '08'
      case 'septiembre':
        return '09'
      case 'octubre':
        return '10'
      case 'noviembre':
        return '11'
      case 'diciembre':
        return '12'
      default:
        return null
    }
  }

  populateDays = () => {
    var monthSelect = document.getElementById('selectMonth')
    var month = monthSelect.value
    var yearSelect = document.getElementById('selectYear')
    var daySelect = document.getElementById('selectDay')
    // delete the current set of <option> elements out of the
    // day <select>, ready for the next set to be injected
    while (daySelect.firstChild) {
      daySelect.removeChild(daySelect.firstChild)
    }
    // Create variable to hold new number of days to inject
    var dayNum
    // 31 or 30 days?
    if (month === 'Enero' | month === 'Marzo' | month === 'Mayo' | month === 'Julio' | month === 'Agosto' | month === 'Octubre' | month === 'Diciembre') {
      dayNum = 31
    } else if (month === 'Abril' | month === 'Junio' | month === 'Septiembre' | month === 'Noviembre') {
      dayNum = 30
    } else {
      // If month is February, calculate whether it is a leap year or not
      var year = yearSelect.value
      var isLeap = new Date(year, 1, 29).getMonth() == 1
      dayNum = isLeap ? 29 : 28
    }
    // inject the right number of new <option> elements into the day <select>
    for (var i = 1; i <= dayNum; i++) {
      var option = document.createElement('option')
      option.textContent = i
      daySelect.appendChild(option)
    }
    // if previous day has already been set, set daySelect's value
    // to that day, to avoid the day jumping back to 1 when you
    // change the year
    if (this.state.previousDay) {
      daySelect.value = this.state.previousDay

      // If the previous day was set to a high number, say 31, and then
      // you chose a month with less total days in it (e.g. February),
      // this part of the code ensures that the highest day available
      // is selected, rather than showing a blank daySelect
      if (daySelect.value === '') {
        daySelect.value = this.state.previousDay - 1
      }

      if (daySelect.value === '') {
        daySelect.value = this.state.previousDay - 2
      }

      if (daySelect.value === '') {
        daySelect.value = this.state.previousDay - 3
      }
    }
  }

  populateYears = () => {
    // get this year as a number
    var date = new Date()
    var year = date.getFullYear()
    // Make this year, and the 10 years before and after it available in the year <select>
    for (var i = -5; i <= 5; i++) {
      var option = document.createElement('option')
      option.textContent = year - i
      var yearSelect = document.getElementById('selectYear')
      yearSelect.appendChild(option)
    }
    var yearSelect = document.getElementById('selectYear')
    yearSelect.value = year
  }

  monthOnChange = (e) => {
    this.populateDays()
  }

  yearOnChange = (e) => {
    this.populateDays()
  }

  dayOnChange = (e) => {
    var daySelect = document.getElementById('selectDay')
    this.setState({
      previousDay: daySelect.value
    })
  }

  render () {

    let agendaForm = (
      <div className='panel panel-primary'>
        <div className='panel-heading'>
          Agregar nuevo evento
        </div>
        <div className='panel-body'>
          <div className='form-group'>
            <label htmlFor='inputNombre'>Nombre</label>
            <input id='inputNombre' disabled={isSending} type='text' className='form-control input-lg' placeholder='Ej: FORO SIBERIA' />
          </div>
          <div className='row'>
            <div className='col-md-3'>
              <div className='form-group'>
                <label htmlFor='selectDay'>Dia</label>
                <select id='selectDay' disabled={isSending} onChange={this.dayOnChange} className='form-control' name='day' />
              </div>
            </div>
            <div className='col-md-3'>
              <div className='form-group'>
                <label htmlFor='selectMonth'>Mes</label>
                <select id='selectMonth' disabled={isSending} onChange={this.monthOnChange} className='form-control' name='month'>
                  <option>Enero</option>
                  <option>Febrero</option>
                  <option>Marzo</option>
                  <option>Abril</option>
                  <option>Mayo</option>
                  <option>Junio</option>
                  <option>Julio</option>
                  <option>Agosto</option>
                  <option>Septiembre</option>
                  <option>Octubre</option>
                  <option>Noviembre</option>
                  <option>Diciembre</option>
                </select>
              </div>
            </div>
            <div className='col-md-3'>
              <div className='form-group'>
                <label htmlFor='selectYear'>Año</label>
                <select id='selectYear' disabled={isSending} onChange={this.yearOnChange} className='form-control' name='year' />
              </div>
            </div>
            <div className='col-md-3'>
              <div className='form-group'>
                <label htmlFor='selectHour'>Hora</label>
                <input type='time' id='selectHour' disabled={isSending} onChange={this.yearOnChange} className='form-control' name='hour' />
              </div>
            </div>
          </div>
          <div className='form-group'>
            <label htmlFor='inputLugar'>Lugar</label>
            <input id='inputLugar' type='text' disabled={isSending} className='form-control' placeholder='Ej: Universidad Nacional de Rosario, Maipu 1065' />
          </div>
          {/* <div className='form-group'>
            <label htmlFor='inputDescripcion'>Descripción (Opcional)</label>
            <textarea id='inputDescripcion' type='text' disabled={isSending} className='form-control' placeholder='(Opcional) Escriba aquí' />
          </div> */}
          <div className='form-group'>
            <p>Una vez creado, el evento se publicará y los usuarios podran subscribirse al mismo.</p>
          </div>
          <div className='form-group'>
            { isSending ? <button type='button' disabled className='btn btn-default'>Cargando...</button>
              : <button type='button' onClick={this.handleSubmit} className='btn btn-primary'><i className='glyphicon glyphicon-plus'></i> Agregar evento</button>
            }
          </div>
        </div>
      </div>
    )

    // const { forum } = this.props
    let { agenda, isLoading, responseFail, responseSuccess, isSending, isFirefox, futureEvents, pastEvents } = this.state
    return (
      <div>
        <h2>Agenda</h2>
        {/* <p className='h3'>Agregar nuevo evento</p> */}
        {
          isFirefox ? 
            <div className="alert alert-warning" role="alert">
              Por favor, por motivos de compatibilidad, utilice <b>Google Chrome</b> para agregar nuevos eventos a la agenda.
            </div> :
            agendaForm   
        }
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
        <p className='h3'>Lista de eventos</p>
        <table className='table table-striped'>
          <thead>
            <tr>
              <th className="text-center"><i className='glyphicon glyphicon-remove'></i></th>
              <th>Nombre</th>
              <th>Fecha y hora</th>
              <th>Lugar</th>
              <th className="text-center"><i className='glyphicon glyphicon-user'></i></th>
              <th className="text-center">Lista</th>
            </tr>
          </thead>
          <tbody>
            {futureEvents.map((evento, index) => {
              return (
                <tr key={index}>
                  <td>
                    <a onClick={() => this.handleDeleteEvent(evento._id)} className="btn btn-danger btn-sm"><i className='glyphicon glyphicon-remove'></i></a>
                  </td>
                  <td>
                    <b>{evento.nombre}</b>
                    {/* <br/><span><small>{evento.descripcion}</small></span> */}
                  </td>
                  <td><small>{evento.fecha} {evento.hora}</small></td>
                  <td><small>{evento.lugar}</small></td>
                  <td>{evento.asistentes.length}</td>
                  <td className="text-center">
                    <a href={`/api/v2/agenda/${evento._id}/attendees`} download className='btn btn-sm btn-default'><i className='glyphicon glyphicon-download'></i></a>
                  </td>
                </tr>
              )
            })}
            {pastEvents.map((evento, index) => {
              return (
                <tr key={`p-${index}`}>
                  <td>
                    <a onClick={() => this.handleDeleteEvent(evento._id)} className="btn btn-danger btn-sm"><i className='glyphicon glyphicon-remove'></i></a>
                  </td>
                  <td style={{ opacity: '0.4' }}>
                    <b>{evento.nombre}</b>&nbsp;&nbsp;<small className="text-info">(Pasado)</small>
                    {/* <br/><span><small>{evento.descripcion}</small></span> */}
                  </td>
                  <td style={{ opacity: '0.4' }}><small>{evento.fecha} {evento.hora}</small></td>
                  <td style={{ opacity: '0.4' }}><small>{evento.lugar}</small></td>
                  <td style={{ opacity: '0.4' }}>{evento.asistentes.length}</td>
                  <td className="text-center">
                    <a href={`/api/v2/agenda/${evento._id}/attendees`} download className='btn btn-sm btn-default'><i className='glyphicon glyphicon-download'></i></a>
                  </td>
                </tr>
              )
            })}
            {
              isLoading && (
                <tr>
                  <td colSpan='4'>
                    Cargando...
                  </td>
                </tr>
              )
            }
            {
              agenda.length === 0 && (
                <tr>
                  <td colSpan='4'>
                    No hay eventos creados por el momento
                  </td>
                </tr>
              )
            }
          </tbody>
        </table>
      </div>
    )
  }
}
