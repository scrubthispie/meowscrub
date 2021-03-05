const Commando = require('discord.js-commando')
const Discord = require('discord.js')
const { parse } = require('twemoji-parser')

const { what, red, embedcolor } = require('../../assets/json/colors.json')

const invalidEmojiEmbed = new Discord.MessageEmbed()
    .setColor(red)
    .setDescription('<:scrubred:797476323169533963> Invalid emoji found. Try again.')
    .setFooter('will ya?')
    .setTimestamp()

module.exports = class StealEmojiCommand extends Commando.Command {
    constructor(client) {
        super(client, {
            name: 'emoji',
            aliases: ['stealemoji', 'e'],
            group: 'misc',
            memberName: 'emoji',
            description: 'Extract your specified custom emoji from a guild.',
            argsType: 'single',
            format: '<emojiname>',
            examples: ['emoji :what:'],
        })
    }

    run(message, args) {
        if (!args) {
            const noEmojisEmbed = new Discord.MessageEmbed()
                .setColor(what)
                .setDescription('<:scrubnull:797476323533783050> Specify at least ONE emoji to advance.')
                .setFooter('do you expect me to steal every emojis from this guild')
                .setTimestamp()
            return message.reply(noEmojisEmbed)
        }

        try {
            const parsedEmoji = Discord.Util.parseEmoji(args)
            if (parsedEmoji.id) {
                const extension = parsedEmoji.animated ? ".gif" : ".png"
                const url = `https://cdn.discordapp.com/emojis/${parsedEmoji.id + extension}`
                const guildEmojiEmbed = new Discord.MessageEmbed()
                    .setColor(embedcolor)
                    .setAuthor(`Emoji Extracted! [${parsedEmoji.name}]`)
                    .setTitle(`ID: ${parsedEmoji.id}`)
                    .setImage(url)
                    .setFooter(`Requested by ${message.author.tag}`, message.author.displayAvatarURL({ dynamic: true }))
                message.channel.send(guildEmojiEmbed)
            } else {
                let parsed = parse(args, { assetType: 'png' })
                if (!parsed[0]) {
                    return message.reply(invalidEmojiEmbed)
                }

                const builtInEmojiEmbed = new Discord.MessageEmbed()
                    .setColor(embedcolor)
                    .setAuthor(`Emoji Extracted! [${args}]`)
                    .setImage(parsed[0].url)
                    .setFooter(`Requested by ${message.author.tag}`, message.author.displayAvatarURL({ dynamic: true }))
                message.channel.send(builtInEmojiEmbed)
            }
        } catch (err) {
            message.reply('Something went wrong. Please try again now, or later.')
        }
    }
}