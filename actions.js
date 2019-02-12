const fs = require('fs')
const shortid = require('shortid')
const randomColor = require('randomcolor')
shortid.seed(1000)
// const sqlite = require('sqlite')

const face = {
  eyes:["eyes1","eyes10","eyes2","eyes3","eyes4","eyes5","eyes6","eyes7","eyes9"],
  nose:["nose2","nose3","nose4","nose5","nose6","nose7","nose8","nose9"],
  mouth:["mouth1","mouth10","mouth11","mouth3","mouth5","mouth6","mouth7","mouth9"]
}

// Anonymous user model
function AnonUser (data) {
  this.name = ''
  this.id = ''
  this.anon_name = ''
  this.channel_id = ''

  this.icon = ''
  this.iconColor = ''
  this.color = ''

  this.Insert = function (data) {
    this.id = data.id
    this.name = data.name
    this.anon_name = data.anon_name
    this.channel_id = data.channel_id
  }

  this.Generate = function () {
    if (this.anon_name === '') {
      this.anon_name = 'Anonymous_' + shortid.generate()
    }
    this.iconColor = randomColor().replace('#', '')
    this.icon = 'https://api.adorable.io/avatars/face/' + face.eyes[Math.floor(Math.random() * face.eyes.length)] + '/'
    + face.nose[Math.floor(Math.random() * face.nose.length)] + '/'
    + face.mouth[Math.floor(Math.random() * face.mouth.length)] +'/' + this.iconColor + '.png' // 'https://avatars.dicebear.com/v2/' + sprites[i] + '/' + this.anon_name + '.svg'
    this.color = parseInt(randomColor().replace('#', '0x'))
  }

  if (data) this.Insert(data)
}

// Variables
var actions = []
var anonChannels = []
var anonUsers = []

actions.help = {
  category: 'Help',
  name: 'help',
  help: 'Get commands list with descriptions.',
  fn: function (msg) {
    var items = {}
    for(var i in actions) {
      if (actions[i].category !== 'System') {
        if (typeof items[actions[i].category] == 'undefined') items[actions[i].category] = []
        items[actions[i].category].push({name: actions[i].name, help: actions[i].help})
      }
    }
    var text = [] 
    text.push('**Instructions for use**')
    text.push('```Markdown')
    text.push('Syntax: (prefix)command [arguments/keywords]')
    text.push('```')
    text.push('**Commands list**')
    text.push('```Markdown')
    for(var i in items) {
      text.push('# ' + i)
      for(var j in items[i]) {
        text.push((+j+1) + '. ' + process.env.prefix + items[i][j].name + ' - ' + items[i][j].help)
      }
      text.push('')
    }
    text.push('```')
    msg.channel.send(text)
  }
}

actions.ping = {
  category: 'Help',
  name: 'ping',
  help: 'Check if ' + process.env.NAME + ' is online and can answer.',
  fn: function (msg) {
    msg.channel.send('pong')
  }
}

actions.rules = {
  category: 'Help',
  name: 'rules',
  help: 'Common usage rules.',
  fn: function (msg) {
    var rules = fs.readFileSync(process.env.RULES, 'utf-8').replace(/\[prefix\]/g, process.env.prefix)
    if (rules === '') {
      msg.channel.send('I\'m sorry, but there are no rules available yet.')
    } else {
      msg.channel.send(rules)
    }
  }
}

actions.list = {
  category: 'Common',
  name: 'list',
  help: 'Returns list of anonymous channels available on server to join.',
  fn: function (msg, c, client) {
    if (anonChannels.length) {
      let guild = client.guilds.get(process.env.SERVERID)
      let text = '**List of anonymous channels:**\n'
      text += '```Markdown\n'
      for (let i = 0; i < anonChannels.length; i++) {
        text += guild.channels.get(anonChannels[i]).name + '\n' // + ' (id: '+ anonChannels[i] +')'
      }
      text += '```'
      msg.reply(text)
    } else {
      msg.reply('Currently there is no available anonymous channels on server.')
    }
  }
}

actions.join = {
  category: 'Common',
  name: 'join',
  help: 'Join selected anonymous channel from list of available.',
  fn: function (msg, c, client) {
    if (anonChannels.length) {
      var channelName = c.GetArgs(0)
      let guild = client.guilds.get(process.env.SERVERID)
      for (let i = 0; i < anonChannels.length; i++) {
        if (channelName === guild.channels.get(anonChannels[i]).name) {
          let index = anonUsers.findIndex(x => x.id === msg.author.id)
          if (index >= 0) {
            anonUsers.splice(index, 1)
          }

          var newAnon = new AnonUser({
            id: msg.author.id,
            name: msg.author.name,
            anon_name: 'Anonymous' + anonUsers.length,
            channel_id: anonChannels[i]
          })

          newAnon.Generate()

          anonUsers.push(newAnon)

          msg.reply('Joined anonymous channel `' + channelName + '`.')
        }
      }
    } else {
      msg.reply('Cannot join, there is no such anonymous channel available. Please use `-list` to check available channels first.')
    }
  }
}

actions.leave = {
  category: 'Common',
  name: 'leave',
  help: 'Leave the anonymous channel.',
  fn: function (msg, c, client) {
    var index = anonUsers.findIndex(x => x.id === msg.author.id)
    if (index >= 0) {
      anonUsers.splice(index, 1)
      msg.reply('You left anonymous channel.')
    }
  }
}

// Admin functions
actions.init = {
  category: 'Administration',
  name: 'init',
  help: 'Must be executed in a channel which need to setup as Anonymous channel.',
  permissions: ['ADMINISTRATOR', 'MANAGE_CHANNELS'],
  fn: function (msg, c, client) {
    if (msg.channel.type === 'text' && !anonChannels.includes(msg.channel.id)) {
      anonChannels.push(msg.channel.id)
      msg.reply('Channel registered as anonymous.')
    } else {
      msg.reply('Cannot register channel as anonymous or it is already registered.')
    }
  }
}

// After this line will be stored system functions
actions.SystemMessageProcess = {
  category: 'System',
  name: 'SystemMessageProcess',
  fn: function (msg, c, client) {
    let index = anonUsers.findIndex(x => x.id === msg.author.id)
    if (index >=0) {
      let guild = client.guilds.get(process.env.SERVERID)
      let channel = guild.channels.get(anonUsers[index].channel_id)

      var message = {
        embed:{
          color: anonUsers[index].color,
          author: {
            name: anonUsers[index].anon_name,
            icon_url: anonUsers[index].icon
          },
          description: msg.content,
          timestamp: new Date()
        }
      }

      channel.send(message)
      for (let i = 0; i < anonUsers.length; i++) {
        if (i !== index) {
          client.users.get(anonUsers[i].id).send(message)
        }
      }
    }
  }
}

module.exports = actions