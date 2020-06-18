var express = require('express')
var urlBuilder = require('lib/url-builder')
var visibility = require('lib/visibility')
var api = require('lib/db-api')
const log = require('debug')('democracyos:site:home-forum')

var app = module.exports = express()

const redirects = [
  {url: '/politecnico', escuelaAbrev: "IPS"},
  {url: '/agrotecnica', escuelaAbrev: "EAC"},
  {url: '/superior-de-comercio', escuelaAbrev: "ESUPCOM"}
]
redirects.forEach(redirect => {
  app.get(redirect.url, function(req, res) {
    api.escuela.all(function (err, objs) {
      if(err) {
        log('Error found: %s', err)
        res.redirect('/');
      }else if (!objs || !objs.length){
        log('No escuelas found')
        res.redirect('/');
      }else {
        const escuela = objs.find(e => e.abreviacion == redirect.escuelaAbrev)
        if (!escuela){
          log('No escuela found with abreviacion %s', redirect.escuelaAbrev)
          res.redirect('/');
        }else{
          log('Redirecting to escuela %j', escuela)
          res.redirect('/propuestas?id=' + escuela._id);
        }
      }
    })
  })
})

app.get(urlBuilder.for('site.forum'), visibility, require('lib/site/layout'))
