import urlBuilder from '../url-builder'
import request from '../request/request'
import Store from './store/store'

class EscuelaStore extends Store {
  name () {
    return 'escuela'
  }

  findAll(forceUpdate){
    if (!forceUpdate && this.escuelas)
      return new Promise((resolve, reject) => { resolve(this.escuelas) })

    let url = this.url('')
    if (this._fetches.get(url)) return this._fetches.get(url)

    let fetch = this._fetch(url)

    fetch.then((escuelas) => {
      return this.escuelas = escuelas
    }).catch((err) => {
      this.log('Found error', err)
      return this.escuelas = []
    })

    return fetch
  }

  findOneById(id){
    let url = this.url(id)
    if (this._fetches.get(url)) return this._fetches.get(url)

    let fetch = this._fetch(url)

    // solo para dejar explicitado que devuelve la escuela
    fetch.then((escuela) => escuela)
      .catch((err) => {
        this.log('Found error', err)
      })

    return fetch
  }
}

export default new EscuelaStore()
