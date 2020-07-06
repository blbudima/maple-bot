// file system
const fs = require("fs");

// require the discord.js module
const Discord = require("discord.js");

// customize bot token and prefix based on config.json
const config = require("./config.json");

console.log("preparing bot...");

// require a new Discord client
const client = new Discord.Client();
client.commands = new Discord.Collection();
client.mongoose = require("./utils/mongoose");

// establish file system
const commandFiles = fs
  .readdirSync("./commands")
  .filter((file) => file.endsWith(".js"));

for (const file of commandFiles) {
  const command = require(`./commands/${file}`);

  // set a new item in the Collection
  // with the key as the command name and the value as the exported module
  client.commands.set(command.name, command);
}

// extract cooldowns
const cooldowns = new Discord.Collection();

// when the client is ready, run this code
// this event will only trigger one time after logging in
client.once("ready", () => {
  console.log("ready!");
});

client.on("message", (message) => {
  // if the message is not a designated command, then ignore
  if (!message.content.startsWith(config.prefix) || message.author.bot) return;

  // extract arguments and command name
  const args = message.content.slice(config.prefix.length).split(/ +/);
  const commandName = args.shift().toLowerCase();

  // extract command from command name
  const command =
    client.commands.get(commandName) ||
    client.commands.find(
      (cmd) => cmd.aliases && cmd.aliases.includes(commandName)
    );

  // check if the command name is valid
  if (!command) return message.reply("that's an invalid command!");

  // check if command is only allowed in servers
  if (command.guildOnly && message.channel.type !== "text") {
    return message.reply(
      "I can't execute that command inside DMs! Please find a proper server to execute that command."
    );
  }

  // check if command requests user arguments
  if (command.args && !args.length) {
    let reply = `You didn't provide any arguments, ${message.author}!`;

    if (command.usage) {
      reply += `\nThe proper usage would be: \`${config.prefix}${command.name} ${command.usage}\``;
    }

    return message.channel.send(reply);
  }

  // ensure cooldown on commands
  if (!cooldowns.has(command.name)) {
    cooldowns.set(command.name, new Discord.Collection());
  }

  const now = Date.now();
  const timestamps = cooldowns.get(command.name);
  const cooldownAmount = (command.cooldown || config.defaultCooldown) * 1000;

  if (timestamps.has(message.author.id)) {
    const expirationTime = timestamps.get(message.author.id) + cooldownAmount;

    if (now < expirationTime) {
      const timeLeft = (expirationTime - now) / 1000;
      return message.reply(
        `please wait ${timeLeft.toFixed(
          1
        )} more second(s) before reusing the \`${command.name}\` command.`
      );
    }
  } else {
    timestamps.set(message.author.id, now);
    setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);
  }

  // attempt to execute the command
  try {
    command.execute(message, args);
  } catch (error) {
    console.error(error);
    message.reply("there was an error trying to execute that command!");
  }
});

// establish connectivity with MongoDB through mongoose
client.mongoose.init();

// login to Discord with your app's token
client.login(config.token);
