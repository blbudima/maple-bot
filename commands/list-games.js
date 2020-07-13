const Discord = require('discord.js');
const Character = require('../models/character');

module.exports = {
  name: 'list-games',
  aliases: ['lg'],
  description: 'List all games recorded with this Discord server.',
  usage: '',
  args: false,
  guildOnly: true,
  execute(message, args) {
    const gamesList = new Map();
    Character.find({ guild: message.guild.id }, (err, characters) => {
      if (err) {
        console.error(err);
        message.reply('there was an error. Please try again!');
      }

      characters.map((char) => {
        if (gamesList.get(char.game) === undefined) {
          gamesList.set(char.game, 1);
        } else {
          gamesList.set(char.game, gamesList.get(char.game) + 1);
        }
      });

      const sortedGamesList = new Map([...gamesList.entries()].sort((a, b) => b[1] - a[1]));

      if (sortedGamesList.size === 0) {
        return message.reply('there are no games registered in this server!');
      }

      const gamesEmbed = new Discord.MessageEmbed()
        .setColor('DARK_VIVID_PINK')
        .setTitle('List of Games:');

      for (const [key, value] of sortedGamesList) {
        if (value === 1) {
          gamesEmbed.addField(key, `${value} total character`, true);
        } else {
          gamesEmbed.addField(key, `${value} total characters`, true);
        }
      }

      message.channel.send(gamesEmbed);
    });
  },
};
