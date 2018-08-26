/** Embed template. */
const createEmbed = require("../lib/Utils.js").createEmbed;

/** YouTube API functions. */
const YouTube = require("../lib/YouTube.js");

/** Voice. */
const Voice = require("../lib/Voice.js");

module.exports = {
  name: "play",
  desc: "Plays a song based on a YouTube URL or query.",
  args: ["{String} song"],
  exec: ({Emojis, Queue, VoiceHandler, Settings}, Message, Query) => {
    /**
     * Joins a voice channel and starts playing.
     * 
     * @param {VoiceChannel} channel
     */
    function joinChannel(channel) {
      let elem = Queue.last;
      elem.set("requestedBy", Message.author.username);

      let embed = createEmbed(elem);
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

      /** If the bot is not connected to a channel, plays stream. */
      if (!VoiceHandler.Voice || VoiceHandler.Voice._destroyed) {
        VoiceHandler.Voice = new Voice(channel, Message.channel, Queue);
        Message.channel.send(`${Emojis.SUCCESS} Connected to channel ${channel.name}`);

        Settings.announcePlaying(Message.channel, elem);

        VoiceHandler.Voice.play(YouTube.ytdl(elem.get("url"), { filter: "audioonly", quality: "highestaudio" }));
      }
    }

    if (Query.length == 0) {
      return Message.channel.send(`${Emojis.WARNING} Invalid argument, must be either **a query or a correct YouTube URL**.`);
    }

    const VoiceChannel = Message.member.voiceChannel;
    if (!VoiceChannel) {
      return Message.channel.send(`${Emojis.WARNING} You must be **in a voice channel** first !`);
    } else if (VoiceChannel.full) {
      return Message.channel.send(`${Emojis.WARNING} The voice channel is **full** !`);
    }

    /**
     * Types of arguments :
     * ~> URLs
     * --~> Playlists (not implemented)
     * --~> Videos
     * ~> Queries
     */
    
    Message.channel.send(`${Emojis.SEARCH} Searching for \`${Query.join(" ")}\` ...`);

    if (YouTube.validateURL(Query[0])) {
      /** URLs. */
      YouTube.getVideo(Query[0]).then(info => {
        Queue.push(info);
        joinChannel(VoiceChannel);
      }).catch(err => Message.channel.send(`${Emojis.FAILURE} Error: Unable to retrieve video information.`) && console.error(err));
    } else {
      /** Queries. */
      YouTube.search(Query.join(" "), 1).then(info => {
        Queue.push(info[0]);
        joinChannel(VoiceChannel);
      }).catch(err => Message.channel.send(`${Emojis.FAILURE} Error: Unable to retrieve video information.`) && console.error(err));
    }
  }
}