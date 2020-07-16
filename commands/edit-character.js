const Discord = require('discord.js');
const Character = require('../models/character');

module.exports = {
  name: 'edit-character',
  aliases: ['ec', 'edit-char'],
  description:
    'Edit the name for a character for a specified game within this Discord server.\n\tThe game is case-insensitive, but the character is case-sensitive.\n\tPlease enclose the game, the character, and your edited character with double quotations.\n\tThe maximum length for a character is 30 characters.',
  usage: '"<game>" "<character>" "<edited character>"',
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

    // extract edited character
    const edited = argList[2];
    if (!edited) {
      return message.reply('Incorrect usage! Please supply your edited character.');
    }
    if (edited.length > 30) {
      return message.reply(
        'your edited character is over 30 characters! Please reduce its length.'
      );
    }

    // construct model
    const query = {
      guild: message.guild.id,
      username: message.member.user,
      game: new RegExp(`\\b${ggame}\\b`, 'i'),
      character: ccharacter,
    };

    Character.find(query, (err, docs) => {
      if (err) {
        console.error(err);
        message.reply('there was an error editing your character. Please try again.');
      } else if (docs.length === 0) {
        message.reply('that character does not exist!');
      } else if (
        docs[0].username.substring(2, docs[0].username.length - 1) != message.member.user.id
      ) {
        message.reply(`that character does not belong to you! It belongs to ${docs[0].username}.`);
        const charEmbed = new Discord.MessageEmbed().setColor('#0099ff').addFields(
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
        Character.findOneAndUpdate(query, { character: edited }, (err, result) => {
          if (err) {
            console.error(err);
            message.reply('there was an error editing your character. Please try again.');
          } else {
            message.reply('I successfully edited your character!');
            const beforeEmbed = new Discord.MessageEmbed()
              .setTitle('BEFORE:')
              .setColor('DARK_RED')
              .addFields(
                {
                  name: 'Discord',
                  value: result.username,
                  inline: true,
                },
                {
                  name: 'Game',
                  value: result.game,
                  inline: true,
                },
                {
                  name: 'Name',
                  value: docs[0].character,
                  inline: true,
                },
                {
                  name: 'Description',
                  value: result.description,
                  inline: true,
                }
              );
            message.channel.send(beforeEmbed);
            const afterEmbed = new Discord.MessageEmbed()
              .setTitle('AFTER:')
              .setColor('DARK_GOLD')
              .addFields(
                {
                  name: 'Discord',
                  value: result.username,
                  inline: true,
                },
                {
                  name: 'Game',
                  value: result.game,
                  inline: true,
                },
                {
                  name: 'Name',
                  value: edited,
                  inline: true,
                },
                {
                  name: 'Description',
                  value: result.description,
                  inline: true,
                }
              );
            message.channel.send(afterEmbed);
          }
        });
      }
    });
  },
};
