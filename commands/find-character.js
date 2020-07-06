const Character = require("../models/character");
const Discord = require("discord.js");

module.exports = {
  name: "find-character",
  aliases: ["fc", "find-char"],
  description:
    "Find a character for any game within this Discord server.\n\tCase-insensitive.\n\tPlease enclose the character with double quotations.",
  usage: '"<character>"',
  args: true,
  guildOnly: true,
  execute(message, args) {
    // parse user arguments
    const re = /"(.*?)"/g;
    const argResult = [];
    let current;
    while ((current = re.exec(message))) {
      argResult.push(current.pop());
    }
    const argList = argResult;

    // extract character
    const ccharacter = argList[0];
    if (!ccharacter) {
      return message.reply(
        "Incorrect usage! Please supply the name of the character."
      );
    }

    // construct model
    const query = Character.where({
      guild: message.guild.id,
      character: new RegExp("\\b" + ccharacter + "\\b", "i"),
    });

    // execute model
    query.exec((err, docs) => {
      if (err) {
        console.error(err);
        message.reply("there was an error. Please try again!");
      }
      if (docs.length === 0) {
        message.reply("that character doesn't exist!");
      } else {
        message.reply(`here is the profile(s) for ${ccharacter}.`);
        docs.forEach((element) => {
          const charEmbed = new Discord.MessageEmbed()
            .setColor("DARK_GREY")
            .addFields(
              {
                name: "Discord",
                value: element.username,
                inline: true,
              },
              {
                name: "Game",
                value: element.game,
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
          message.channel.send(charEmbed);
        });
      }
    });
  },
};
