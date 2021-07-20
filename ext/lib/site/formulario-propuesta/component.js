import React, { Component } from 'react'
import config from 'lib/config'
import forumStore from 'lib/stores/forum-store/forum-store'
import topicStore from 'lib/stores/topic-store/topic-store'
import facultadStore from 'lib/stores/facultad-store'
import claustroStore from 'lib/stores/claustro-store'
import tagStore from 'lib/stores/tag-store/tag-store'
import Tags from 'lib/admin/admin-topics-form/tag-autocomplete/component'
import Attrs from 'lib/admin/admin-topics-form/attrs/component'
import { browserHistory } from 'react-router'
import userConnector from 'lib/site/connectors/user'
import { Link } from 'react-router'

// const PROPOSALS_FORUM_NAME = 'propuestas'

class FormularioPropuesta extends Component {
  constructor (props) {
    super(props)

    this.state = {
      mode: null,

      forum: null,
      topic: null,

      nombre: '',
      claustro: '',
      facultad: '',
      documento: '',
      genero: '',
      email: '',
      titulo: '',
      tags: [],
      problema: '',

      state: '',
      adminComment: '',
      adminCommentReference: '',

      availableTags: [],
      facultades: [],
      claustros: []
    }

    this.handleInputChange = this.handleInputChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
  }

  handleInputChange (evt) {
    evt.preventDefault()
    const { target: { value, name } } = evt
    this.setState({ [name]: value })
  }

  componentWillMount () {
    const isEdit = this.props.params.id ? true : false

    const promises = [
      // data del forum
      forumStore.findOneByName('proyectos'),
      // tags, facultades y claustros
      tagStore.findAll({field: 'name'}),
      facultadStore.findAll(),
      claustroStore.findAll()
    ]

    // si es edición traemos data del topic también
    if (isEdit)
      promises.push(topicStore.findOne(this.props.params.id))

    Promise.all(promises).then(results => {
      // topic queda en undefined si no estamos en edit
      const [ forum, tags, facultades, claustros, topic] = results

      let newState = {
        forum,
        availableTags: tags,
        facultades,
        claustros,
        mode: isEdit ? 'edit' : 'new'
      }

      if (isEdit)
        Object.assign(newState, {
          titulo: topic.mediaTitle,
          documento: topic.attrs.documento,
          genero: topic.attrs.genero,
          facultad: topic.attrs.facultad,
          claustro: topic.attrs.claustro,
          problema: topic.attrs.problema,
          // los tags se guardan por nombre (¿por qué?) así que buscamos su respectivo objeto
          tags: tags.filter(t => topic.tags.includes(t.name)),
          state: topic.attrs.state,
          adminComment: topic.attrs['admin-comment'],
          adminCommentReference: topic.attrs['admin-comment-reference']
        })

      console.log(isEdit, newState)
      this.setState(newState, () => {
        // updateamos campos de usuario
        // (recién dps del setState tendremos facultades y claustros cargados)
        this.props.user.onChange(this.onUserStateChange)
        // si ya está loggeado de antes debería pasar por la función igualmente
        this.onUserStateChange()
      })
      const hash = window.location.hash;
      if (hash && document.getElementById(hash.substr(1))) {
          // Check if there is a hash and if an element with that id exists
          const element = document.getElementById(hash.substr(1));
          const headerOffset = 100;
          const elementPosition = element.getBoundingClientRect().top;
          const offsetPosition = elementPosition - headerOffset;
          window.scrollTo({
               top: offsetPosition,
               behavior: "smooth"
          });
      }
    }).catch(err =>
      console.error(err)
    )
  }

  onUserStateChange = () => {
    if (this.props.user.state.fulfilled){
      let user = this.props.user.state.value
      this.setState({
        facultad: user.facultad._id,
        claustro: user.claustro._id,
        email: user.email,
        documento: user.dni,
        nombre: user.firstName + ' ' + user.lastName
      })
    }
  }

  handleSubmit (e) {
    e.preventDefault()
    const formData = {
      forum: this.state.forum.id,
      mediaTitle: this.state.titulo,
      'attrs.documento': this.state.documento,
      'attrs.genero': this.state.genero,
      'attrs.problema': this.state.problema,
      tags: this.state.tags.map(tag => tag.name)
    }
    if (this.state.forum.privileges && this.state.forum.privileges.canChangeTopics && this.state.mode === 'edit') {
      formData['attrs.admin-comment'] = this.state.adminComment
      formData['attrs.admin-comment-referencia'] = this.state.adminCommentReference
      formData['attrs.state'] = this.state.state
    }
    if (this.state.mode === 'new') {
      this.crearPropuesta(formData)
    } else {
      this.editarPropuesta(formData)
    }
  }

  crearPropuesta = (formData) => {
    window.fetch(`/api/v2/topics`, {
      method: 'POST',
      credentials: 'include',
      body: JSON.stringify(formData),
      headers: {
        'Content-Type': 'application/json'
      }
    })
    .then((res) => res.json())
    .then((res) => {
      if (res.status === 200) {
        window.location.href = `/propuestas/topic/${res.results.topic.id}`
      }
    })
    .catch((err) => {
      console.log(err)
    })
  }

  editarPropuesta (formData) {
    window.fetch(`/api/v2/topics/${this.props.params.id}`, {
      method: 'PUT',
      credentials: 'include',
      body: JSON.stringify(formData),
      headers: {
        'Content-Type': 'application/json'
      }
    })
    .then((res) => {
      if (res.status === 200) {
        window.location.href = `/propuestas/topic/${this.props.params.id}`
      }
    })
    .catch((err) => {
      console.log(err)
    })
  }

  toggleTag = (tag) => (e) => {
    // If is inside state.tags, remove from there
    this.setState((state) => {
      let theTags = state.tags
      if(theTags.includes(tag)){
        return { tags: theTags.filter(t => t !== tag)}
      }else if(theTags.length < 1)
        theTags.push(tag)
      return { tags: theTags }
    })
  }

  hasErrors = () => {
    if (this.state.nombre === '') return true
    if (this.state.documento === '') return true
    if (this.state.genero === '') return true
    if (this.state.email === '') return true
    if (this.state.titulo === '') return true
    if (this.state.facultad === '') return true
    if (this.state.claustro === '') return true
    if (this.state.problema === '') return true
    if (!this.state.tags || this.state.tags.length == 0) return true
    return false;

  }

  hasErrorsField = (field) => {
    const val = this.state[field]
    if(val === '' || (val && val.length == 0)) return true
    return false;
  }

  handleCheckboxInputChange(event) {
    const target = event.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.name;

    this.setState({
      [name]: value
    });
  }

  componentWillUpdate (props, state) {
    if (this.props.user.state.rejected) {
      browserHistory.push('/signin?ref=/formulario-idea')
    }
  }

  render () {
    const { forum, facultades, claustros } = this.state

    if (!forum) return null
    if(config.propuestasAbiertas || (this.state.forum.privileges && this.state.forum.privileges.canChangeTopics)) {
    return (
      <div className='form-propuesta'>
        <div className='propuesta-header'>
          <h1 className='text-center'>FORMULARIO PARA ENVIAR IDEAS</h1>
          <p>¡Compartinos tus ideas para mejorar nuestra universidad!</p>
          {//<p>¡Gracias a todos y todas por participar!</p>
          }
        </div>
        {/* FORMULARIO GOES BEHIND THIS */}
        <form className='wrapper' onSubmit={this.handleSubmit}>
          <div className="bar-section">
            <p className="section-title">Tus datos</p>
            <p className="section-subtitle">Todos estos datos son confidenciales</p>
          </div>
          <input type='hidden' name='forum' value={forum.id} />
          <div className='form-group'>
            <label className='required' htmlFor='nombre'>
              Nombre y apellido
            </label>
            <input
              className='form-control'
              required
              type='text'
              max='128'
              name='nombre'
              value={this.state['nombre']}
              placeholder=""
              onChange={this.handleInputChange}
              disabled={true} />
          </div>
          <div className='form-group'>
            <label className='required' htmlFor='claustro'>
              Claustro
            </label>
            <select
              className='form-control special-height'
              required
              name='claustro'
              value={this.state['claustro']}
              onChange={this.handleInputChange}
              disabled={true}>
              <option value=''>Seleccione un claustro</option>
              {claustros.length > 0 && claustros.map(claustro =>
                <option key={claustro._id} value={claustro._id}>
                  {claustro.nombre}
                </option>
              )}
            </select>
          </div>
          <div className='form-group'>
            <label className='required' htmlFor='facultad'>
              Facultad
            </label>
            <select
              className='form-control special-height'
              required
              name='facultad'
              value={this.state['facultad']}
              onChange={this.handleInputChange}
              disabled={true}>
              <option value=''>Seleccione una facultad</option>
              {facultades.length > 0 && facultades.map(facultad =>
                <option key={facultad._id} value={facultad._id}>
                  {facultad.nombre}
                </option>
              )}
            </select>
          </div>
          <div className='form-group'>
            <label className='required' htmlFor='documento'>
              DNI
            </label>
            <input
              className='form-control'
              required
              type='text'
              max='50'
              name='documento'
              placeholder=""
              value={this.state['documento']}
              onChange={this.handleInputChange}
              disabled={true}/>
          </div>
          <div className='form-group'>
            <label className='required' htmlFor='genero'>
              Género
            </label>
            <input
              className='form-control'
              required
              type='text'
              max='50'
              name='genero'
              placeholder=""
              value={this.state['genero']}
              onChange={this.handleInputChange} />
          </div>
          <div className='form-group'>
            <label className='required' htmlFor='email'>
              Email
            </label>
            <input
              className='form-control'
              required
              type='text'
              max='128'
              name='email'
              placeholder=""
              value={this.state['email']}
              onChange={this.handleInputChange}
              disabled={true} />
          </div>

          <div id="acerca-propuesta" className="bar-section acerca-propuesta">
              <p className="section-title">Acerca de tu idea</p>
          </div>

          <section>
          <div className='form-group'>
            <label className='required' htmlFor='titulo'>
              Título
            </label>
            <p className="help-text">Elegí un título</p>
            <input
              className='form-control'
              required
              type='text'
              max='128'
              name='titulo'
              value={this.state['titulo']}
              onChange={this.handleInputChange} />
          </div>
          <div className='tags-autocomplete'>
            <label className='required'>
                Temas
            </label>
            <p className='help-text'>Elegí los temas relacionados a tu idea. Tenés un máximo de 1 tema.</p>
            {
              this.state.mode === 'edit' && this.state.tags &&
                <ul className="tags">
                {
                  this.state.availableTags.map((tag) => {
                    return (
                      <li key={tag.id}><span onClick={this.toggleTag(tag)} value={tag.id} className={this.state.tags.includes(tag) ? 'tag active' : 'tag'}>{tag.name}</span></li>
                    )
                  })
                }
                </ul>
            }
            {
              this.state.mode === 'new' &&
                <ul className="tags">
                {
                  this.state.availableTags.map((tag) => {
                    return (
                      <li key={tag.id}><span onClick={this.toggleTag(tag)} value={tag.id} className={this.state.tags.includes(tag) ? 'tag active' : 'tag'}>{tag.name}</span></li>
                    )
                  })
                }
                </ul>
            }
          </div>
          <div className='form-group'>
            <label className='required' htmlFor='problema'>
              Tu idea
            </label>
              <p className='help-text'>¿Que querés proponer? ¿Para qué? ¿Quiénes se ven beneficiado/as?</p>
            {/*<p className='help-text'><strong>Recordá ingresar solo una idea por formulario</strong></p>*/}
            <textarea
              className='form-control'
              required
              rows='6'
              max='5000'
              name='problema'
              value={this.state['problema']}
              onChange={this.handleInputChange}>
            </textarea>
          </div>
          {this.state.forum.privileges && this.state.forum.privileges.canChangeTopics && this.state.mode === 'edit' && (
            <div className='form-group'>
              <label htmlFor='state'>Estado</label>
              <span className='help-text requerido'>Agregar una descripción del estado del proyecto</span>
              <select
                className='form-control special-height'
                name='state'
                value={this.state['state']}
                onChange={this.handleInputChange}>
                <option value='pendiente'>Pendiente</option>
                <option value='factible'>Factible</option>
                <option value='no-factible'>No factible</option>
                <option value='integrado'>Integrada</option>
              </select>
            </div>
          )}
          {this.state.forum.privileges && this.state.forum.privileges.canChangeTopics && this.state.mode === 'edit' && (
            <div className='form-group'>
              <label htmlFor='adminComment'>Comentario del moderador:</label>
              <span className='help-text requerido'>Escribir aquí un comentario en el caso que se cambie el estado a "factible", "rechazado" o "integrado"</span>
              <textarea
                className='form-control'
                rows='6'
                max='5000'
                name='adminComment'
                value={this.state['adminComment']}
                onChange={this.handleInputChange}>
              </textarea>
            </div>
          )}
          {this.state.forum.privileges && this.state.forum.privileges.canChangeTopics && this.state.mode === 'edit' && (
            <div className='form-group'>
              <label htmlFor='adminCommentReference'>Link a la propuesta definitiva:</label>
              <span className='help-text requerido'>Escribir aquí el link al proyecto vinculado, en caso que se cambie el estado a "integrado"</span>
              <input
                type='text'
                className='form-control'
                name='adminCommentReference'
                value={this.state['adminCommentReference']}
                onChange={this.handleInputChange} />
            </div>
          )}
          {
             this.hasErrors() &&
             <div className="error-box">
             <ul>
                    {this.hasErrorsField('nombre') && <li className="error-li">El campo "Nombre y apellido" no puede quedar vacío</li> }
                    {this.hasErrorsField('documento') && <li className="error-li">El campo "DNI" no puede quedar vacío</li> }
                    {this.hasErrorsField('genero') && <li className="error-li">El campo "Género" no puede quedar vacío</li> }
                    {this.hasErrorsField('email') && <li className="error-li">El campo "Email" no puede quedar vacío</li> }
                    {this.hasErrorsField('titulo') && <li className="error-li">El campo "Título" no puede quedar vacío</li> }
                    {this.hasErrorsField('facultad') && <li className="error-li">El campo "Facultad" no puede quedar vacío</li> }
                    {this.hasErrorsField('claustro') && <li className="error-li">El campo "Claustro" no puede quedar vacío</li> }
                    {this.hasErrorsField('tags') && <li className="error-li">El campo "Temas" no puede quedar vacío</li> }
                    {this.hasErrorsField('problema') && <li className="error-li">El campo "Tu idea" no puede quedar vacío</li> }
             </ul>
             </div>
          }
          <div className='submit-div'>
            { !this.hasErrors() &&
              <button type='submit' className='submit-btn'>
                {this.state.mode === 'new' ? 'Enviar idea' : 'Guardar idea'}
              </button>
            }
          </div>
          <p className="more-info add-color">¡Luego de mandarla, podes volver a editarla!</p>
          </section>
        </form>
      </div>
    )

    } return (
      <div className='form-propuesta'>
        <div className='propuesta-header'>
          <h1 className='text-center'>PRESUPUESTO PARTICIPATIVO UNR</h1>
          {/* <p>¡Acá vas a poder subir tu propuesta para el presupuesto participativo!</p> */}
          <p>¡Gracias a todos y todas por participar!</p>
        </div>
        {/* ALERT PARA FIN DE ETAPA */}
        <alert className='alert alert-info cronograma'>
          <Link style={{ display: 'inline' }} to='/s/acerca-de?scroll=cronograma'>
            La etapa de envío de propuestas ya ha sido cerrada. ¡Muchas gracias por participar!
          </Link>
        </alert>
     </div>
    )
  }
}

export default userConnector(FormularioPropuesta)
