const Discord = require('discord.js');
const mongoose = require('mongoose');
const Character = require('../models/character');

module.exports = {
  name: 'add-character',
  aliases: ['ac', 'add-char'],
  description:
    'Add a character within this Discord server.\n\tPlease enclose the game, the character, and the description with double quotations.\n\tThe description is optional.\n\tThe maximum length for a game is 30 characters.\n\tThe maximum length for a character is 30 characters.\n\tThe maximum length for a description is 300 characters.',
  usage: '"<game>" "<character>" "[description]"',
  args: true,
  guildOnly: true,
  cooldown: 2,
  execute(message, args) {
    // parse user arguments
    const re = /"(.*?)"/g;
    const argResult = [];
    let current = re.exec(message);
    while (current) {
      argResult.push(current.pop());
      current = re.exec(message);
    }
    const argList = argResult;

    // extract game
    const ggame = argList[0];
    if (!ggame) {
      return message.reply('incorrect usage! Please supply the name of the game.');
    }
    if (ggame.length > 30) {
      return message.reply('your inputted game is over 30 characters! Please reduce its length.');
    }

    // extract character
    const ccharacter = argList[1];
    if (!ccharacter) {
      return message.reply('incorrect usage! Please supply the name of the character.');
    }
    if (ccharacter.length > 30) {
      return message.reply(
        'your inputted character is over 30 characters! Please reduce its length.'
      );
    }

    // extract description
    let ddescription = argList[2];
    if (!ddescription) {
      ddescription = 'N/A';
    } else if (ddescription.length > 300) {
      return message.reply(
        'your inputted description is over 300 characters! Please reduce its length.'
      );
    }

    // check if character exists
    const query = Character.where({
      guild: message.guild.id,
      game: new RegExp(`\\b${ggame}\\b`, 'i'),
      character: ccharacter,
    });

    query.exec((err, docs) => {
      if (err) {
        console.error(err);
      }
      if (docs.length >= 1) {
        message.reply(`a character with the same name for ${ggame} already exists!`);
        const charEmbed = new Discord.MessageEmbed().setColor('DARK_GOLD').addFields(
          {
            name: 'Discord',
            value: docs[0].username,
            inline: true,
          },
          {
            name: 'Game',
            value: docs[0].game,
            inline: true,
          },
          {
            name: 'Name',
            value: docs[0].character,
            inline: true,
          },
          {
            name: 'Description',
            value: docs[0].description,
            inline: true,
          }
        );
        message.channel.send(charEmbed);
      } else {
        // construct model
        const character = new Character({
          _id: mongoose.Types.ObjectId(),
          guild: message.guild.id,
          username: message.member.user,
          game: ggame,
          character: ccharacter,
          description: ddescription,
        });

        // insert model
        character
          .save()
          .then((result) => {
            console.log(result);
            message.reply('I have added your new character!');
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
                  name: 'Game',
                  value: ggame,
                  inline: true,
                },
                {
                  name: 'Name',
                  value: ccharacter,
                  inline: true,
                },
                {
                  name: 'Description',
                  value: ddescription,
                  inline: true,
                }
              );
            message.channel.send(charEmbed);
          })
          .catch((err) => {
            console.error(err);
            message.reply('there was an error adding your character. Please try again.');
          });
      }
    });
  },
};
