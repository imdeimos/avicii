/** Embed template. */
const createEmbed = require("../lib/Utils.js").createEmbed;

/** YouTube API functions. */
const YouTube = require("../lib/YouTube.js");

/** Voice. */
const VoiceHandler = require("../lib/Voice.js");

module.exports = {
  name: "play",
  desc: "Plays a song based on a YouTube URL or query.",
  args: ["{String} song"],
  exec: ({Emojis, Server, Settings}, Message, Query) => {
    const { Queue, Voice } = Server; 
    
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
      if (!Voice || Voice._destroyed) {
        Server.Voice = new VoiceHandler(channel, Message.channel, Queue);
        Message.channel.send(`${Emojis.SUCCESS} Connected to channel ${channel.name}`);

        Settings.announcePlaying(Message.channel, elem);

        Server.Voice.play(YouTube.ytdl(elem.get("url"), { filter: "audioonly", quality: "highestaudio" }));
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
     * ~> Search result number
     */
    Query = Query.join(" ");

    if (YouTube.validateURL(Query)) {
      /** URLs. */
      Message.channel.send(`${Emojis.SEARCH} Searching for \`${Query}\` ...`);

      YouTube.getVideo(Query).then(info => {
        Queue.push(info);
        joinChannel(VoiceChannel);
      }).catch(err => Message.channel.send(`${Emojis.FAILURE} Error: Unable to retrieve video information.`) && console.error(err));
    } else {
      if (!Number.isNaN(Number(Query))) {
        /** Search result number. */
        const res = Server.SearchResults;

        if (!res) return Message.channel.send(`${Emojis.WARNING} Invalid argument, must be either **a query or a correct YouTube URL**.`);

        Message.channel.send(`${Emojis.SEARCH} Playing the search result N°\`${Query}\` ...`);

        YouTube.getVideo(res[Query].url).then(info => {
          Queue.push(info);
          joinChannel(VoiceChannel);
          delete Server.SearchResults;
        }).catch(err => Message.channel.send(`${Emojis.FAILURE} Error: Unable to retrieve video information.`) && console.error(err));
      } else {
        /** Queries. */
        Message.channel.send(`${Emojis.SEARCH} Searching for \`${Query}\` ...`);

        YouTube.search(Query, 1).then(info => {
          Queue.push(info[0]);
          joinChannel(VoiceChannel);
        }).catch(err => Message.channel.send(`${Emojis.FAILURE} Error: Unable to retrieve video information.`) && console.error(err));
      }
    }
  }
}