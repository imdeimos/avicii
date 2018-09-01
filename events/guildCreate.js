/** Queue system. */
const Queue = require("../lib/Queue.js").Queue;

const updateActivity = require("../lib/Utils.js").updateActivity;

/**
 * Emitted when the bot joins a new guild.
 * @event guildCreate
 */
module.exports = (Client, Guild) => {
  console.log(`\nINFO: Joined the guild ${Guild.name} | ${Guild.memberCount} users.`);
  updateActivity(Client).then(presence => {
    console.log(`INFO: Activity updated.`);
  }).catch(console.error);

  /** Initiate queue and voice. */
  Client.guilds.get(Guild.id).Queue = new Queue();
  Client.guilds.get(Guild.id).Voice = null;
};
