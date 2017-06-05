var globals = require('./globals.js')

function Member(name) {
  this.name = name;
  this.group = null;
  this.totalSongsOnQueue = 0;
  this.stats = {
    tunes: 0,
    jams: 0,
    bangers: 0
  }

  return this;
}

module.exports = Member;