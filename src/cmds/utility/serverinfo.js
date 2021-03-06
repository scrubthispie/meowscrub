const Commando = require("discord.js-commando");
const Discord = require("discord.js");
const moment = require("moment");

const { embedcolor } = require("../../assets/json/colors.json");

module.exports = class ServerInfoCommand extends Commando.Command {
  constructor(client) {
    super(client, {
      name: "serverinfo",
      aliases: ["guildinfo", "svinfo"],
      group: "utility",
      memberName: "serverinfo",
      description: "Shows some informations about this very guild.",
      clientPermissions: ["EMBED_LINKS"],
      throttling: {
        usages: 1,
        duration: 5,
      },
      guildOnly: true,
    });
  }

  async run(message) {
    const dateTimeOptions = {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
      timeZoneName: "short",
    };

    const serverOwner = await this.client.users.fetch(message.guild.ownerID);

    const createdAt = new Date(message.guild.createdAt).toLocaleDateString(
      "en-US",
      dateTimeOptions
    );

    const createdAtFromNow = moment(message.guild.createdAt).fromNow();

    const allRoles = (message.guild.roles.cache.size - 1).toLocaleString();

    const allEmojis = message.guild.emojis.cache.size.toLocaleString();

    const allBoosts = message.guild.premiumSubscriptionCount.toLocaleString();

    const serverTier = message.guild.premiumTier.toLocaleString();

    const memberCount = (
      message.guild.memberCount -
      message.guild.members.cache.filter((m) => m.user.bot).size
    ).toLocaleString();

    const botCount = message.guild.members.cache
      .filter((m) => m.user.bot)
      .size.toLocaleString();

    const maximumMembers = message.guild.maximumMembers.toLocaleString();

    const guildDescription = message.guild.description
      ? `${message.guild.description}`
      : "None";

    const rulesChannel = message.guild.rulesChannelID
      ? `#${
          message.guild.channels.cache.get(message.guild.rulesChannelID).name
        }`
      : "None";

    const systemChannel = message.guild.systemChannelID
      ? `#${
          message.guild.channels.cache.get(message.guild.systemChannelID).name
        }`
      : "None";

    const textChannels = message.guild.channels.cache.filter(
      (channel) => channel.type == "text"
    ).size;

    const voiceChannels = message.guild.channels.cache.filter(
      (channel) => channel.type == "voice"
    ).size;

    const parentChannels = message.guild.channels.cache.filter(
      (channel) => channel.type == "category"
    ).size;

    const newsChannels = message.guild.channels.cache.filter(
      (channel) => channel.type == "news"
    ).size;

    let afkChannel = "";
    let afkTimeout = "";
    if (message.guild.afkChannelID) {
      afkChannel = `"${
        message.guild.channels.cache.get(message.guild.afkChannelID).name
      }"`;
      afkTimeout = ` - ${message.guild.afkTimeout}s Timeout`;
    } else if (!message.guild.afkChannelID) {
      afkChannel = "None";
    }

    const defaultMsgNotif = message.guild.defaultMessageNotifications
      .replace("ALL", "All messages")
      .replace("MENTIONS", "Only @mentions");

    const explicitContentFilter = message.guild.explicitContentFilter
      .split("_")
      .join(" ")
      .toProperCase();

    const verificationLevel = message.guild.verificationLevel
      .split("_")
      .join(" ")
      .toProperCase()
      .replace("Very High", "┻━┻ ﾐヽ(ಠ益ಠ)ノ彡┻━┻")
      .replace("High", "(╯°□°）╯︵ ┻━┻");

    const communityFeatures =
      message.guild.features
        .join(", ")
        .toString()
        .split("_")
        .join(" ")
        .toProperCase() || "No Community Features";

    const serverInfoEmbed = new Discord.MessageEmbed()
      .setColor(embedcolor)
      .setAuthor(`Reports for: ${message.guild.name}`, message.guild.iconURL())
      .setThumbnail(message.guild.iconURL({ format: "png", dynamic: true }))
      .addFields(
        {
          name: "Overview",
          value: `
• Owner: \`${serverOwner.tag} | ID: ${serverOwner.id}\`
• Created: \`${createdAt} (${createdAtFromNow})\`
• Description: \`${guildDescription}\`
• \`${memberCount} Member(s) | ${botCount} Bot(s) | Maximum of ${maximumMembers} members\`
• \`${allRoles} Role(s) | ${allEmojis} Emoji(s) | ${allBoosts} Boost(s) | Tier ${serverTier}\`
• \`${defaultMsgNotif} will be notified by default\`   
          `,
        },
        {
          name: "Server Protection",
          value: `
• Verification Level: \`${verificationLevel}\`
• Explicit Content Filter: \`${explicitContentFilter}\`
          `,
        },
        {
          name: "All Channels",
          value: `
• Rules Channel: \`${rulesChannel}\`
• System Channel: \`${systemChannel}\`          
• AFK Voice Channel: \`${afkChannel}${afkTimeout}\`
• \`${textChannels} Text Ch. | ${voiceChannels} Voice Ch. | ${parentChannels} Category Ch. | ${newsChannels} News Ch.\`
          `,
        },
        {
          name: "Community Features",
          value: `• \`${communityFeatures}\``,
        }
      )
      .setFooter(`GuildID: ${message.guild.id}`)
      .setTimestamp();
    message.channel.send(serverInfoEmbed);
  }
};
