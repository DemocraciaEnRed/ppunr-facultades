const express = require('express')
const validate = require('../validate')
var log = require('debug')('democracyos:topic-v2')
const middlewares = require('../middlewares')
const api = require('../db-api')
const apiV1 = require('lib/db-api')
const notifier = require('democracyos-notifier')
const config = require('lib/config')
const urlBuilder = require('lib/url-builder')
const utils = require('lib/utils')
const { ContainerClient, StorageSharedKeyCredential } = require("@azure/storage-blob");
const Base64BufferThumbnail = require('base64-buffer-thumbnail');

const app = module.exports = express.Router()

app.get('/topics',
validate({
  query: Object.assign({}, validate.schemas.pagination, {
    limit: { // disable pagination until is implemented on front-end
      type: 'integer',
      default: 500,
      minimum: 1,
      maximum: 500,
      description: 'amount of results per page'
    },
    page: {
      type: 'integer',
      default: 1,
      minimum: 1,
      description: 'number of page'
    },
    forum: {
      type: 'string',
      required: true,
      format: 'mongo-object-id',
      description: 'id of the Forum to fetch topics from'
    },
    sort: {
      type: 'string',
      enum: ['createdAt', '-createdAt', 'action.count', '-action.count'],
      default: '-createdAt'
    },
    tag: {
      type: 'string'
    },
    draft: {
      type: 'string',
      enum: ['true']
    },
    search: {
      type: 'string'
    },
    facultad: {
      type: 'string',
      format: 'facultad'
    },
    claustro: {
      type: 'string',
      format: 'claustro',
      default: ''
    },
    tema: {
      type: 'string',
      format: 'tema'
    },
    state: {
      type: 'string',
      default: ''
    }
  })
}),
middlewares.forums.findFromQuery,
middlewares.forums.privileges.canView,
function (req, res, next) {
  if (req.query.draft) {
    middlewares.forums.privileges.canChangeTopics(req, res, next)
  } else {
    next()
  }
},
function getTopics (req, res, next) {
  let dbQuery = {
    user: req.user,
    forum: req.forum,
    limit: req.query.limit,
    page: req.query.page,
    tag: req.query.tag,
    sort: req.query.sort,
    draft: !!req.query.draft,
    search: decodeURI(req.query.search),
    facultad: req.query.facultad,
    claustro: req.query.claustro,
    tema: decodeURI(req.query.tema),
    state: req.query.state
  }
  console.log(dbQuery)
  Promise.all([
    api.topics.list(dbQuery).then(topics => apiV1.user.populateOwners(topics)),
    req.query.limit,
    api.topics.listCount({
      forum: req.forum,
      search: decodeURI(req.query.search),
      facultad: req.query.facultad,
      claustro: req.query.claustro,
      state: req.query.state,
      tema: decodeURI(req.query.tema)
    })
  ]).then((results) => {
    res.status(200).json({
      status: 200,
      pagination: {
        count: results[2],
        page: req.query.page,
        pageCount: Math.ceil(results[1] / req.query.limit) || 1,
        limit: req.query.limit
      },
      results: {
        topics: results[0]
      }
    })
  }).catch(next)
})

app.post('/topics/tags',
  middlewares.users.restrict,
  middlewares.forums.findFromQuery,
  middlewares.forums.privileges.canChangeTopics,
  (req, res, next) => {
    api.topics.updateTags({
      forum: req.forum,
      oldTags: req.body.oldTags,
      newTags: req.body.newTags
    })
      .then((result) => res.status(200).end())
      .catch(next)
  })

app.get('/topics/tags',
  middlewares.forums.findFromQuery,
  middlewares.forums.privileges.canView,
  (req, res, next) => {
    api.topics.getTags({
      forum: req.forum,
      sort: req.query.sort,
      limit: req.query.limit,
      page: req.query.page
    })
      .then((result) => res.status(200).json(result))
      .catch(next)
  })

app.get('/topics/find-all-proyectos', (req, res, next) => {
  apiV1.topic.search({'attrs.state': 'proyecto', 'deletedAt': { '$exists': false }, 'publishedAt': { $ne: null }},(err, topics) => res.status(200).json(topics))
})

app.get('/topics/:id',
middlewares.topics.findById,
middlewares.forums.findFromTopic,
middlewares.forums.privileges.canView,
function getTopic (req, res, next) {
  api.topics.get({
    id: req.params.id,
    user: req.user,
    forum: req.forum
  }).then(topic =>
    apiV1.user.populateUser(topic.owner, true).then(() => topic)
  ).then((topic) => {
    res.status(200).json({
      status: 200,
      results: {
        topic: topic
      }
    })
  }).catch(next)
})

app.post('/topics',
middlewares.users.restrict,
middlewares.forums.findFromBody,
middlewares.forums.privileges.canCreateTopics,
middlewares.topics.parseUpdateableKeys,
middlewares.topics.autoPublish,
function postTopics (req, res, next) {
  if (req.forum.config.propuestasAbiertas || req.user.staff || req.forum.hasRole(req.user, 'admin', 'collaborator', 'author')){

    if (req.keysToUpdate['action.method'] === 'poll') req.keysToUpdate['action.options'] = req.body['action.options']

    // if (req.keysToUpdate['attrs.state'] !== 'sistematizada')
    //   delete req.keysToUpdate['attrs.facultad']

    api.topics.create({
      user: req.user,
      forum: req.forum
    }, req.keysToUpdate).then((topic) => {
      res.status(200).json({
        status: 200,
        results: {
          topic: topic
        }
      })
    }).catch(next)

  }else
    res.status(200).json({error: 'Formulario cerrado'})
})

app.put('/topics/:id',
middlewares.users.restrict,
middlewares.topics.findById,
middlewares.forums.findFromTopic,
middlewares.forums.privileges.canCreateTopics,
middlewares.topics.privileges.canEdit,
// validar tags
(req, res, next) => {
  const postedTags = req.body.tags
  apiV1.tag.all((err, tags) => {
    // del post vienen solo los nombre de los tags
    const tagsNames = tags.map(t => t.name)
    const notValidTags = postedTags.filter(postedTag => !tagsNames.includes(postedTag))

    if (notValidTags.length > 0)
      res.status(200).json({
        status: 200,
        error: 'Los siguientes temas son inválidos: ' + notValidTags.join(', ')
      })
    else
      next()
  })
},
middlewares.topics.parseUpdateableKeys,
middlewares.topics.autoPublish,
function putTopics (req, res, next) {
  api.topics.edit({
    id: req.params.id,
    user: req.user,
    forum: req.forum
  }, req.keysToUpdate).then(topic =>
    apiV1.user.populateUser(topic.owner, true).then(() => topic)
  ).then((topic) => {
    const comentarioAdmin = req.body['attrs.admin-comment']

    // si tiene comentario de admin y cambió con respecto al anterior
    if (comentarioAdmin && comentarioAdmin != req.body['admin-comment-original']){
      const topicUrl = utils.buildUrl(config, {
        pathname: urlBuilder.for('site.topic', {
          forum: 'propuestas',
          id: topic.id
        })
      })
      return notifier.now('admin-comment', {
        to: topic.owner.id,
        topicTitle: topic.mediaTitle,
        adminComment: comentarioAdmin,
        topicUrl: topicUrl
      }).catch((err) => { log(err); }).then(() => topic)
    }else
      return topic
  }).then((topic) => {
    res.status(200).json({
      status: 200,
      results: {
        topic: topic
      }
    })
  }).catch(next)
})

app.post('/topics/:id/publish',
middlewares.users.restrict,
middlewares.topics.findById,
middlewares.forums.findFromTopic,
middlewares.forums.privileges.canPublishTopics,
middlewares.topics.privileges.canEdit,
function publishTopic (req, res, next) {
  api.topics.publish({
    id: req.params.id,
    user: req.user,
    forum: req.forum
  }).then((topic) => {
    res.status(200).json({
      status: 200,
      results: {
        topic: topic
      }
    })
  }).catch(next)
})

app.post('/topics/:id/unpublish',
middlewares.users.restrict,
middlewares.topics.findById,
middlewares.forums.findFromTopic,
middlewares.forums.privileges.canPublishTopics,
middlewares.topics.privileges.canEdit,
function unpublishTopic (req, res, next) {
  api.topics.unpublish({
    id: req.params.id,
    user: req.user,
    forum: req.forum
  }).then((topic) => {
    res.status(200).json({
      status: 200,
      results: {
        topic: topic
      }
    })
  }).catch(next)
})

app.get('/topics-years/find-all-deleted-proyectos',
middlewares.users.restrict,
middlewares.forums.findFromQuery,
middlewares.forums.privileges.canCreateTopics,
middlewares.topics.privileges.canDelete,
(req, res, next)=>{
  api.topics.getYearsDeletedTopics().then(results=>res.status(200).json({ status: 200 , results }))
})


app.delete('/topics/:id',
middlewares.users.restrict,
middlewares.topics.findById,
middlewares.forums.findFromTopic,
middlewares.forums.privileges.canCreateTopics,
middlewares.topics.privileges.canDelete,
function deleteTopics (req, res, next) {
  api.topics.destroy({ id: req.params.id })
    .then(() => res.status(200).json({ status: 200 }))
    .catch(next)
})

app.delete('/topics',
middlewares.users.restrict,
middlewares.forums.findFromQuery,
middlewares.forums.privileges.canCreateTopics,
middlewares.topics.privileges.canDelete,
(req, res, next)  =>{
  api.topics.deleteAll({forum: req.forum}).then(results=>res.status(200).json({ status: 200 , results }))

}

)



app.post('/topics/:id/vote',
middlewares.users.restrict,
validate({
  payload: {
    value: {
      type: 'string',
      required: true
    },
    dni: {
      type: 'string',
      required: true
    },
    facultad: {
      type: ['string', 'null'],
      required: false
    },
    claustro: {
      type: ['string', 'null'],
      required: false
    }
  }
}),
middlewares.topics.findById,
middlewares.forums.findFromTopic,
middlewares.topics.privileges.canVote,

function dniIsFullyVoted (req, res, next) {
  // check if the req.body.dni has not voted 3 times
  apiV1.vote.getVotesByDni(req.body.dni).then((votes) => {
    const topicsIds = votes.map(v => v.topic.toString())
    if (votes.length >= 3){
      // return an error
      log('DNI ' + req.body.dni + ' has already voted 3 times')
      return next({ status: 500, code: 'HAS_ALREADY_VOTED_MAX_TIMES' })
    } else if (topicsIds.includes(req.params.id)) {
      // return an error
      log('DNI ' + req.body.dni + ' has already voted this topic')
      return next({ status: 500, code: 'HAS_ALREADY_VOTED_THIS_TOPIC' })
    } else {
      next()
    }
  }).catch(() => {
     // Return a 500
    log('Error getting votes by dni') 
    log(err.message)
    return next({ status: 500, code: 'ERROR_GETTING_VOTES_BY_DNI' })
  })
},

function postTopicVote (req, res, next) {
  api.topics.vote({
    id: req.params.id,
    user: req.user,
    forum: req.forum,
    value: req.body.value,
    dni: req.body.dni,
    facultad: req.body.facultad,
    claustro: req.body.claustro
  }).then(topic =>
    apiV1.user.populateUser(topic.owner, true).then(() => topic)
  ).then((topic) => {
    res.status(200).json({
      status: 200,
      results: {
        topic: topic
      }
    })
  }).catch((err) => {
    // reglas para que devolver errores propios, por ejemplo NOT_VOTED o ALREADY_VOTED
    next(err)
  })
})

app.post('/topics/:id/proyectista',
middlewares.users.restrict,
validate({
  payload: {
    value: {
      type: 'string',
      required: true
    }
  }
}),
middlewares.topics.findById,
middlewares.forums.findFromTopic,
middlewares.topics.privileges.canVote,
function postTopicVote (req, res, next) {
  api.topics.setProyectista(
    req.user,
    req.topic,
    // por ahora no dejames des-hacerce proyectista
    //req.body.value == 'true'
    true
  ).then(topic =>
    apiV1.user.getFullUserById(topic.owner, false).then((user) => {
      topic.owner = user
      return topic
    })
  ).then((topic) => {
    res.status(200).json({
      status: 200,
      results: {
        topic: topic
      }
    })
  })
})

app.post('/topics/uniq-attrs',
middlewares.users.restrict,
function postTopicVote (req, res, next) {
  let attrs = req.body.attrs || []
  log('Requested uniq topic attrs: %o', attrs)

  Promise.all(attrs.map(api.topics.getUniqAttr))
    .then((attrVals) => {
      log('Returnin uniq topic attrs vals: %o', attrVals)
      res.status(200).json({
        status: 200,
        results: {
          attrVals
        }
      })
    }).catch(next)
})

app.post('/topics/:id/photo',
middlewares.users.restrict,
middlewares.topics.findById,
middlewares.forums.findFromTopic,
middlewares.forums.privileges.canCreateTopics,
middlewares.topics.privileges.canEdit,
async function uploadPictureToAzureStorageBlob (req, res, next) {
  const topic = req.topic
  const file = req.body.imagebase64
  // validate the file is a JPEG from the base64
  const matches = file.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/)
  if (!matches || matches.length !== 3) {
    // Wrong base64 format
    return next({ status: 400, code: 'INVALID_FILE' })
  }
  const type = matches[1]
  if (type !== 'image/jpeg') {
    return next({ status: 400, code: 'INVALID_FILE' })
  }
    
  let fileName = `${config.azureStorage.root}/${topic.id}-${Date.now()}`
  let fileNameThumb = `${config.azureStorage.root}/${topic.id}-${Date.now()}-thumbnail`

  try {
    const sharedKeyCredential = new StorageSharedKeyCredential(config.azureStorage.account, config.azureStorage.accessKey);
    const containerClient = new ContainerClient(
    `${config.azureStorage.endpoint}/${config.azureStorage.container}`,
    sharedKeyCredential
    );
    
    if (config.env === 'development'){
      fileName += '-dev.jpg'
      fileNameThumb += '-dev.jpg'
    } else {
      fileName += '.jpg'
      fileNameThumb += '.jpg'
    }
    
    // generate thumbnail
    
    const imageContent = new Buffer.from(matches[2], 'base64')
    const imageThumbnail = await Base64BufferThumbnail(imageContent, {percentage: 25, width: 300, height: 300, responseType: 'buffer', fit: 'cover' });
    
    // const blobName = "newblob" + new Date().getTime();
    const blockBlobClient = containerClient.getBlockBlobClient(fileName);
    const blockBlobClientThumbnail = containerClient.getBlockBlobClient(fileNameThumb);
    // set content type to JPEG
    const contentType = 'image/jpeg'

    log('Uploading file %s to Azure Storage Blob', fileName)
    log('Uploading file %s to Azure Storage Blob', fileNameThumb)
    const uploadBlobResponse = await blockBlobClient.upload(imageContent, Buffer.byteLength(imageContent),{
      blobHTTPHeaders: {
        blobContentType: contentType
      }
    });
    const uploadBlobResponseThumbnail = await blockBlobClientThumbnail.upload(imageThumbnail, Buffer.byteLength(imageThumbnail),{
      blobHTTPHeaders: {
        blobContentType: contentType
      }
    });
    log(`Uploaded block blob ${fileName} successfully`, uploadBlobResponse.requestId);
    log(`Uploaded block blob ${fileNameThumb} successfully`, uploadBlobResponseThumbnail.requestId);
    log(`UploadBlobResponse`, uploadBlobResponse);
    log(`UploadBlobResponse`, uploadBlobResponseThumbnail);
    
    // decode url
    const imageUrl = decodeURIComponent(blockBlobClient.url)
    const imageThumbnailUrl = decodeURIComponent(blockBlobClientThumbnail.url)
  
    req.imageFilename = fileName
    req.imageUrl = imageUrl
    req.imageThumbnailUrl = imageThumbnailUrl
    next()
  } catch (err) {
    log('Error uploading file %s to Azure Storage Blob', fileName)
    log(err.message)
    return next({ status: 500, code: 'UPLOAD_ERROR' })
  }
  // const uploadBlobResponse = await blockBlobClient.uploadStream(
  //   stream,
  //   uploadOptions.bufferSize,
  //   uploadOptions.maxBuffers,
  //   { blobHTTPHeaders: { blobContentType: 'image/jpeg' } }
  // );

},
function addImageUrlToTopicExtra (req, res, next) {
  const image = {
    url: req.imageUrl,
    thumbnailUrl: req.imageThumbnailUrl,
    filename: req.imageFilename
  }
  const topic = req.topic
  if (!topic.extra) {
    topic.extra = {}
    if (!topic.extra.album) {
      topic.extra.album = []
    }
  }
  topic.extra.album.push(image)
  next()
},
function save (req, res, next) {
  // if topic.extra.album doesn't exist, create it
  // add image to album
  log(`Saving image URL to album in topic ${req.topic.id}`)
  // save topic
  api.topics.edit({
    id: req.params.id,
    user: req.user,
    forum: req.forum
  }, {
    extra: req.topic.extra
  }).then(topic =>
    apiV1.user.populateUser(topic.owner, true).then(() => topic)
  ).then((topic) => {
    res.status(200).json({
      status: 200,
      results: {
        image: {
          url: req.imageUrl,
          thumbnailUrl: req.imageThumbnailUrl,
          filename: req.imageFilename
        }
      }
    })
  }).catch(next)
}

)

app.post('/topics/:id/photo/delete',
middlewares.users.restrict,
middlewares.topics.findById,
middlewares.forums.findFromTopic,
middlewares.forums.privileges.canCreateTopics,
middlewares.topics.privileges.canEdit,
function deletePictureFromAlbum (req, res, next) {
  const topic = req.topic
  const filename = req.body.filename
  if (!topic.extra || !topic.extra.album){
    return next({ status: 500, code: 'ERROR_NO_ALBUM' })
  }
  // remove from extra.album the picture with the exact name
  log(`Deleting image from album in topic ${req.topic.id}`)
  log(`Count of images in album before filter: ${topic.extra.album.length}`)
  const image = topic.extra.album.find(image => image.filename === filename)
  if (!image){
    return next({ status: 500, code: 'ERROR_NO_IMAGE' })
  }
  topic.extra.album = topic.extra.album.filter(image => image.filename !== filename)
  log(`Count of images in album after filter: ${topic.extra.album.length}`)
  req.removedImage = image
  next()
},
function save (req, res, next) {
  // if topic.extra.album doesn't exist, create it
  // add image to album
  log(`Saving image URL to album in topic ${req.topic.id}`)
  log(`Count of images in album after filter: ${req.topic.extra.album.length}`)
  api.topics.edit({
    id: req.params.id,
    user: req.user,
    forum: req.forum
  }, {
    extra: req.topic.extra
  }).then(topic =>
    apiV1.user.populateUser(topic.owner, true).then(() => topic)
  ).then((topic) => {
    next()
  }).catch(next)
},
async function deleteFromAzureStorage(req,res,next){
  const sharedKeyCredential = new StorageSharedKeyCredential(config.azureStorage.account, config.azureStorage.accessKey);
  const containerClient = new ContainerClient(
  `${config.azureStorage.endpoint}/${config.azureStorage.container}`,
  sharedKeyCredential
  );
  let fileName = `${req.removedImage.filename}`

  let fileNameThumb = `${req.removedImage.filename}`
  if (config.env === 'development'){
    fileNameThumb = fileName.replace(/-dev.jpg$/, '-thumbnail-dev.jpg')
  } else {
    fileNameThumb = fileName.replace(/.jpg$/, '-thumbnail.jpg')
  }
  const blockBlobClient = containerClient.getBlockBlobClient(fileName);
  const blockBlobClientThumbnail = containerClient.getBlockBlobClient(fileNameThumb);
  log('Deleting file %s to Azure Storage Blob', fileName)
  try {
    const deleteBlobResponse = await blockBlobClient.delete();
    log(`Deleted block blob ${fileName} successfully`, deleteBlobResponse.requestId);
    const deleteBlobResponseThumbnail = await blockBlobClientThumbnail.delete();
    log(`Deleted block blob ${fileNameThumb} successfully`, deleteBlobResponseThumbnail.requestId);
    log(`UploadBlobResponse`, deleteBlobResponse);
    log(`UploadBlobResponse`, deleteBlobResponseThumbnail);
  }
  catch (err) {
    log('Error deleting file %s from Azure Storage Blob', fileName)
    log(err.message)
    return next({ status: 500, code: 'DELETE_ERROR' })
  }
  res.status(200).json({
    status: 200,
    results: {
      image: {
        url: req.removedImage.url,
        thumbnailUrl: req.removedImage.thumbnailUrl,
        filename: req.removedImage.filename
      }
    }
  })
  // log('Deleting file %s to Azure Storage Blob', fileNameThumb)
  // log(`Deleting block blob ${req.body.filename} from Azure Storage Blob`)
  // blockBlobClient.delete().then(() => {
  //   log(`Deleted block blob ${req.body.filename} successfully`);
  //   log(`Deleting block blob ${req.body.filenameThumb} from Azure Storage Blob`)
  //   blockBlobClientThumbnail.delete().then(() => {
  //     log(`Deleted block blob ${req.body.filenameThumb} successfully`);
  //     next()
  //   }).catch(next)
  // }
  // ).catch(next)
}
)