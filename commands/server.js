module.exports = {
  name: 'server',
  description: 'Prints server name and number of members.',
  execute(message, args) {
    message.channel.send(
      `This server's name is: ${message.guild.name}\nTotal members: ${message.guild.memberCount}`
    );
  },
};
