const Discord = require('discord.js');
const Character = require('../models/character');

module.exports = {
  name: 'list-characters',
  aliases: ['lc', 'list-chars'],
  description: 'List all characters for all games within this Discord server.',
  usage: '',
  args: false,
  guildOnly: true,
  cooldown: 10,
  execute(message, args) {
    const gamesList = new Map();
    Character.find({ guild: message.guild.id }, (err, characters) => {
      if (err) {
        console.error(err);
        message.reply('there was an error. Please try again!');
      }

      characters.map((char) => {
        const extractedGames = gamesList.get(char.game.toUpperCase());
        if (extractedGames === undefined) {
          gamesList.set(char.game.toUpperCase(), [
            {
              username: char.username,
              character: char.character,
              description: char.description,
            },
          ]);
        } else {
          extractedGames.push({
            username: char.username,
            character: char.character,
            description: char.description,
          });
          gamesList.set(char.game.toUpperCase(), extractedGames);
        }
      });

      const sortedGamesList = new Map(
        [...gamesList.entries()].sort((a, b) => b[1].length - a[1].length)
      );

      if (sortedGamesList.size === 0) {
        return message.reply('there are no characters registered in this server!');
      }

      for (const [key, value] of sortedGamesList) {
        const charsEmbed = new Discord.MessageEmbed();
        charsEmbed.setTitle(key);
        if (value.length === 1) {
          charsEmbed.setDescription(`${value.length} total character`);
        } else {
          charsEmbed.setDescription(`${value.length} total characters`);
        }

        value.forEach((element) => {
          charsEmbed.setColor('DARK_VIVID_PINK').addFields(
            {
              name: 'Discord',
              value: element.username,
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
        });
        message.channel.send(charsEmbed);
      }
    });
  },
};
