const mongoose = require('mongoose')
const Schema = mongoose.Schema

const ClaustroSchema = new Schema({
  nombre: { type: String, required: true, minlength: 1, maxlength: 200 }
}, { id: false })
// esto último hace que no esté el campo _id e id duplicado

ClaustroSchema.statics.findByName = function (name, cb) {
  return this.findOne({ name: name }).exec(cb)
}

/**
 * Make Schema `.toObject()` and
 * `.toJSON()` parse getters for
 * proper JSON API response
 */

ClaustroSchema.set('toObject', { getters: true })
ClaustroSchema.set('toJSON', { getters: true })
/**
 * Expose Model
 */

module.exports = function initialize (conn) {
  return conn.model('Claustro', ClaustroSchema)
}
