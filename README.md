# anonchat

Anonymous chat bot for Discord

# Installation
To be able to run this bot you will be required to install [Node.js](https://nodejs.org/)

1. Please download and install Node.js
2. Download and extract this bot source code
3. Navigate to that directory where you extracted this source code, we will call it `root`
4. Run command-line terminal in `root` directory
5. In terminal run `npm install`

# Configuration
Rename `.env.sample` to `.env` then open that file in [text editor](https://notepad-plus-plus.org/) and fill the required variables such as:
1. `SERVERID` that can be found on your server `Settings -> Widget`.
2. `TOKEN` that you will need to get from https://discordapp.com/developers/applications/ after you created application and registered it as a bot.

Other values are optional to change.

**Remember without .env file with proper required values bot will not be able to work.**

# Run
To run `anonchat` bot you will need to:
1. Navigate to `root` directory
2. Run command-line terminal in `root` directory
3. In terminal run `node anonchat`

**Remember if you close terminal bot will stop to work.**

If you want to run `anonchat` bot on the background, you will probably want to use [PM2](https://www.npmjs.com/package/pm2)

# List of commands

```markdown
# Help
1. -help - Get commands list with descriptions.
2. -ping - Check if AnonChat is online and can answer.
3. -rules - Common usage rules.

# Common
1. -list - Returns list of anonymous channels available on server to join.
2. -join - Join selected anonymous channel from list of available.
3. -leave - Leave the anonymous channel.

# Administration
1. -init - Must be executed in a channel which need to setup as Anonymous channel.
```

# License
[MIT License](LICENSE)
