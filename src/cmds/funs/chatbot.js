const Commando = require("discord.js-commando");
const fetch = require("node-fetch");
const utf8 = require("utf8");

const userBlacklist = require("../../../user-blacklist.json");

module.exports = class chatCommand extends Commando.Command {
  constructor(client) {
    super(client, {
      name: "chatbot",
      aliases: ["cb", "c", "chat"],
      group: "funs",
      memberName: "chatbot",
      argsType: "single",
      description: "Chat with a dumb self.",
      format: "<input>",
      examples: ["chatbot How are you?"],
    });
  }

  async run(message, args) {
    if (userBlacklist.indexOf(message.author.id) !== -1)
      return message.reply(
        "You are blacklisted from using this functionality. For that, your message won't be accepted."
      );

    const input = encodeURIComponent(args);
    if (!input) {
      message.channel.send("You ain't gonna reply to me?");
      return;
    }

    message.channel.startTyping();
    const response = await fetch(
      utf8.encode(
        `http://api.brainshop.ai/get?bid=${process.env.BRAINSHOP_BRAIN_ID}&key=${process.env.BRAINSHOP_API_KEY}&uid=${message.author.id}&msg=${input}`
      )
    );
    const json = await response.json();
    message.channel.send(json.cnt.toLowerCase());
    return message.channel.stopTyping(true);
  }
};