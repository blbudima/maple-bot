const Discord = require('discord.js');
const Character = require('../models/character');

module.exports = {
  name: 'show-profile',
  aliases: ['sp'],
  description:
    'Shows the list of characters under a Discord account within this server\n\tIf you do not mention another user with this command, then it will show your own profile.\n\tIf you would like to see the profile of another user, then please mention them alongside the command.',
  usage: '<@username>',
  guildOnly: true,
  execute(message, args) {
    let extractedUser;
    if (!message.mentions.users.size) {
      extractedUser = message.member.user;
    } else {
      if (message.mentions.users.size > 1) {
        return message.reply('you mentioned too many users! Please only mention one.');
      }
      message.mentions.users.map((user) => {
        extractedUser = user;
      });
    }

    const query = Character.where({
      guild: message.guild.id,
      username: extractedUser,
    });
    query.exec((err, docs) => {
      if (err) {
        console.error(err);
        message.reply('there was an error showing the profile. Please try again.');
      } else if (docs.length === 0) {
        message.reply(
          `${extractedUser} does not have any characters registered in this Discord server!`
        );
      } else {
        const profileList = new Map();
        docs.map((char) => {
          const extractedProfile = profileList.get(char.game.toUpperCase());
          if (extractedProfile === undefined) {
            profileList.set(char.game.toUpperCase(), [
              {
                username: char.username,
                character: char.character,
                description: char.description,
              },
            ]);
          } else {
            extractedProfile.push({
              username: char.username,
              character: char.character,
              description: char.description,
            });
            profileList.set(char.game.toUpperCase(), extractedProfile);
          }
        });

        const sortedProfileList = new Map(
          [...profileList.entries()].sort((a, b) => b[1].length - a[1].length)
        );

        const profileEmbed = new Discord.MessageEmbed()
          .setTitle(message.member.user.username)
          .setColor('LUMINOUS_VIVID_PINK')
          .setThumbnail(
            message.author.displayAvatarURL({
              format: 'png',
              dynamic: true,
            })
          );
        if (docs.length === 1) {
          profileEmbed.setDescription(`${docs.length} total character`);
        } else {
          profileEmbed.setDescription(`${docs.length} total characters`);
        }

        if (extractedUser === message.member.user) {
          message.reply("here's your profile!");
        } else {
          message.reply(`here's ${extractedUser}'s profile`);
        }
        message.channel.send(profileEmbed);

        for (const [key, value] of sortedProfileList) {
          const charsEmbed = new Discord.MessageEmbed();
          charsEmbed.setTitle(key);
          charsEmbed.setAuthor(
            `${extractedUser.username}`,
            message.author.displayAvatarURL({
              format: 'png',
              dynamic: true,
            })
          );
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
      }
    });
  },
};
