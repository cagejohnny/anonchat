const Discord = require('discord.js')

process.title = process.env.NAME

const client = new Discord.Client()

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`)
})

client.on('disconnect', () => {
  console.log('Disconnected.')
})

client.on('reconnecting', () => {
  console.log('Reconnecting...')
})

module.exports = client