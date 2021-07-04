const client = require('./client');

const commands = {
	buzzer: require('./buzzer')
}

client.on('interactionCreate', async interaction => {
	if (interaction.isCommand()) {
		let command = commands[interaction.commandName];
		if (command) {
			command(interaction);
		} else {
			interaction.reply({ content: 'unknown command', ephemeral: true });
		}
	}
});
