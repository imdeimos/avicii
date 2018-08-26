const updateActivity = require("../lib/Utils.js").updateActivity;

/**
 * Emitted when the bot leaves a guild.
 * @event guildDelete
 */
module.exports = (Client, [Guild]) => {
  console.log("\n");
  console.log(`INFO: Left guild ${Guild.name} | ${Guild.memberCount} users.`);
  updateActivity(Client).then(presence => {
    console.log(`INFO: Activity updated.`);
  }).catch(err => console.error(err));
}
