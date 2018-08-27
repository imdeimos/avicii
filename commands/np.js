const createEmbed = require("../lib/Utils.js").createEmbed;

/**
 * Returns information about the current song.
 */
module.exports = {
  name: "np",
  desc: "Show current playing song informations.",
  args: [],
  exec: ({Emojis, Queue, Voice}, Message, Args) => {
    if (Voice.Handler._destroyed) {
      Voice.Handler = null;
    }
    
    if (!Voice.Handler) return Message.channel.send(`${Emojis.WARNING} No song is playing !`);

    const elem = Queue.current;

    let embed = createEmbed(elem);

    embed.embed.author.name = "Now playing";
    embed.embed.fields = [
      {
        name: "Requested by",
        value: elem.get("requestedBy"),
        inline: true
      },
      {
        name: "Position in queue",
        value: `\`${elem.get("index")}\``,
        inline: true
      }
    ];
    Message.channel.send(embed);
  }
}