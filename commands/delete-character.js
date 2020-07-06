const Character = require("../models/character");
const Discord = require("discord.js");

module.exports = {
  name: "delete-character",
  aliases: ["dc", "delete-char"],
  description:
    "Delete a character for a specified game within this Discord server.\n\tThe game is case-insensitive, but the character is case-sensitive.\n\tPlease enclose the game and the character with double quotations.",
  usage: '"<game>" "<character>"',
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

    // extract game
    const ggame = argList[0];
    if (!ggame) {
      return message.reply(
        "Incorrect usage! Please supply the name of the game."
      );
    }

    // extract character
    const ccharacter = argList[1];
    if (!ccharacter) {
      return message.reply(
        "Incorrect usage! Please supply the name of the character."
      );
    }

    // construct model
    const query = {
      guild: message.guild.id,
      username: message.member.user,
      game: new RegExp("\\b" + ggame + "\\b", "i"),
      character: ccharacter,
    };

    Character.find(query, (err, docs) => {
      if (err) {
        console.error(err);
        message.reply(
          "there was an error deleting your character. Please try again."
        );
      } else if (docs.length === 0) {
        message.reply("that character does not exist!");
      } else if (
        docs[0].username.substring(2, docs[0].username.length - 1) !=
        message.member.user.id
      ) {
        message.reply(
          `that character does not belong to you! It belongs to ${docs[0].username}.`
        );
        const charEmbed = new Discord.MessageEmbed()
          .setColor("#0099ff")
          .addFields(
            {
              name: "Discord",
              value: docs[0].username,
              inline: true,
            },
            {
              name: "Game",
              value: docs[0].game,
              inline: true,
            },
            {
              name: "Name",
              value: docs[0].character,
              inline: true,
            },
            {
              name: "Description",
              value: docs[0].description,
              inline: true,
            }
          );
        message.channel.send(charEmbed);
      } else {
        Character.findOneAndDelete(query, (err, result) => {
          if (err) {
            console.error(err);
            message.reply(
              "there was an error deleting your character. Please try again."
            );
          } else {
            message.reply("I successfully deleted your character!");
            const afterEmbed = new Discord.MessageEmbed()
              .setTitle("DELETED:")
              .setColor("DARK_RED")
              .addFields(
                {
                  name: "Discord",
                  value: result.username,
                  inline: true,
                },
                {
                  name: "Game",
                  value: result.game,
                  inline: true,
                },
                {
                  name: "Name",
                  value: result.character,
                  inline: true,
                },
                {
                  name: "Description",
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
