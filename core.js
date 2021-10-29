/**
 * Libraries/Imports
 */
const { Client, Intents, Collection } = require('discord.js');
const fs = require('fs') //reading file system
/**
 * Local imports
 */
const secrets = require('./secrets.json')
/**
 * Global Variables
 */
/**
 * Command Handler
 *      Breaks the message into parts by space, arg[0] is the command
 *      Ignore messages from bots
 *      If the bot has no command, do nothing
 *      Try to execute the command
 *          Send Error to console & reply with error to channel
 */
let commandHandler = async (msg) => {
    const args = msg.content.toLowerCase().trim().split(' ')
    if (msg.author.bot) return
    if (!bot.commands.has(args[0])) return

    try {
        bot.commands.get(args[0]).execute(msg, args, bot)
        console.log(`Exec: ${msg.content} success!`)
    } catch (error) {
        console.error(`${error} while doing command ${msg.content}`)
        msg.reply(`${error} while doing command ${msg.content}`)
    }
}
/**
 * On Start 
 *      Prints bot's username to console 
 */
const startUp = async () => {
    console.log(`Logged in as ${bot.user.tag}!`)
}
/**
 * Load Commands
 *      Designates the file with commands, filters them looking for JS classes
 *      Creates a Discord Collection of them
 *          For each file in the Collection
 *              Require/import it
 *              Add the Command name & command to the commands map
 *              Log to console
 *          Print the total number of commands loaded
 */
function loadCommands() {
    bot.commandFile = (fs.readdirSync(`./commands`).filter(file => file.endsWith('.js')))
    bot.commands = new Collection()

    q = ''
    bot.commandFile.forEach(file => {
        try {
            const command = require(`./commands/${file}`)
            bot.commands.set(command.name, command)
            q += (`${command.name.toUpperCase()} `)
        } catch (error) {
            console.log(` ${error} while reading ${file}`)
        }
    })
    console.log(q)
    console.log(`${(bot.commands.size)} total loaded`)
}
/**
 * Main
 */
var bot = new Client({ intents: [Intents.FLAGS.GUILDS] });
loadCommands()
bot.once('ready', () => startUp())
bot.on('message', msg => commandHandler(msg))
bot.login(secrets.discord_token)
