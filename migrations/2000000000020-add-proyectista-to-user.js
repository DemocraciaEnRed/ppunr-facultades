const dbReady = require('lib/models').ready
const models = require('lib/models')

const nombreMigrationParaLog = 'add proyectista to all users'
const User = models.User

const mapPromises = (fn) => (array) => Promise.all(array.map(fn))
/**
 * Make any changes you need to make to the database here
 */
exports.up = function up (done) {
  // done() devuelve al Migrator de lib/migrations
  
  dbReady()
    .then(() => User.collection
      .find({})
      .toArray()
      .then(mapPromises(function (user) {
        return User.collection.findOneAndUpdate({ _id: user._id }, {
          $set: {
            proyectista: false
          }
        })
      }))
    )
    .then(function (results) {
      const total = results.filter((v) => !!v).length
      console.log(`adding proyectista to users succeded with a total of ${total} users updated.`)
      done()
    })
    .catch(function (err) {
      console.log('adding proyectista to users failed at ', err)
      done(err)
    })
}

/**
 * Make any changes that UNDO the up function side effects here (if possible)
 */
exports.down = function down(done) {
  console.log('update users maxlength has no down migration')
  done();
};
