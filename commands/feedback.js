const Discord = require('discord.js');
const mongoose = require('mongoose');
const Feedback = require('../models/feedback');

module.exports = {
  name: 'feedback',
  aliases: ['fb'],
  description:
    'Have any comments or suggestions to improve this bot? This command allows you to offer your feedback.\n\tUnlike other commands, you do NOT have to surround your feedback with double quotations.\n\tMaximum 1000 characters.',
  usage: '<your feedback>',
  guildOnly: true,
  args: true,
  cooldown: 15,
  execute(message, args) {
    let feedbackString = '';
    feedbackString = args.join(' ');

    if (feedbackString.length > 1000) {
      return message.reply('your feedback is too long! Please keep it within 1000 characters.');
    }
    // construct model
    const feedback = new Feedback({
      _id: mongoose.Types.ObjectId(),
      guild: message.guild.name,
      username: message.member.user.username,
      feedback: feedbackString,
    });

    feedback
      .save()
      .then((result) => {
        console.log(result);
        message.reply('thank you for your feedback!');
        const charEmbed = new Discord.MessageEmbed()
          .setColor('DARK_GREEN')
          .setTitle('ADDED:')
          .addFields(
            {
              name: 'Discord',
              value: message.member,
              inline: true,
            },
            {
              name: 'Description',
              value: feedbackString,
              inline: true,
            }
          );
        message.channel.send(charEmbed);
      })
      .catch((err) => {
        console.error(err);
        message.reply('there was an error recording your feedback. Please try again.');
      });
  },
};
