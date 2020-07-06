const mongoose = require("mongoose");

const feedbackSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  guild: String,
  username: String,
  feedback: String,
});

mongoose.set("useFindAndModify", false);

module.exports = mongoose.model("Feedback", feedbackSchema);
