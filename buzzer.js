const {MessageActionRow,MessageButton} = require('discord.js');
const LRU = require("lru-cache");
const client = require("./client");

let cache = new LRU({
  max: 10000,
  length: (entry, key) => entry.users.size,
  maxAge: 1000 * 60 * 60
})

module.exports = async function buzzer(commandInteraction) {

  await commandInteraction.reply({ 
    content: 'Nobody has buzzed in yet.',
    components: [
      new MessageActionRow()
      .addComponents(
        new MessageButton()
          .setCustomID('buzzer-' + commandInteraction.id + '-buzzer')
          .setLabel('buzzer')
          .setStyle('PRIMARY'),
      )
    ]
  });
  
};

client.on('interactionCreate', async interaction => {
	if (interaction.isButton() && interaction.customID.startsWith('buzzer-')) {
    if (interaction.customID.endsWith('-buzzer')) {
      await buzzerPressed(interaction);
    }
	}
});

async function buzzerPressed(buttonInteraction) {
  let id = buttonInteraction.customID.split('-')[1];
  let entry = cache.get(id);
  if (entry === undefined) {
    entry = constructEntry(buttonInteraction.message);
    cache.set(id, entry);
  }
  if (entry.users.has(buttonInteraction.user.id)) {
    await buttonInteraction.deferUpdate();
  } else {
    entry.users.add(buttonInteraction.user.id);
    entry.content += '\n' + entry.users.size + '. <@' + buttonInteraction.user.id + '>';
    cache.set(id, entry);
    await buttonInteraction.update(entry.content);
  }
}

function constructEntry(message) {
  let users = [...message.content.matchAll(/<@([0-9]+)>/g)].map(m => m[1])
  return {
    users: new Set(users),
    content: users.map((user, index) => (index + 1) + '. <@' + user + '>').join('\n')
  }
}
