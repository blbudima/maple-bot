const Character = require("../models/character");
const Discord = require("discord.js");

module.exports = {
  name: "list-characters-for-game",
  aliases: ["lcfg", "list-chars-for-game"],
  description:
    "List all characters for a specific game within this Discord server.\n\tCase-insensitive.\n\tPlease enclose the game with double quotations.",
  usage: "<game>",
  args: true,
  guildOnly: true,
  cooldown: 3,
  execute(message, args) {
    // parse user arguments
    const re = /"(.*?)"/g;
    const argResult = [];
    let current;
    while ((current = re.exec(message))) {
      argResult.push(current.pop());
    }
    const argList = argResult;

    // extract game
    const ggame = argList[0];
    if (!ggame) {
      return message.reply(
        "Incorrect usage! Please supply the name of the game."
      );
    }

    const charList = [];
    Character.find({ guild: message.guild.id }, (err, characters) => {
      if (err) {
        console.error(err);
        message.reply("there was an error. Please try again!");
      }

      characters.map((char) => {
        if (char.game.toLowerCase() === ggame.toLowerCase()) {
          charList.push(char);
        }
      });

      if (charList.length === 0) {
        message.reply("there are no characters for your game!");
      } else {
        const charsEmbed = new Discord.MessageEmbed();

        charsEmbed.setTitle(charList[0].game.toUpperCase());

        if (charList.length === 1) {
          charsEmbed.setDescription(`${charList.length} total character`);
        } else {
          charsEmbed.setDescription(`${charList.length} total characters`);
        }

        charList.forEach((element) => {
          charsEmbed.setColor("DARK_VIVID_PINK").addFields(
            {
              name: "Discord",
              value: element.username,
              inline: true,
            },
            {
              name: "Name",
              value: element.character,
              inline: true,
            },
            {
              name: "Description",
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
