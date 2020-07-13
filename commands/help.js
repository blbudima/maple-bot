const config = require('../config.json');

module.exports = {
  name: 'help',
  description:
    'Send info about me and all of my commands, or request info about a specific command.',
  aliases: ['commands'],
  usage: '<command name>',
  cooldown: 2,
  execute(message, args) {
    const data = [];
    const { commands } = message.client;

    if (!args.length) {
      data.push(
        `Hello! I am a bot designed to help friends keep track of friends. You can use my commands to create a profile of characters for yourself, and other people can search you up!\nUse \`${config.prefix}ac\` to get started.\nHave any feedback? Use \`${config.prefix}feedback\`\n!`
      );
      data.push("Here's a list of all my commands:");
      data.push(commands.map((command) => command.name).join(', '));
      data.push(
        `\nYou can send \`${config.prefix}help [command name]\` to get info on a specific command!`
      );

      return message.author
        .send(data, { split: true })
        .then(() => {
          if (message.channel.type === 'dm') return;
          message.reply("I've sent you a DM with all my commands!");
        })
        .catch((error) => {
          console.error(`Could not send help DM to ${message.author.tag}.\n`, error);
          message.reply("it seems like I can't DM you! Do you have DMs disabled?");
        });
    }

    const name = args[0].toLowerCase();
    const command =
      commands.get(name) || commands.find((c) => c.aliases && c.aliases.includes(name));
    if (!command) {
      return message.reply("that's not a valid command!");
    }

    data.push(`**Name:** ${command.name}`);

    if (command.aliases) {
      data.push(`**Aliases:** ${command.aliases.join(', ')}`);
    }
    if (command.description) {
      data.push(`**Description:** ${command.description}`);
    }
    if (command.usage) {
      data.push(`**Usage:** \`${config.prefix}${command.name} ${command.usage}\``);
    }

    data.push(`**Cooldown:** ${command.cooldown || config.defaultCooldown} second(s)`);

    message.channel.send(data, { split: true });
  },
};
