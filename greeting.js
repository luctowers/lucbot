const { DateTime } = require("luxon");
const LRU = require('lru-cache');

const cache = new LRU(10000);
const cooldown = 4 * 60 * 60;

module.exports = function greeting(message, hourSet, pattern, templates) {
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
  