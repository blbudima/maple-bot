const Discord = require('discord.js');
const Character = require('../models/character');

module.exports = {
  name: 'find-character-for-game',
  aliases: ['fcfg', 'find-char-for-game'],
  description:
    'Find a character for a specific game within this Discord server.\n\tCase-insensitive.\n\tPlease enclose the game and the character with double quotations.',
  usage: '"<game>" "<character>"',
  args: true,
  guildOnly: true,
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
      return message.reply('Incorrect usage! Please supply the name of the game.');
    }

    // extract character
    const ccharacter = argList[1];
    if (!ccharacter) {
      return message.reply('Incorrect usage! Please supply the name of the character.');
    }

    // construct model
    const query = Character.where({
      guild: message.guild.id,
      game: new RegExp(`\\b${ggame}\\b`, 'i'),
      character: new RegExp(`\\b${ccharacter}\\b`, 'i'),
    });

    // execute model
    query.exec((err, docs) => {
      if (err) {
        console.error(err);
        message.reply('there was an error. Please try again!');
      }
      if (docs.length === 0) {
        message.reply("that character doesn't exist!");
      } else {
        message.reply(`here is the profile(s) for ${ccharacter}.`);
        docs.array.forEach((element) => {
          const charEmbed = new Discord.MessageEmbed().setColor('DARK_GREY').addFields(
            {
              name: 'Discord',
              value: element.username,
              inline: true,
            },
            {
              name: 'Game',
              value: element.game,
              inline: true,
            },
            {
              name: 'Name',
              value: element.character,
              inline: true,
            },
            {
              name: 'Description',
              value: element.description,
              inline: true,
            }
          );
          message.channel.send(charEmbed);
        });
      }
    });
  },
};
