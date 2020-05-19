const mongoose = require('mongoose')
const Schema = mongoose.Schema

const FacultadSchema = new Schema({
  nombre: { type: String, required: true, minlength: 1, maxlength: 200 },
  abreviacion: { type: String, required: true, minlength: 1, maxlength: 50 }
}, { id: false })
// esto último hace que no esté el campo _id e id duplicado

FacultadSchema.statics.findByName = function (name, cb) {
  return this.findOne({ name: name }).exec(cb)
}

/**
 * Make Schema `.toObject()` and
 * `.toJSON()` parse getters for
 * proper JSON API response
 */

FacultadSchema.set('toObject', { getters: true })
FacultadSchema.set('toJSON', { getters: true })
/**
 * Expose Model
 */

module.exports = function initialize (conn) {
  // agregamos el tecer argumento sino crea la tabla "facultads" (o sea, con mala terminación)
  return conn.model('Facultad', FacultadSchema, 'facultades')
}
