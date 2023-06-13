import bus from 'bus'
import React from 'react'
import { render } from 'react-dom'
import page from 'page'
import dom from 'component-dom'
import config from 'lib/config'
import urlBuilder from 'lib/url-builder'
import Sidebar from '../admin-sidebar/admin-sidebar'
import TopicsListView from '../admin-topics/view'
import TopicForm from '../admin-topics-form/view'
import TagsList from '../admin-tags/view'
import TagForm from '../admin-tags-form/view'
import AdminComments from '../admin-comments/component'
import AdminProyectistas from '../admin-proyectistas/component'
import AdminAgenda from '../admin-agenda/component'
import AdminPadron from '../admin-padron/component'
import AdminStats from '../admin-stats/component'
import ModerateTags from '../admin-tags-moderation/component'
import user from '../../user/user'
import { domRender } from '../../render/render'
import title from '../../title/title'
import topicStore from '../../stores/topic-store/topic-store'
import tagStore from 'lib/stores/tag-store/tag-store'
import facultadStore from 'lib/stores/facultad-store'
import claustroStore from 'lib/stores/claustro-store'
import { loadCurrentForum } from '../../forum/forum'
import AdminPermissions from '../admin-permissions/admin-permissions'
import { findPrivateTopics,
         findTopic,
         findUniqTopicAttrs } from '../../middlewares/topic-middlewares/topic-middlewares'
import { findAllTags,
         findTag,
         clearTagStore } from '../../middlewares/tag-middlewares/tag-middlewares'
import { privileges } from '../../middlewares/forum-middlewares/forum-middlewares'
import template from './admin-container.jade'
import ContenidoPortada from '../admin-contenido-portada/view'
import AboutUs from '../admin-about-us/view'
import AdminSettings from '../admin-settings-stage/view'

page(
  [
    urlBuilder.for('admin'),
    urlBuilder.for('admin.section'),
    urlBuilder.for('admin.section.wild')
  ],
  user.required,
  loadCurrentForum,
  hasAccessToForumAdmin,
  (ctx, next) => {
    const section = ctx.section = ctx.params.section
    const container = domRender(template)

    // prepare wrapper and container
    dom('#content').empty().append(container)

    // set active section on sidebar
    ctx.sidebar = new Sidebar(ctx.forum)
    ctx.sidebar.set(section)
    ctx.sidebar.appendTo(dom('.sidebar-container', container)[0])

    // Set page's title
    title()

    // if all good, then jump to section route handler
    next()
  }
)

page(urlBuilder.for('admin'), (ctx) => {
  page.redirect(urlBuilder.for('admin.topics', { forum: ctx.forum.name }))
})

page(
  urlBuilder.for('admin.topics'),
  privileges('canChangeTopics'),
  findPrivateTopics,
  // cargamos facultades, claustros y tags en ctx.uniqAttrs para los filtros
  (ctx, next) => {
    // copiado de filtros de foros (ext/lib/site/home-propuestas/component.js)
    Promise.all([
      facultadStore.findAll(),
      claustroStore.findAll(),
      tagStore.findAll({field: 'name'}),
    ]).then(results => {
      const [facultades, claustros, tags] = results
      ctx.uniqAttrs = {
        facultades: facultades.map(facultad => { return {value: facultad._id, name: facultad.abreviacion}; }),
        claustros: claustros.map(claustro => { return {value: claustro._id, name: claustro.nombre}; }),
        tags: tags.map(tag => { return {value: tag.id, name: tag.name}; })
      }
      next()
    }).catch((err) => {
      if (err.status !== 404) throw err
      log('Unable to load facultades, claustros and tags.')
    })
  },
  (ctx) => {
    let currentPath = ctx.path
    let topicsList = new TopicsListView(ctx.topics, ctx.forum, ctx.pagination, ctx.uniqAttrs)
    topicsList.replace('.admin-content')
    ctx.sidebar.set('topics')

    ctx.onTopicsUpdate = () => { page(currentPath) }
    bus.once('topic-store:update:all', ctx.onTopicsUpdate)
})

page.exit(urlBuilder.for('admin.topics'), (ctx, next) => {
  bus.off('topic-store:update:all', ctx.onTopicsUpdate)
  next()
})

page(urlBuilder.for('admin.topics.create'), privileges('canCreateTopics'), clearTagStore, findAllTags, (ctx) => {
  ctx.sidebar.set('topics')
  // render new topic form
  let form = new TopicForm(null, ctx.forum, ctx.tags, config.enableUploadPictures)
  form.replace('.admin-content')
  form.once('success', function () {
    topicStore.findAll({forum: ctx.forum.id})
  })
})

page(urlBuilder.for('admin.topics.id'), privileges('canCreateTopics'), clearTagStore, findAllTags, findTopic, (ctx) => {
  // force section for edit
  // as part of list
  ctx.sidebar.set('topics')

  let form = new TopicForm(ctx.topic, ctx.forum, ctx.tags, config.enableUploadPictures)
  form.replace('.admin-content')
  form.on('success', function () {
    topicStore.clear()
  })
})

page(urlBuilder.for('admin.tags'), privileges('canEdit'), clearTagStore, findAllTags, (ctx) => {
  const tagsList = new TagsList({
    forum: ctx.forum,
    tags: ctx.tags
  })

  tagsList.replace('.admin-content')
  ctx.sidebar.set('tags')
})

page(urlBuilder.for('admin.tags.create'), privileges('canEdit'), (ctx) => {
  let form = new TagForm()
  form.replace('.admin-content')
  ctx.sidebar.set('tags')
})

page(urlBuilder.for('admin.tags.id'), privileges('canEdit'), findTag, (ctx) => {
  // force section for edit
  // as part of list
  ctx.sidebar.set('tags')

  // render topic form for edition
  let form = new TagForm(ctx.tag)
  form.replace('.admin-content')
})

page(urlBuilder.for('admin.permissions'), privileges('canEdit'), (ctx) => {
  const content = document.querySelector('.admin-content')

  ctx.view = new AdminPermissions({
    container: content,
    forum: ctx.forum
  })

  ctx.sidebar.set('permissions')
})

if (config.usersWhitelist) {
  require('../admin-whitelists/admin-whitelists')
  require('../admin-whitelists-form/admin-whitelists-form')
}

page(urlBuilder.for('admin.comments'), (ctx) => {
  ctx.sidebar.set('comments')
  render(<AdminComments forum={ctx.forum} />, document.querySelector('.admin-content'))
})

page(
  urlBuilder.for('admin.padron'),
  (ctx, next) => {
    // copiado de filtros de foros (ext/lib/site/home-propuestas/component.js)
    Promise.all([
      facultadStore.findAll(),
      claustroStore.findAll()
    ]).then(results => {
      const [facultades, claustros] = results
      ctx.uniqAttrs = {
        facultades: facultades.map(facultad => { return { value: facultad._id, name: facultad.nombre, abreviacion: facultad.abreviacion  }; }),
        claustros: claustros.map(claustro => { return { value: claustro._id, name: claustro.nombre }; }),
      }
      next()
    }).catch((err) => {
      if (err.status !== 404) throw err
      log('Unable to load escuelas, claustros.')
    })
  },
  (ctx) => {
    ctx.sidebar.set('padron')
    render(<AdminPadron forum={ctx.forum} facultades={ctx.uniqAttrs.facultades} claustros={ctx.uniqAttrs.claustros} />, document.querySelector('.admin-content'))
})

page(urlBuilder.for('admin.proyectistas'), (ctx) => {
  ctx.sidebar.set('proyectistas')
  render(<AdminProyectistas forum={ctx.forum} />, document.querySelector('.admin-content'))
})

page(urlBuilder.for('admin.agenda'), (ctx) => {
  ctx.sidebar.set('agenda')
  render(<AdminAgenda forum={ctx.forum} />, document.querySelector('.admin-content'))
})

page(urlBuilder.for('admin.stats'), (ctx) => {
  ctx.sidebar.set('stats')
  render(<AdminStats forum={ctx.forum} />, document.querySelector('.admin-content'))
})

page(urlBuilder.for('admin.tags-moderation'), (ctx) => {
  ctx.sidebar.set('tags-moderation')
  render(<ModerateTags forum={ctx.forum} />, document.querySelector('.admin-content'))
})

function hasAccessToForumAdmin (ctx, next) {
  if (ctx.forum && (ctx.forum.privileges.canChangeTopics || ctx.forum.privileges.canCreateTopics)) return next()
  page.redirect('/')
}


page(
  urlBuilder.for('admin.about-us'),
  (ctx) => {
    const settingsStage = new AboutUs(ctx.forum)
    settingsStage.replace('.admin-content')
    ctx.sidebar.set('about-us')
  }
)

page(
  urlBuilder.for('admin.contenido-portada'),
  (ctx, next) => {
    // copiado de filtros de foros (ext/lib/site/home-propuestas/component.js)
    Promise.all([
      facultadStore.findAll(),
      claustroStore.findAll()
    ]).then(results => {
      const [facultades, claustros] = results
      ctx.uniqAttrs = {
        facultades: facultades.map(facultad => { return { value: facultad._id, name: facultad.abreviacion }; }),
        claustros: claustros.map(claustro => { return { value: claustro._id, name: claustro.nombre }; })
      }
      next()
    }).catch((err) => {
      if (err.status !== 404) throw err
      log('Unable to load claustros.')
    })
  },
  (ctx) => {
    const contenidoPortada = new ContenidoPortada(ctx.uniqAttrs.facultades, ctx.uniqAttrs.claustros)
    contenidoPortada.replace('.admin-content')
    ctx.sidebar.set('contenido-portada')
})

page(
  urlBuilder.for('admin.settings-stage'),
  (ctx) => {
    const settingsStage = new AdminSettings(ctx.forum)
    settingsStage.replace('.admin-content')
    ctx.sidebar.set('settings-stage')
    /* render(<AdminSettings forum={ctx.forum} />, document.querySelector('.admin-content')) */
  }
)