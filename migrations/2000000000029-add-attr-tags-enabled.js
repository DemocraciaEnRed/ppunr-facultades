const config = require('lib/config')

const dbReady = require('lib/models').ready

const Tag = require('lib/models').Tag

/**
 * Make any changes you need to make to the database here
 */
class SaltearPromises { }
exports.up = function up (done) {
  dbReady()
    // update all tags to have enabled = true
    .then(() => {
      console.log(`-- Actualizando tags para que todos tengan enabled = true`)
      return Tag.update({}, { enabled: true }, { multi: true })
    })
    .then(() => {
      done()
    })
    .catch((err) => {
      if (err instanceof SaltearPromises)
        done()
      else{
        console.log('-- Error en migration 2000000000029-add-attr-tags-enabled.js:', err)
        done(err)
      }
    })
}

/**
 * Make any changes that UNDO the up function side effects here (if possible)
 */
exports.down = function down(done) {
  done();
};
