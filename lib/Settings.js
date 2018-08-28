/** Emojis. */
const Emojis = require("../config/Emojis.json");

/**
 * The settings handler.
 */
module.exports = class Settings {
  constructor() {
    /**
     * A JSON object containing the default settings.
     * @type {Object}
     */
    this.JSON = require("../config/Settings.json");
  }

  /**
   * Playing song announcer.
   *
   * @param {TextChannel} channel
   * @param {Song} info
   */
  announcePlaying(channel, info) {
    if (this.Settings.ANNOUNCE_PLAYING.VALUE === true) {
      channel.send(`${Emojis.MUSIC_NOTES} **Now playing** ${info.get("title")}`);
    }
  }

  /**
   * Get a setting.
   * 
   * @param {String} name
   * @return {*}
   */
  get(name) {
    return this.Settings[name].VALUE;
  }

  /**
   * Checks if the user is a admin.
   * 
   * @param {GuildMember} user
   * @return {Boolean}
   */
  isAdmin(user) {
    return Boolean(user.roles.find("name", "Administrateurs ⚙️"));
  }

  /**
   * Check if the user is a Bot.
   *
   * @param {User} user
   * @return {Boolean}
   */
  isBot(user) {
    return user.bot;
  }

  /**
   * Checks if the user is a DJ, or returns null is no role is specified in the settings.
   * 
   * @param {GuildMember} user
   * @return {?Boolean}
   */
  isDJ(user) {
    const role = this.Settings.DJ_ROLE.VALUE;
    return role ? Boolean(user.roles.find("name", role)) : null;
  }

  /**
   * Change a setting's value.
   * 
   * @param {String} name
   * @param {*} value
   */
  set(name, value) {
    let e = this.Settings[name];

    if (!e) throw new Error(`Unknown setting ${name}.`);

    if (e.NULLABLE === false && value === null) throw new Error(`${name} is not nullable.`)

    if (e.TYPE === "Int") {
      if (!typeof value === "number" || !(value instanceof Number)) throw new Error(`Expected int, ${typeof value} given.`);
      if (Number.isNan(value)) throw new Error(`${value} is not a number.`);
      if (e.RANGE && (value < e.RANGE[0] || value > e.RANGE[1])) throw new RangeError(`${value} out of range ${e.RANGE[0]}-${e.RANGE[1]}.`);
    } else if (e.TYPE === "String") {
      if (!typeof value === "string" || !(value instanceof String)) throw new Error(`Expected string, ${typeof value} given.`);
      if (value == "") throw new Error(`String is empty.`);
    } else if (e.TYPE === "Boolean") {
      if (!typeof value === "boolean" || !(value instanceof Boolean)) throw new Error(`Expected boolean, ${typeof value} given.`);
    }

    this.Settings[name].VALUE = value;
  }
};