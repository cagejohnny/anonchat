require('dotenv').config()
const client = require('./client.js')
const Command = require('./command.js')
const Actions = require('./actions.js')

/* 
  Bot code start here
*/
var c = new Command()
c.SetPrefix(process.env.PREFIX)

client.on('message', msg => {
  var guild = client.guilds.get(process.env.SERVERID)
  var member = guild.member(msg.author.id)

  // Check if author is a guild member
  if (member) {
    c.SetQuery(msg.content)
    var name = c.GetCommandName()

    if (Actions[name]) {
      switch (Actions[name].category) {
        case 'Administration':
          if (member.hasPermission(Actions[name].permissions)) {
            Actions[name].fn(msg, c, client)
          } else {
            msg.reply('I\'m sorry, but you don\'t have permissions to use this command')
          }
        break
        case 'System':
          // Catch system functions, do nothing
        break
        case 'Help':
          Actions[name].fn(msg, c, client)
        break
        default:
          if (msg.channel.type === 'dm') {
            Actions[name].fn(msg, c, client)
          } else {
            msg.reply('Please use this command in private messages with me.')
          }
        break
      }
    } else {
      // Run system message processing
      if (msg.channel.type === 'dm') Actions['SystemMessageProcess'].fn(msg, c, client)
    }
  } else {
    msg.reply('I\'m sorry, but you are not part of ' + guild.name + '.')
  }
})

client.login(process.env.TOKEN)