const { DateTime } = require("luxon");
const LRU = require('lru-cache');
const client = require('./client.js');

const cache = new LRU(10000);
const cooldown = 4 * 60 * 60;
const enemies = new Set(["210201057651982339","630229422330609664"]);

client.on('messageCreate', message => {
  if (enemies.has(message.author.id)) {
    greeting(
      message,
      new Set([20,21,22,23,0,1]),
      /(^|[^a-z]|g|good)night($|[^a-z])/i,
      require('./rude-night-templates.js')
    );
  } else {
    greeting(
      message,
      new Set([5,6,7,8,9,10,21,22]),
      /(^|[^a-z]|g|good)morn(in)?g?($|[^a-z])/i,
      require('./morning-templates.js')
    );
    greeting(
      message,
      new Set([20,21,22,23,0,1]),
      /(^|[^a-z]|g|good)night($|[^a-z])/i,
      require('./night-templates.js')
    );
  }
});

function greeting(message, hourSet, pattern, templates) {
  if (message.author.bot) {
    return;
  }
  let datetime = DateTime.now().setZone('America/Vancouver');
  if (!hourSet.has(datetime.hour)) {
    return;
  }
  if (!message.content.toLowerCase().match(pattern)) {
    return;
  }
  let cachedDatetime = cache.get(message.author.id);
  if (cachedDatetime && datetime.diff(cachedDatetime, 'seconds').toObject().seconds < cooldown) {
    return;
  }
  cache.set(message.author.id, datetime);
  let templateIndex = Math.floor(Math.random() * templates.length);
  let replyContent = templates[templateIndex].replace('@', message.author);
  message.reply(replyContent);
}
