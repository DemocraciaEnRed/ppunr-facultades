import React, { Component } from 'react'
import config from 'lib/config'
import forumStore from 'lib/stores/forum-store/forum-store'
import topicStore from 'lib/stores/topic-store/topic-store'
import escuelaStore from 'lib/stores/escuela-store'
import claustroStore from 'lib/stores/claustro-store'
import tagStore from 'lib/stores/tag-store/tag-store'
import Tags from 'lib/admin/admin-topics-form/tag-autocomplete/component'
import Attrs from 'lib/admin/admin-topics-form/attrs/component'
import { browserHistory } from 'react-router'
import userConnector from 'lib/site/connectors/user'
import { Link } from 'react-router'
import UploadImage from './upload-image'

// const PROPOSALS_FORUM_NAME = 'propuestas'

class AlbumPropuesta extends Component {
  constructor (props) {
    super(props)
    this.state = {
      album: [],
      topic: null,
      forum: null,
      buttonDisabled: true
    }

    this.handleImageChange = this.handleImageChange.bind(this)
    this.handleSubmitImage = this.handleSubmitImage.bind(this)
  }

  componentWillMount () {
    const isEdit = this.props.params.id ? true : false

    if (this.props.user.state.rejected) {
      browserHistory.push('/signin')
    }

    const promises = [
      // data del forum
      forumStore.findOneByName('proyectos'),
      topicStore.findOne(this.props.params.id)
    ]

    Promise.all(promises).then(results => {
      // topic queda en undefined si no estamos en edit
      const [forum, topic] = results
      console.log(forum)
      if (topic.privileges.canEdit !== true) return browserHistory.push('/404')
      if (forum.privileges.canEdit !== true || forum.privileges.canChangeTopics !== true) return browserHistory.push('/404')

      let newState = {
        album: topic.extra.album ? topic.extra.album : [],
        topic,
        forum,
        mediaTitle: topic.mediaTitle
      }

      this.setState(newState)
    }).catch(err =>
      console.error(err)
    )
  }

  handleSubmitImage (event) {
    // disable upload button
    this.setState({
      buttonDisabled: true
    })
    let formData = {
      imagebase64: document.querySelector('input[name="imagebase64"]').value
    }
    window.fetch(`/api/v2/topics/${this.props.params.id}/photo`, {
      method: 'POST',
      credentials: 'include',
      body: JSON.stringify(formData),
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    })
    //to JSON
    .then(res => res.json())
    .then(json => {
      console.log(json.results.image)
      // push json.results.image to album
      this.setState({
        album: this.state.album.concat(json.results.image)
      }, () => {
        // show notification success for 5 seconds
        document.getElementById('album-notification-success').style.display = 'block'
        setTimeout(() => {
          document.getElementById('album-notification-success').style.display = 'none'
        }, 5000)
        // clear inputs
        document.querySelector('input[name="imagebase64"]').value = ''
        document.querySelector('input[name="image"]').value = ''
        // disable upload button
      })
    })
    .catch((err) => {
      console.log(err)
      // show notification error for 5 seconds
      document.getElementById('album-notification-error').style.display = 'block'
      setTimeout(() => {
        document.getElementById('album-notification-error').style.display = 'none'
      }, 5000)
      this.setState({
        buttonDisabled: false
      })

    })
  }

  handleImageChange (event) {
    const reader = new FileReader()
    let file = document.querySelector('input[name="image"]').files[0]
    reader.readAsDataURL(file)
    reader.onload = () => {
      document.querySelector('input[name="imagebase64"]').value = reader.result
      // enable upload button
      this.setState({
        buttonDisabled: false
      })
      // this.find('input[name="imagebase64"]')[0].value = reader.result
    }
  }

  handleDeleteImage (filename) {
    let formData = {
      filename: filename
    }
    window.fetch(`/api/v2/topics/${this.props.params.id}/photo/delete`, {
      method: 'POST',
      credentials: 'include',
      body: JSON.stringify(formData),
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    })
    //to JSON
    .then(res => res.json())
    .then(json => {
      console.log(json.results.image)
      // push json.results.image to album
      this.setState({
        album: this.state.album.filter(image => image.filename !== filename)
      }, () => {
        // show notification success for 5 seconds
        alert('Imagen eliminada')
      })
    })
    .catch((err) => {
      console.log(err)
      // show notification error for 5 seconds
      alert('Error al eliminar imagen')
    })
  }

  componentWillUpdate (props, state) {
    if (this.props.user.state.rejected) {
      browserHistory.push('/signin?ref=/formulario-idea')
    }
  }

  render () {
    let { album, mediaTitle, buttonDisabled, topic } = this.state
    return (
      <div className="container" style={{marginTop: '150px', marginBottom: '50px'}}>
        {
          topic &&
        <Link href={`/propuestas/topic/${topic.id}`}><i className="icon-circle-arrow-left"></i> Volver a la idea</Link>
        }
        <hr />
        <p className="h3"><small>{mediaTitle}</small></p>
        <p className="h2"><b>Albúm de imagenes</b></p>
        <br/>
        <div className='panel panel-default'>
          <div className='panel-heading'>
            <span>Subir imagen</span>
          </div>
          <div className='panel-body'>
            <div className='form-group'>
              <label htmlFor='image'>Imagen</label>
              <input type='file' name='image' onChange={this.handleImageChange} accept='image/jpeg' />
              <span className='help-block'>Subí una imagen que represente tu idea</span>
              <input type='hidden' name='imagebase64' />
            </div>
            <div className='form-group'>
              <button onClick={this.handleSubmitImage} id='album-notification-upload-button' type='button' className='btn btn-primary btn-sm' disabled={buttonDisabled}>
                Subir imagen
              </button>
            </div>
            <div className="alert alert-info" id="album-notification-success" role="alert" style={{display: 'none'}}>
              <p><b>¡Exito!</b> La imagen se ha subido correctamente al album</p>
            </div>
            <div className="alert alert-danger" id="album-notification-danger" role="alert" style={{display: 'none'}}>
              <p><b>¡Error!</b> Ocurrio un error al subir la imagen al album. Por favor intente nuevamente.</p>
            </div>
          </div>
        </div>
        <p className="h4"><b>Imagenes subidas</b></p>
        <br />
        {
          album && (
            <div className='row'>
              {album.map((image, index) => {
                return (
                  <div className='col-md-2 col-sm-3 col-xs-6' key={index}>
                    <div style={{marginBottom: '10px'}} className="album-image-list-container">
                      <img src={image.thumbnailUrl} className='img-responsive' />
                      <button type="button" onClick={() => this.handleDeleteImage(image.filename)} className="btn btn-danger btn-sm album-image-delete-pic"><i className="glyphicon glyphicon-remove"></i></button>
                    </div>
                  </div>
                )
              })}
            </div>
          )
        }
      </div>
    )
  }
}

export default userConnector(AlbumPropuesta)