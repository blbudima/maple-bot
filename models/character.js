const mongoose = require('mongoose');

const characterSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  guild: String,
  username: String,
  game: String,
  character: String,
  description: String,
});

mongoose.set('useFindAndModify', false);

module.exports = mongoose.model('Character', characterSchema);
