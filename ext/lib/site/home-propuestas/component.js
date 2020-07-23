import React, { Component } from 'react'
import { browserHistory } from 'react-router'
import config from 'lib/config'
import forumStore from 'lib/stores/forum-store/forum-store'
import topicStore from 'lib/stores/topic-store/topic-store'
import userConnector from 'lib/site/connectors/user'
import tagStore from 'lib/stores/tag-store/tag-store'
import facultadStore from 'lib/stores/facultad-store'
import claustroStore from 'lib/stores/claustro-store'
import TopicCard from './topic-card/component'
import BannerListadoTopics from 'ext/lib/site/banner-listado-topics/component'
import FilterPropuestas from './filter-propuestas/component'
import Jump from 'ext/lib/site/jump-button/component'
import Footer from 'ext/lib/site/footer/component'
import Anchor from 'ext/lib/site/anchor'

// Variables para fases de propuestas abiertas o cerrdas:
// config.propuestasAbiertas
// config.propuestasTextoAbiertas
// config.propuestasTextoCerradas

const defaultValues = {
  limit: 20,
  facultad: [],
  claustro: [],
  tag: [],
  // 'barrio' o 'newest' o 'popular'
  sort: 'newest',
  tipoIdea: 'sistematizada'
}

const filters = {
  popular: {
    text: 'Más Populares',
    sort: 'popular',
  },
  newest: {
    text: 'Más Actualizados',
    sort: 'newest',
  },
}

class HomePropuestas extends Component {
  constructor () {
    super()

    this.state = {
      forum: null,
      topics: null,

      facultades: [],
      facultad: defaultValues.facultad,
      claustros: [],
      claustro: defaultValues.claustro,
      tags: [],
      tag: defaultValues.tag,
      sort: defaultValues.sort,
      tipoIdea: defaultValues.tipoIdea,

      page: null,
      noMore: null
    }

    this.handleInputChange = this.handleInputChange.bind(this)
    this.renderSortFilter = this.renderSortFilter.bind(this)
  }

  componentDidMount () {
    window.scrollTo(0,0)
    if (this.props.location.query.tags)
      defaultValues.tag.push(this.props.location.query.tags)

    // igual que filtros de admin (lib/admin/admin/admin.js)
    Promise.all([
      facultadStore.findAll(),
      claustroStore.findAll(),
      tagStore.findAll({field: 'name'}),
      forumStore.findOneByName('proyectos')
    ]).then(results => {
      const [facultades, claustros, tags, forum] = results
      const tagsMap = tags.map(tag => { return {value: tag.id, name: tag.name}; });
      const tag = this.props.location.query.tags ? [tagsMap.find(j => j.name == this.props.location.query.tags).value] : [];
      this.setState({
        facultades: facultades.map(facultad => { return {value: facultad._id, name: facultad.abreviacion}; }),
        claustros: claustros.map(claustro => { return {value: claustro._id, name: claustro.nombre}; }),
        tags: tagsMap,
        tag,
        forum,
        forumStates: forum.topicsAttrs.find(a => a.name=='state').options
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
      tags: this.state.tags.filter(t => this.state.tag.includes(t.value)).map(t => t.name),
      sort: this.state.sort,
      tipoIdea: this.state.tipoIdea
    }

    let queryString = Object.keys(query)
      .filter((k) => query[k] && query[k].length > 0)
      .map((k) => `${k}=${ Array.isArray(query[k]) ?  query[k].join(',') : query[k] }`)
      .join('&')

    return window
      .fetch(`/ext/api/topics?${queryString}`, {credentials: 'include'})
      .then((res) => res.json())
      .then((res) => {
        const topics = res.results ? res.results.topics : []
        const noMore = res.pagination ? page >= res.pagination.pageCount : true
        // pagination contiene: count, page, pageCount, limit
        this.setState({
          topics: page == 1 ? topics : this.state.topics.concat(topics),
          page: page,
          noMore: noMore
        })
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

  handleVote = (id, isVoted) => {
    const { user } = this.props

    if (user.state.rejected) {
      return browserHistory.push({
        pathname: '/signin',
        query: { ref: window.location.pathname }
      })
    }

    topicStore.vote(id, !isVoted ? 'apoyo-idea' : 'no-apoyo-idea').then((res) => {
      const topics = this.state.topics
      const index = topics.findIndex((t) => t.id === id)
      topics[index] = res
      this.setState({ topics })
    }).catch((err) => { throw err })
  }

  handleRemoveBadge = (option) => (e) => {
    // feísimo, feísimo
    if (this.state.facultad.includes(option)){
      this.setState({ facultad: this.state.facultad.filter(i => i != option) }
      ,() => this.fetchTopics());
    }else if (this.state.claustro.includes(option)){
      this.setState({ claustro: this.state.claustro.filter(i => i != option) }
      ,() => this.fetchTopics());
    }else if (this.state.tag.includes(option)){
      this.setState({ tag: this.state.tag.filter(i => i != option) }
      ,() => this.fetchTopics());
    }
  }

  onChangeSortFilter = (key) => {
    this.setState({ sort: key }, () => this.fetchTopics());
  }

  goTop () {
    Anchor.goTo('container')
  }

  onChangeTipoIdeaFilter = (name) => {
    this.setState({ tipoIdea: name }, () => this.fetchTopics());
  }

  renderSortFilter() {
    return (
      <div>
        <h4 className="topics-title">Lista de ideas</h4>
        <div className='topics-filters'>
          {this.state.forumStates &&
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
          }
          {this.state.topics && this.state.topics.length > 0 &&
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
          }
        </div>
      </div>
    )
  }

  render () {
    console.log('Render main')

    const { forum, topics } = this.state

    return (
      <div className={`ext-home-ideas ${this.props.user.state.fulfilled ? 'user-logged' : ''}`}>
        <Anchor id='container'>
          <BannerListadoTopics
          btnText={config.propuestasAbiertas ? 'Mandá tu idea' : undefined}
          btnLink={config.propuestasAbiertas ? '/formulario-idea' : undefined}
            title='Ideas'
            />

          <div className='container'>
            <div className="row">
              { config.propuestasAbiertas
                ? (
                    <div className='notice'>
                      <h1>{config.propuestasTextoAbiertas}</h1>
                    </div>
                ) : (
                  <div className='notice'>
                    <h1>{config.propuestasTextoCerradas}</h1>
                  </div>
                )
              }
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
              openVotation={true}
              handleFilter={this.handleFilter}
              handleDefaultFilter={this.handleDefaultFilter}
              clearFilter={this.clearFilter}
              handleRemoveBadge={this.handleRemoveBadge} />

            <div className='row'>
              <div className='col-md-10 offset-md-1'>
                {  this.renderSortFilter() }
                {topics && topics.length === 0 && (
                  <div className='empty-msg'>
                    <div className='alert alert-success' role='alert'>
                      No se encontraron propuestas.
                    </div>
                  </div>
                )}
                {topics && topics.map((topic) => (
                  <TopicCard
                    key={topic.id}
                    onVote={this.handleVote}
                    forum={forum}
                    topic={topic} />
                ))}
                {topics && !this.state.noMore && (
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
