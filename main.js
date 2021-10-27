const greeting = require('./greeting');
const client = require('./client.js');
const { DateTime } = require("luxon");

const cumBan = new Set(["295684308184727555"]);
const enemies = new Set(["210201057651982339","630229422330609664"]);
const cumTs = {};

client.on('messageCreate', message => {

  if (cumBan.has(message.author.id)) {
    if (message.content.toLowerCase().match(/.*c+[^a-z]*u+[^a-z]*m+.*/i)) {
      let reply = true;
      let now = DateTime.now().setZone('America/Vancouver');
      if (cumTs[message.author.id]) {
        reply = now.diff(cumTs[message.author.id], 'seconds').toObject().seconds > 30
      }
      cumTs[message.author.id] = now;
      if (reply) {
        message.reply(`${message.author} you have your exceeded cum quota for the month! Top up your balance to continue cumming https://www.paypal.com/paypalme/lucluccorp`).then(() => {
          message.delete()
        })
      } else {
        message.delete()
      }
    }
  }
117653991051100162
  if (enemies.has(message.author.id)) {
    greeting(
      message,
      new Set([5,6,7,8,9,10,21,22]),
      /(^|[^a-z]|g|good)morn(in)?g?($|[^a-z])/i,
      require('./rude-morning-templates.js')
    );
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
