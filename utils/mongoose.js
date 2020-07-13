const mongoose = require('mongoose');
const config = require('../config.json');

module.exports = {
  init: () => {
    mongoose.connect(
      `mongodb+srv://admin:${config.mongoPW}@maple-bot.dioi4.mongodb.net/${config.mongoDB}?retryWrites=true&w=majority`,
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      }
    );

    mongoose.Promise = global.Promise;

    mongoose.connection.on('connected', () => {
      console.log('mongoose has succesfully connected!');
    });

    mongoose.connection.on('err', (err) => {
      console.error(`there has been an error with mongoose:\n${err}`);
    });

    mongoose.connection.on('disconnected', () => {
      console.warn('mongoose connection lost');
    });
  },
};
