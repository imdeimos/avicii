const updateActivity = require("../lib/Utils.js").updateActivity;

/**
 * Emitted when the bot joins a new guild.
 * @event guildCreate
 */
module.exports = (Client, [Guild]) => {
  console.log("\n");
  console.log(`INFO: Joined the guild ${Guild.name} | ${Guild.memberCount} users.`);
  updateActivity(Client).then(presence => {
    console.log(`INFO: Activity updated.`);
  }).catch(err => console.error(err));
};
