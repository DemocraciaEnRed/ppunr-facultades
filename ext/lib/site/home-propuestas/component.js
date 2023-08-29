import React, { Component } from 'react'
import { browserHistory } from 'react-router'
import config from 'lib/config'
import forumStore from 'lib/stores/forum-store/forum-store'
import topicStore from 'lib/stores/topic-store/topic-store'
import userConnector from 'lib/site/connectors/user'
import tagStore from 'lib/stores/tag-store/tag-store'
import facultadStore from 'lib/stores/facultad-store'
import claustroStore from 'lib/stores/claustro-store'
import textStore from 'lib/stores/text-store'
import TopicCard from './topic-card/component'
import BannerListadoTopics from 'ext/lib/site/banner-listado-topics/component'
import FilterPropuestas from './filter-propuestas/component'
import Jump from 'ext/lib/site/jump-button/component'
import Footer from 'ext/lib/site/footer/component'
import Anchor from 'ext/lib/site/anchor'
// https://www.npmjs.com/package/react-select/v/2.4.4
import Select from 'react-select' // ! VERSIÓN 2.4.4 !

// Variables para fases de propuestas abiertas o cerrdas:
// config.propuestasVisibles
// config.propuestasAbiertas
// config.propuestasTextoAbiertas
// config.propuestasTextoCerradas
// config.votacionVisible
// config.votacionAbierta
// config.votacionTextoAbierta
// config.votacionTextoCerrada

const defaultValues = {
  limit: 20,
  facultad: [],
  claustro: [],
  tag: [],
  // 'barrio' o 'newest' o 'popular'
  sort: 'newest',
  tipoIdea: []
}

const filters = {
  popular: {
    text: 'Más Populares',
    sort: 'popular'
  },
  newest: {
    text: 'Más Actualizados',
    sort: 'newest'
  }
}

class HomePropuestas extends Component {
  constructor () {
    super()

    this.state = {
      forum: null,
      topics: null,
      texts:{},

      facultades: [],
      facultad: defaultValues.facultad,
      claustros: [],
      claustro: defaultValues.claustro,
      tags: [],
      tag: defaultValues.tag,
      tiposIdea: [],
      tipoIdea: defaultValues.tipoIdea,
      sort: defaultValues.sort,

      page: null,
      noMore: null,

      selectedProyecto: null,
      searchableProyectos: [],

      topicsVoted: [],
      dialogVotacion: false,
      dniP: '',
      facultadP: null,
      claustroP: null,
      dialogMessage: null,
      isDNIInPadron: false,
      votesP: []
    }

    this.handleInputChange = this.handleInputChange.bind(this)
    this.renderSortFilter = this.renderSortFilter.bind(this)
  }

  componentDidMount () {
    window.scrollTo(0, 0)
    if (this.props.location.query.tags) { defaultValues.tag.push(this.props.location.query.tags) }

    // igual que filtros de admin (lib/admin/admin/admin.js)
    Promise.all([
      facultadStore.findAll(),
      claustroStore.findAll(),
      tagStore.findAll(),
      forumStore.findOneByName('proyectos'),
      topicStore.findAllProyectos(),
      textStore.findAllDict()
    ]).then((results) => {
      const [facultades, claustros, tags, forum, proyectos, texts] = results
      const tagsMap = tags.filter((t) => t.enabled).map((tag) => { return { value: tag.id, name: tag.name } })
      const tag = this.props.location.query.tags ? [tagsMap.find((j) => j.name == this.props.location.query.tags).value] : []
      const tiposIdea = forum.topicsAttrs.find((a) => a.name == 'state').options.map((state) => { return { value: state.name, name: state.title } })
      const tipoIdea = forum.config.ideacion ? ['pendiente'] : forum.config.preVotacion || forum.config.votacion ? ['proyecto'] : []
      this.setState({
        facultades: facultades.map((facultad) => { return { value: facultad._id, name: facultad.abreviacion } }),
        claustros: claustros.map((claustro) => { return { value: claustro._id, name: claustro.nombre } }),
        tags: tagsMap,
        tag,
        tiposIdea,
        tipoIdea,
        forum,
        texts,
        // searchableProyectos: proyectos.filter(p => p.attrs.state == (config.votacionVisible ? 'proyecto' : 'pendiente')).map(p => ({label: `${p.mediaTitle}`, value: p._id}))
        // searchableProyectos: config.votacionVisible ? proyectos.map(p => p.state == 'proyecto') : proyectos.map(p => p.state == 'pendiente')
        searchableProyectos: proyectos.map((p) => ({ label: `#${p.attrs && p.attrs.numero} ${p.mediaTitle}`, value: p._id }))
      }, () => this.fetchTopics())
    }).catch((err) => { throw err })
  }

  fetchTopics = (page) => {
    page = page || 1

    let query = {
      forumName: config.forumProyectos,
      page: page.toString(),
      limit: defaultValues.limit.toString(),

      facultades: this.state.facultad,
      claustros: this.state.claustro,
      // tags: this.state.tags.filter(t => this.state.tag.includes(t.value)).map(t => t.name),
      tag: this.state.tag.join(','),
      sort: this.state.sort,
      tipoIdea: this.state.tipoIdea
    }

    let queryString = Object.keys(query)
      .filter((k) => query[k] && query[k].length > 0)
      .map((k) => `${k}=${Array.isArray(query[k]) ? query[k].join(',') : query[k]}`)
      .join('&')

    return window
      .fetch(`/ext/api/topics?${queryString}`, { credentials: 'include' })
      .then((res) => res.json())
      .then((res) => {
        let topics = res.results ? res.results.topics : []
        const noMore = res.pagination ? page >= res.pagination.pageCount : true
        // pagination contiene: count, page, pageCount, limit

        // How to Randomize (shuffle) a JavaScript Array
        // https://www.w3docs.com/snippets/javascript/how-to-randomize-shuffle-a-javascript-array.html
        function shuffleArray (array) {
          let curId = array.length
          // There remain elements to shuffle
          while (curId !== 0) {
            // Pick a remaining element
            let randId = Math.floor(Math.random() * curId)
            curId -= 1
            // Swap it with the current element.
            let tmp = array[curId]
            array[curId] = array[randId]
            array[randId] = tmp
          }
          return array
        }
        topics = shuffleArray(topics)

        this.setState((prevState) => ({
          topics: page == 1 ? topics : prevState.topics.concat(topics),
          page: page,
          noMore: noMore
        }))
        return topics
      })
      .catch((err) => console.error(err))
  }

  // función cuando hacés click en "Ver Más"
  paginateForward = () => {
    const page = this.state.page + 1
    this.fetchTopics(page)
  }

  changeTopics () {
    this.fetchTopics(this.state.page)
      .then((res) => {
        this.setState({ topics: res })
      })
      .catch((err) => { console.error(err) })
  }

  handleInputChange = (evt) => {
    evt.preventDefault()
    const { value, name } = evt.target
    this.setState({
      [name]: value,
      page: 1
    }, () => this.changeTopics())
  }

  handleFilter = (filter, value) => {
    if (filter == 'tipoIdea') {
      // solo permitir una elección en tipo de idea
      this.handleDefaultFilter(filter, value)
    } else {
      // If the value is not included in the filter array, add it
      if (!this.state[filter].includes(value)) {
        this.setState({
          [filter]: [...this.state[filter], value]
        }, () => this.fetchTopics())
        // If it's already included and it's the only filter applied, apply default filters
      /* } else if (this.state[filter].length === 1) {
        this.clearFilter(filter) */
        // If it's already included erase it
      } else {
        this.setState({
          [filter]: [...this.state[filter]].filter((item) => item !== value)
        }, () => this.fetchTopics())
      }
    }
  }

  handleDefaultFilter = (filter, value) => {
    this.setState({
      [filter]: [value]
    }, () => this.fetchTopics())
  }

  // Clear all selected items from a filter
  clearFilter = (filter) => {
    this.setState({
      [filter]: []
    }, () => this.fetchTopics())
  }

  // esta misma función está en ext/lib/site/topic-layout/component.js
  handleVote = (id, isVoted) => {
    const { forum, facultadP, claustroP } = this.state
    const { user } = this.props
    const voterInformation = this.getVoterInformation()

    // si el usuario no esta logueado, escapa por aca.
    if (user.state.rejected) {
      return browserHistory.push({
        pathname: '/signin',
        query: { ref: window.location.pathname }
      })
    }
    const facultad = facultadP || user.state.value.facultad._id
    const claustro = claustroP || user.state.value.claustro._id

    // topicStore.vote(id, !isVoted ? 'apoyo-idea' : 'no-apoyo-idea').then((res) => {
    topicStore.vote(id, 'voto', voterInformation.dni, facultad, claustro)
              .then((res) => {
                const topics = this.state.topics
                const index = topics.findIndex((t) => t.id === id)
                topics[index] = res
                user.fetch(true).then(() => {
                  this.setState({ topics })
                })
              })
              .then((res) => {
                if ((forum.privileges && forum.privileges.canEdit) || (user && user.state && user.state.value && user.state.value.oficialMesa)) {
                  this.checkPadron()
                }
              })
              .catch((err) => { throw err })
  }

  handleProyectista = (id, hacerProyectista) => {
    const { user } = this.props

    if (user.state.rejected) {
      return browserHistory.push({
        pathname: '/signin',
        query: { ref: window.location.pathname }
      })
    }

    topicStore.updateProyectista(id, hacerProyectista).then((res) => {
      const topics = this.state.topics
      const index = topics.findIndex((t) => t.id === id)
      topics[index] = res
      this.setState({ topics })
    }).catch((err) => { throw err })
  }

  handleRemoveBadge = (option) => (e) => {
    // feísimo, feísimo
    if (this.state.facultad.includes(option)) {
      this.setState({ facultad: this.state.facultad.filter((i) => i != option) }
      , () => this.fetchTopics())
    } else if (this.state.claustro.includes(option)) {
      this.setState({ claustro: this.state.claustro.filter((i) => i != option) }
      , () => this.fetchTopics())
    } else if (this.state.tag.includes(option)) {
      this.setState({ tag: this.state.tag.filter((i) => i != option) }
      , () => this.fetchTopics())
    }
  }

  onChangeSortFilter = (key) => {
    this.setState({ sort: key }, () => this.fetchTopics())
  }

  goTop () {
    Anchor.goTo('container')
  }

  onChangeTipoIdeaFilter = (name) => {
    this.setState({ tipoIdea: name }, () => this.fetchTopics())
  }

  renderSortFilter () {
    const {forum} = this.state

    return (
      <div>
        {
           forum && forum.config.ideacion &&
            <h4 className='topics-title'>Lista de ideas</h4>
        }
        {
          forum && (forum.config.votacion || forum.config.preVotacion) &&
            <h4 className='topics-title'>Lista de proyectos</h4>
        }
        <div className='topics-filters'>
          {/* this.state.forumStates &&
            <div className='topics-filter topics-state-filter'>
              <span>Mostrar ideas</span>
              {this.state.forumStates.map((state) => (
                  <button
                    key={state.name}
                    className={`btn-sort-filter ${this.state.tipoIdea === state.name ? 'active' : ''}`}
                    onClick={() => this.onChangeTipoIdeaFilter(state.name)}>
                    <span className="glyphicon glyphicon-ok" />
                    {
                      (state.name == 'pendiente' && 'Originales') ||
                      (state.name == 'sistematizada' && 'Sistematizadas') ||
                      state.title
                    }
                  </button>
                ))}
            </div>
          */}
          {/* this.state.topics && this.state.topics.length > 0 &&
            <div className='topics-filter topics-sort-filter'>
              <span>Ordenar por</span>
              {Object.keys(filters).map((key) => (
                  <button
                    key={key}
                    className={`btn-sort-filter ${this.state.sort === key ? 'active' : ''}`}
                    onClick={() => this.onChangeSortFilter(filters[key].sort)}>
                    <span className="glyphicon glyphicon-ok" />
                    {filters[key].text}
                  </button>
                ))}
            </div>
          */}
        </div>
      </div>
    )
  }

  handleSelectedProyecto = (selectedProyecto) => {
    // console.log(`Option selected:`, selectedProyecto);

    const topicId = selectedProyecto.value
    if (this.state.topics.find((t) => t.id == selectedProyecto.value) == undefined) {
      // si el topic no está en la actual lista de resultados lo vamos a buscar
      // console.log('Topic not found, searching it:', topicId)
      topicStore.getTopic(topicId).then((topic) => {
        if (!topic) { return }

        // console.log('Adding topic:', topic.id)
        this.setState((prevState) => ({
          topics: prevState.topics.concat(topic),
          selectedProyecto
        }))
      })
    } else {
      // console.log('Topic found, filtering it')
      this.setState({ selectedProyecto })
    }
  }

  handlerVotacion = (e) => {
    e.preventDefault()

    this.setState({ 
      dialogVotacion: !this.state.dialogVotacion,
      dialogMessage: null,
      dniP: '',
      facultadP: null,
      claustroP: null,
      votesP: [],
      isDNIInPadron: false
    }) //, () => this.fetchTopics());
  }

  checkPadron = () => {
    const { dniP, facultadP, claustroP, forum } = this.state

    this.setState({
      dialogMessage: null
    }, () => {
      window.fetch(`api/padron/search/dni?dni=${dniP}&forum=${forum.name}`, {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      })
      .then((res) => res.json())
      .then((res) => {
        // if response is an empty object
        if (Object.keys(res).length === 0) {
          // then user is not in padron
          this.setState({
            dialogMessage: 'El DNI solicitado no se encuentra en el Padrón'
          })
        } else {
          this.setState({ dialogVotacion: false, isDNIInPadron: true, votesP: res.votes })
        }
      })
    })
  }

  getVoterInformation () {
    const { forum, dniP, isDNIInPadron, votesP } = this.state
    const { user } = this.props
    let votacion = false
    const userLoggedIn = user.state && user.state.fulfilled
    let dni = ''
    let votes = []
    if (forum) {
      votacion = forum.config.votacion
      if ((userLoggedIn && forum.privileges && forum.privileges.canEdit) || (userLoggedIn && user && user.state && user.state.value && user.state.value.oficialMesa)) {
        if (isDNIInPadron) {
          dni = dniP
          votes = votesP
        } else {
          dni = ''
          votes = []
        }
      } else if (user && user.state && user.state.value && !forum.privileges.canEdit && !user.state.value.oficialMesa) {
        dni = user.state.value.dni
        votes = userLoggedIn && user.state.value && user.state.value.voto
      }
    }
    console.log( { userLoggedIn, dni, votes, votacion })

    return { userLoggedIn, dni, votes, votacion }
  }

  render () {
    const {
        forum, topics, facultades,
        searchableProyectos, selectedProyecto, dialogVotacion,
        claustros, dialogMessage,
        dniP, facultadP, claustroP,tipoIdea, texts
      } = this.state
    const { user } = this.props
    // console.log(facultades, claustros)
    let filteredTopics

    if (selectedProyecto) { filteredTopics = topics.filter((t) => t.id == selectedProyecto.value) }

    const voterInformation = this.getVoterInformation()

    return (
      <div className={`ext-home-ideas ${user.state.fulfilled ? 'user-logged' : ''}`}>

        {dialogVotacion && <dialog
          className='dialog-votacion '
          open>
          <span onClick={this.handlerVotacion}>&times;</span>
          <p className='intro text-center'>* Módulo de votación presencial, para administradores</p>
          <h4 className='text-center'>Bienvenida/o a la votación de PPUNR</h4>
          <h5 className='text-center'>Ingrese los datos del Votante</h5>
          <label htmlFor='dniP'>DNI</label>
          <input id='dniP' type='text' name='dniP' className='form-control' onChange={(e) => this.setState({ dniP: e.target.value })} />
          <label htmlFor='facultadP'>Facultad</label>
          <select id='facultadP' type='text' name='facultadP' className='form-control' onChange={(e) => this.setState({ facultadP: e.target.value })} >
            <option value=''> --- </option>
            {facultades.map((f) => <option value={f.value}>{f.name}</option>)}
          </select>
          <label htmlFor='claustroP'>Claustro</label>
          <select id='claustroP' type='text' name='claustroP' className='form-control' onChange={(e) => this.setState({ claustroP: e.target.value })} >
            <option value=''> --- </option>
            {claustros.map((c) => <option value={c.value}>{c.name}</option>)}
          </select>
          {dialogMessage && <h5 className='text-danger'>{dialogMessage}</h5>}
          <br />
          <button disabled={(!dniP || !facultadP || !claustroP)} className='btn btn-aceptar' onClick={() => this.checkPadron()}>Aceptar</button>
        </dialog>
        }

        <Anchor id='container'>
          { forum && <BannerListadoTopics
            btnText={forum.config.propuestasAbiertas ? 'Subí tu idea' : undefined}
            btnLink={forum.config.propuestasAbiertas ? '/formulario-idea' : undefined}
            title={texts['foro-titulo']}
            handlerVotacion={((forum && forum.config.votacion && forum.privileges && forum.privileges.canEdit) || (user && user.state && user.state.value && user.state.value.oficialMesa)) && this.handlerVotacion}
            user={user}
            voterInformation={voterInformation} />}

          <div className='container'>
            <div className='row'>
              {/* {config.propuestasVisibles &&
                (config.propuestasAbiertas
                  ? (
                    <div className='notice'>
                      <h1>{config.propuestasTextoAbiertas}</h1>
                    </div>
                  ) : (
                    <div className='notice'>
                      <h1>{config.propuestasTextoCerradas}</h1>
                    </div>
                  )
                )
              }
              {config.votacionVisible &&
                (config.votacionAbierta
                  ? (
                    <div className='notice'>
                      <h1>{config.votacionTextoAbierta}</h1>
                    </div>
                  ) : (
                    <div className='notice'>
                      <h1>{config.votacionTextoCerrada}</h1>
                    </div>
                  )
                )
              } */}
              {forum && <div className='notice'>
                <h1>{ texts['foro-bajada'] }</h1>
              </div>}
            </div>
          </div>

          <div className='container topics-container'>
            <FilterPropuestas
              facultades={this.state.facultades}
              facultad={this.state.facultad}
              claustros={this.state.claustros}
              claustro={this.state.claustro}
              tags={this.state.tags}
              tag={this.state.tag}
              tiposIdea={this.state.tiposIdea}
              tipoIdea={this.state.tipoIdea}
              openVotation
              handleFilter={this.handleFilter}
              handleDefaultFilter={this.handleDefaultFilter}
              clearFilter={this.clearFilter}
              handleRemoveBadge={this.handleRemoveBadge} />

            <div className='row'>
              <div className='col-md-10 offset-md-1'>
                { forum && (forum.config.preVotacion || forum.config.votacion) &&
                <div className='search-proyecto-wrapper'>
                  {/* para esto usamos react-select version 2.4.4 */}
                  <Select
                    value={selectedProyecto}
                    onChange={this.handleSelectedProyecto}
                    options={searchableProyectos}
                    placeholder='Buscá un proyecto por nombre'
                    isSearchable
                    className='search-proyecto-select' />
                  <button onClick={() => this.setState({ selectedProyecto: null })} disabled={!selectedProyecto}>
                    Limpiar filtro
                  </button>
                </div>
              }

                { this.renderSortFilter() }
                {topics && topics.length === 0 && (
                  <div className='empty-msg'>
                    <div className='alert alert-success' role='alert'>
                      No se encontraron propuestas.
                    </div>
                  </div>
                )}
                {topics && (filteredTopics || topics).map((topic) => (
                  <TopicCard
                    key={topic.id}
                    onVote={this.handleVote}
                    onProyectista={this.handleProyectista}
                    forum={forum}
                    topic={topic}
                    facultades={facultades}
                    voterInformation={voterInformation} />
                ))}
                {!filteredTopics && topics && !this.state.noMore && (
                  <div className='more-topics'>
                    <button onClick={this.paginateForward}>Ver Más</button>
                  </div>
                )}
              </div>
            </div>
          </div>
          <Jump goTop={this.goTop} />
          <Footer />
        </Anchor>
      </div>
    )
  }
}

export default userConnector(HomePropuestas)
