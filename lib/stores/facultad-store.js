import urlBuilder from '../url-builder'
import request from '../request/request'
import Store from './store/store'

class FacultadStore extends Store {
  name () {
    return 'facultad'
  }

  findAll(forceUpdate){
    if (!forceUpdate && this.facultades)
      return new Promise((resolve, reject) => { resolve(this.facultades) })

    let url = this.url('')
    if (this._fetches.get(url)) return this._fetches.get(url)

    let fetch = this._fetch(url)

    fetch.then((facultades) => {
      return this.facultades = facultades
    }).catch((err) => {
      this.log('Found error', err)
      return this.facultades = []
    })

    return fetch
  }
}

export default new FacultadStore()
