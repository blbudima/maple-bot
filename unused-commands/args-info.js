module.exports = {
  name: "args-info",
  description: "Checks user arguments.",
  args: true,
  execute(message, args) {
    // if (!args.length) {
    //   return message.channel.send(
    //     `You didn't provide any arguments, ${message.author}!`
    //   );
    // } else if (args[0] === "foo") {
    if (args[0] === "foo") {
      return message.channel.send("bar");
    }
    // message.channel.send(`Command name: ${command}\nArguments: ${args}`);
    message.channel.send(`First argument: ${args[0]}`);
  },
};
