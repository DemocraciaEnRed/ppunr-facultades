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

exports.sumAttendiesInAgenda = () => {
  // Count all the items in topic.proyectistas array and sum the total in all the topics not deleted
  log('Counting asistentes in topics not deleted')
  return Agenda.aggregate([
    { $unwind: '$asistentes' },
    { $group: { _id: '#asistentes', total: { $sum: 1 } } }
  ]).then(res => {
    if (!res[0]) return 0
    return res[0].total
  })
}
