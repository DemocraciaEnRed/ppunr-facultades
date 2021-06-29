/* global fetch */
import t from 't-component'
import 'whatwg-fetch'
import FormView from '../../form-view/form-view'
import textStore from '../../stores/text-store'
import template from './template.jade'
import request from '../../request/request'
import debug from 'debug'

const log = debug('democracyos:admin-contenido-portada')


export default class ContenidoPortadaView extends FormView {
  constructor (facultades, claustros) {
    const locals = {
      facultades: facultades,
      claustros: claustros
    }
    super(template, locals)
    textStore.findAll().then(this.loadTexts.bind(this))
  }

  loadTexts (texts) {
    this.texts = texts
    if (!texts || !texts.length){
      ;
    }else{
      texts.forEach((text) => {
        let el = this.find(`.form-control[data-name='${text.name}']`)
        if (el){
          // ponemos de "name" los ids de los textos
          el.attr('name', text._id)
          el.value(text.text || '')
        }
      })
    }
  }

  textId(textName){
    if (this.texts)
      this.texts.forEach((text) => {
        if(text.name == textName)
          return text._id
      })
  }

  switchOn () {
    this.bind('click', '.buscar-dni-button', this.bound('dosomething'))
    this.bind('click', '.new-padron-button', this.bound('submitPadron'))
    this.on('success', this.onsuccess.bind(this))
    this.on('error', this.onerror.bind(this))
  }

  switchOff () {
    this.off()
  }

  dosomething() {
    let el = this.find(`.form-control[data-name='busqueda-dni']`)
    if (el.value() == '') return
    request
      .get('/api/padron/search/dni')
      .query({ dni: el.value() })
      .end((err, res) => {
        if (err || !res.ok) {
          var message = 'Cannot find padron with dni ' + el.value()
          return log(message)
        }
        if (Object.keys(res.body).length === 0) this.find('pre#response-dni')[0].textContent = 'El DNI ' + el.value() + ' no se encuentra en el padrón.'
        else this.find('pre#response-dni')[0].innerHTML = this.formatResponse(res.body, el.value())
        var message = 'Found padron with dni ' + el.value()
        return log(message)
      })
  }
  formatResponse(data,originalDNI){
    if(data.user){
      return `<b>Email</b>
${data.user.email}

<b>Nombre</b>
${data.user.firstName}

<b>Apellido</b>
${data.user.lastName}

<b>DNI</b>
${data.user.dni}

<b>Claustro</b>
${data.user.claustro} - ${this.locals.claustros.find(x => data.user.claustro === x.value).name}

<b>Facultad</b>
${data.user.facultad} - ${this.locals.facultades.find(x => data.user.facultad === x.value).name}`
    }else{
      return `El DNI ${originalDNI} ya está en el padron.\nSin embargo, no hay ningun usuario asociado.`
    }
  }
  fillResponseDni(text) {

  }

  submitPadron() {
    let elDNI = this.find(`.form-control[data-name='new-dni']`)
    // let elEscuela = this.find(`.form-control[data-name='new-escuela']`)
    // if (elEscuela.value() == '') return
    if (elDNI.value() == '') return
    const theDni = elDNI.value()
    // const theEscuela = elEscuela.value()
    request
      .post('/api/padron/new')
      .send({ dni: elDNI.value()})
      .end((err, res) => {
        if (err || !res.ok) {
          var message = 'Cannot add to padron with dni ' + elDNI.value()
          this.find('#error-new-dni')[0].textContent = 'No se a podido agregar a la persona con DNI ' + theDni + ' ¿Tal vez ya está en el padron?'
          this.find('#error-new-dni')[0].hidden = false
          this.find('#success-new-dni')[0].hidden = true
          return log(message)
        }
        elDNI.value('')
        this.find('#success-new-dni')[0].textContent = 'OK! Agregado el DNI ' + theDni
        this.find('#success-new-dni')[0].hidden = false
        this.find('#error-new-dni')[0].hidden = true
        var message = 'NEW padron with dni ' + theDni
        return log(message)
      })
  }

  onsuccess () {
    this.messages(['Los textos se han guardado exitósamente'], 'success')
    textStore.findAll(true).then(this.loadTexts.bind(this))
    window.scrollTo(0,0);
  }

  onerror () {
    this.messages([t('common.internal-error')])
  }
}
