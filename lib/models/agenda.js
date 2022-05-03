const mongoose = require('mongoose')
const Schema = mongoose.Schema

const AgendaSchema = new Schema({
  nombre: { type: String, required: true, minlength: 1, maxlength: 200 },
  descripcion: { type: String, default: '', maxlength: 200 },
  fecha: { type: String, required: true },
  dia: { type: String, required: true },
  mes: { type: String, required: true },
  ano: { type: String, required: true },
  hora: { type: String, required: true },
  datetime: { type: Date, required: true },
  lugar: { type: String, required: true, minlength: 1, maxlength: 200 },
  asistentes: [{ type: Schema.Types.ObjectId, ref: 'User', default: [] }]
}, { id: false })
// esto último hace que no esté el campo _id e id duplicado

AgendaSchema.statics.findByName = function (name, cb) {
  return this.findOne({ name: name }).exec(cb)
}

/**
 * Make Schema `.toObject()` and
 * `.toJSON()` parse getters for
 * proper JSON API response
 */

AgendaSchema.set('toObject', { getters: true })
AgendaSchema.set('toJSON', { getters: true })
/**
 * Expose Model
 */

module.exports = function initialize (conn) {
  return conn.model('Agenda', AgendaSchema)
}
