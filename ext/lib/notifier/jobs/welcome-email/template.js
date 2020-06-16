const config = require('lib/config')
const utils = require('lib/utils')

const html = require('es6-string-html-template').html
const raw = require('es6-string-html-template').raw
// para inline-ar estilos css - https://github.com/Automattic/juice
const juice = require('juice');

const emailTemplate = require('ext/lib/notifier/responsive-html-email-template');
const buttonTemplate = require('ext/lib/notifier/responsize-email-button-template');

const baseUrl = utils.buildUrl(config)

module.exports = ({
  userName,
  validateUrl
}) => emailTemplate({
  body: html`
    <p>Hola <strong>${userName}</strong>,</p>
    <p>Hacé click acá para validar tu usuario y terminar de registrarte:</p>
    ${buttonTemplate({
      url: validateUrl,
      text: 'Validá tu cuenta'
    })}
    <p>Podrás subir tus ideas, colaborar en las de otras personas y debatir con el resto de la comunidad sobre otras ideas subidas para el PPUNR.</p>
    <p>Te invitamos a que participes en el <a href="${baseUrl}/propuestas" target="_blank">Foro de Ideas</a> para imaginar y construir, juntos y juntas, la Universidad que queremos.</p>
    <p>Muchas gracias.</p>
    <p><i>PD: si no te diste de alta en <a href="${baseUrl}" target="_blank">${baseUrl}</a> podés ignorar este correo.</i></p>
  `
})
