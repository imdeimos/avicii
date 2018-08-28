/**
 * Sets the bot's volume.
 */
module.exports = {
  name: "volume",
  desc: "Set the bot's volume.",
  args: ["{Int} volume (in the range 0-200)"],
  exec: ({Emojis, Settings, Voice}, Message, [volume]) => {
    volume = Number(volume);

    /** Returns current volume if no arg is given. */
    if (!volume) {
      return Message.channel.send(`${Emojis.INFO} **Volume** : ${Settings.get("VOLUME")}`);
    }

    try {
      Settings.set("VOLUME", volume);
    } catch(err) {
      return Message.channel.send(`${Emojis.WARNING} ${err}`);
    }

    if (Voice.Handler) Voice.Handler.setVolume(volume);
    return Message.channel.send(`${Emojis.SUCCESS} **Volume** set to ${volume}`);
  }
}