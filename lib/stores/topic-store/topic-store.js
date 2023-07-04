import memoize from 'lodash.memoize'
import Geopattern from 'geopattern'
import encode from 'mout/queryString/encode'
import urlBuilder from 'lib/url-builder'
import Store from '../store/store'
import request from '../../request/request'
import forumStore from '../forum-store/forum-store'

class TopicStore extends Store {
  name () {
    return 'topic'
  }

  url (id, params = {}) {
    if (typeof id === 'object') {
      params = id
      id = ''
    }

    id = id ? '/' + id : ''

    return `/api/v2/topics${id}${encode(params)}`
  }

  findAllSuffix () {
    return null
  }

  parseResponse ({ body }) {
    if (!body || !body.results) return Promise.resolve()

    if (body.results.topics) {
      return Promise.all(body.results.topics.map(this.parse)).then((topics) => [topics, body.pagination])
    } else if (body.results.topic) {
      return this.parse(body.results.topic)
    } else {
      return Promise.resolve()
    }
  }

  parse (topic) {
    if (!topic.forum) {
      return Promise.reject(new Error(`Topic ${topic.id} needs a forum.`))
    }

    return forumStore.findOne(topic.forum).then((forum) => {
      topic.url = urlBuilder.for('site.topic', {
        id: topic.id,
        forum: forum.name
      })

      return topic
    })
  }

  publish (id, jumpItemHack) {
    if (!jumpItemHack && !this.item.get(id)) {
      return Promise.reject(new Error('Cannot publish not fetched item.'))
    }

    const promise = new Promise((resolve, reject) => {
      request
        .post(`/api/v2/topics/${id}/publish`)
        .end((err, res) => {
          if (err || !res.ok) return reject(err)

          this.parse(res.body.results.topic).then((item) => {
            if (!jumpItemHack) this.set(id, item)
            resolve(item)
          }).catch(reject)
        })
    })

    return promise
  }

  unpublish (id, jumpItemHack) {
    if (!jumpItemHack && !this.item.get(id)) {
      return Promise.reject(new Error('Cannot unpublish not fetched item.'))
    }

    const promise = new Promise((resolve, reject) => {
      request
        .post(`/api/v2/topics/${id}/unpublish`)
        .end((err, res) => {
          if (err || !res.ok) return reject(err)

          this.parse(res.body.results.topic).then((item) => {
            if (!jumpItemHack) this.set(id, item)
            resolve(item)
          }).catch(reject)
        })
    })

    return promise
  }

  vote (id, value, dni='', facultad = null, claustro = null) {
    const promise = new Promise((resolve, reject) => {
      request
        .post(`/api/v2/topics/${id}/vote`)
        .send({ value: value, dni: dni, facultad: facultad, claustro: claustro })
        .end((err, res) => {
          if (err || !res.ok) return reject(err)

          this.parseResponse(res).then((topic) => {
            this.set(id, topic)
            resolve(topic)
          }).catch(reject)
        })
    })

    return promise
  }

  updateProyectista (id, hacerProyectista) {
    const promise = new Promise((resolve, reject) => {
      request
        .post(`/api/v2/topics/${id}/proyectista`)
        .send({ value: hacerProyectista ? 'true' : 'false' })
        .end((err, res) => {
          if (err || !res.ok) return reject(err)
          this.parseResponse(res).then((topic) => {
            //this.set(id, topic)
            resolve(topic)
          }).catch(reject)
        })
    })

    return promise
  }

  getCoverUrl (topic) {
    if (topic.coverUrl) return topic.coverUrl
    return getCoverUrl(topic.id)
  }

  findUniqTopicAttrs(attrsArray) {
    const promise = new Promise((resolve, reject) => {
      request
        .post(`/api/v2/topics/uniq-attrs`)
        .send({ attrs: attrsArray })
        .end((err, res) => {
          if (err || !res.ok) return reject(err)

          resolve(res.body.results.attrVals)
        })
    })

    return promise
  }

  findAllProyectos() {
    return new Promise((resolve, reject) => {
      request
        .get(`/api/v2/topics/find-all-proyectos`)
        .end((err, res) => {
          //console.log('findAllProyectos', err, res)
          if (err || !res.ok) return reject(err)
          resolve(res.body)
        })
    })
  }

  deleteAllTopics(forum){
    return new Promise((resolve, reject) =>{
      request
        .del(`/api/v2/topics?forum=${forum.id}`)
        .end((err, res) => {
          if (err || !res.ok) return reject(err)
          resolve(res.body)
        })
    })
  }


  getTopic(id) {
    return new Promise((resolve, reject) => {
      request
        .get(`/api/v2/topics/${id}`)
        .end((err, res) => {
          //console.log('findAllProyectos', err, res)
          if (err || !res.ok) return reject(err)
          resolve(res.body.results && res.body.results.topic)
        })
    })
  }
}

const getCoverUrl = memoize((id) => Geopattern.generate(id).toDataUri())

export default new TopicStore()
