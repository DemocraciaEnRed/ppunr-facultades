const mongoose = require('mongoose')
const Schema = mongoose.Schema
var regex = require('lib/regexps')

var hexColorValidation = [hexColorValidator, 'Invalid hex color value']
function hexColorValidator (value) {
  return regex.hexColor.test(value)
}

const EjeSchema = new Schema({
  nombre: { type: String, required: true, minlength: 1, maxlength: 200 },
  hash: { type: String, lowercase: true, trim: true, required: true },
  color: { type: String, default: '#091A33', validate: hexColorValidation }
}, { id: false })
// esto último hace que no esté el campo _id e id duplicado

EjeSchema.statics.findByName = function (name, cb) {
  return this.findOne({ name: name }).exec(cb)
}

/**
 * Make Schema `.toObject()` and
 * `.toJSON()` parse getters for
 * proper JSON API response
 */

EjeSchema.set('toObject', { getters: true })
EjeSchema.set('toJSON', { getters: true })
/**
 * Expose Model
 */

module.exports = function initialize (conn) {
  return conn.model('Eje', EjeSchema)
}
