/** Constants. */
const PREFIX = require("../config/Settings.json").PREFIX.VALUE;

/**
 * Creates a basic embed template from YouTube informations.
 *
 * @param {Song} info
 * @return {Object}
 */
function createEmbed(info) {
  return {
    "embed": {
      "color": 0xff0000,
      "author": {
        "name": "Song added to the queue !",
        "icon_url": "https://yt3.ggpht.com/OgVV66t5vou1LkAbPh7yHbJA73Z2kKHs6-mFaeVFjnlU-pWESAPXFi-5pMASF7Mp1YLfoMdeI38v68U=s288-mo-c-c0xffffffff-rj-k-no"
      },
      "thumbnail": {
        "url": info.get("thumbnail")
      },
      "title": info.get("title"),
      "url": info.get("url"),
      "description": `Uploaded by **${info.get("author")}**`
    }
  }
}

/**
 * Check if the client is playing music.
 *
 * @param {VoiceChannel} channel
 * @return {Boolean}
 */
function isPlaying(channel) {
  return channel.connection && (channel.connection.speaking || channel.connection.dispatcher.paused);
}

/**
 * Convert a number of seconds to a HH:MM:SS format.
 *
 * @param {Int} seconds
 * @return {String}
 */
function toDate(seconds) {
  return new Date(1000 * seconds).toISOString().substr(11, 8);
}

/**
 * Updates the activity (status message).
 *
 * @param {Client} Client
 * @return {Promise<Presence>}
 */
function updateActivity(Client) {
  return Client.user.setActivity(`${PREFIX}help | ${Client.guilds.size} serveurs | ${Client.users.filter(e => !e.bot).size} utilisateurs`, { "type": "LISTENING" });
}

/**
 * An object containing utility and helper functions,
 * thus providing easier code reutilisation.
 */
module.exports = {
  createEmbed,
  isPlaying,
  toDate,
  updateActivity
};
