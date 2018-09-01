/** Queue system. */
const Queue = require("../lib/Queue.js").Queue;

const updateActivity = require("../lib/Utils.js").updateActivity;

/**
 * When the bot is connected to the Discord API.
 * @event ready
 */
module.exports = Client => {
  console.log("INFO: Client logged in.");
  updateActivity(Client).then(presence => {
    console.log("INFO: Activity set.");
  }).catch(console.error);

  /**
   * === SERVERS ===
   */

  /** Bind to each guild a unique Queue and Voice instance. */
  Client.guilds.filter(e => e.available).forEach((guild, id) => {
    /**
     * The queue for each server.
     * @type {Queue}
     */
    guild.Queue = new Queue();

    /**
     * The voice handler.
     * @type {?VoiceHandler}
     */
    guild.Voice = null;
  });
};