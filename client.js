const {Client,Intents} = require('discord.js');

let client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] });

client.on('ready', () => {
	console.log(`Logged in as ${client.user.tag}!`);
});
client.login(process.env.DISCORD_TOKEN);

module.exports = client;
