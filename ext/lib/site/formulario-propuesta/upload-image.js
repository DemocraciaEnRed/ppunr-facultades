import React, { Component } from 'react'
import config from 'lib/config'

// const PROPOSALS_FORUM_NAME = 'propuestas'

class UploadImage extends Component {
  constructor (props) {
    super(props)
    this.state = {
      album: props.album,
      buttonDisabled: true
    }

    this.handleImageChange = this.handleImageChange.bind(this)
    this.handleSubmitImage = this.handleSubmitImage.bind(this)
  }

  handleSubmitImage (event) {
    // disable upload button
    this.setState({
      buttonDisabled: true
    })
    let formData = {
      imagebase64: document.querySelector('input[name="imagebase64"]').value
    }
    window.fetch(`/api/v2/topics/${this.props.topicId}/photo`, {
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
    window.fetch(`/api/v2/topics/${this.props.topicId}/photo/delete`, {
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

  render () {
    let { album, buttonDisabled } = this.state
    return (
      <div>
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
        <br/>
        <h3>Imagenes subidas</h3>
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

export default UploadImage
