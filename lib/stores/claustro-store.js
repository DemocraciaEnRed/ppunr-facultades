import urlBuilder from '../url-builder'
import request from '../request/request'
import Store from './store/store'

class ClaustroStore extends Store {
  name () {
    return 'claustro'
  }

  findAll(forceUpdate){
    if (!forceUpdate && this.claustros)
      return new Promise((resolve, reject) => { resolve(this.claustros) })

    let url = this.url('')
    if (this._fetches.get(url)) return this._fetches.get(url)

    let fetch = this._fetch(url)

    fetch.then((claustros) => {
      this.claustros = claustros
    }).catch((err) => {
      this.claustros = undefined
      this.log('Found error', err)
    })

    return fetch
  }
}

export default new ClaustroStore()
