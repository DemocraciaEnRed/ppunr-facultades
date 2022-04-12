const debug = require('debug')
const log = debug('democracyos:db-api:agenda')

const utils = require('lib/utils')
const pluck = utils.pluck

const Agenda = require('lib/models').Agenda
const { ObjectID } = require('mongodb')

exports.all = () => {
  log('Getting agenda sorted by datetime')
  return Agenda.find({}).sort({ datetime: 1 })
}

exports.get = (agendaId) => {
  log('Getting agenda sorted by datetime')
  return Agenda.findOne({_id: ObjectID(agendaId)})
}

exports.add = (agenda) => {
  log('Adding to agenda')
  return Agenda.create(agenda)
}

exports.edit = (agenda) => {
  log('Editing agenda')
  return Agenda.findOneAndUpdate({ _id: ObjectID(agenda._id) }, agenda, { new: true })
}

exports.delete = (agendaId) => {
  log('Deleting agenda')
  return Agenda.findOneAndRemove({ _id: ObjectID(agendaId) })
}

exports.attend = (agendaId, user) => {
  log('Attending to event')
  // add to asistentes array the user
  return Agenda.findOneAndUpdate({ _id: ObjectID(agendaId) }, { $push: { asistentes: user } }, { new: true })
}
