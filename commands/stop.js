/**
 * Stops current song, clears the queue and leave the voice channel.
 */
module.exports = {
  name: "stop",
  desc: "Stops current song, clears the queue and leave the voice channel.",
  args: [],
  exec: ({Emojis, Server}, Message, Args) => {
    const { Queue, Voice } = Server;
    
    if (Voice && Voice._destroyed) {
      Server.Voice = null;
    }
    
    if(!Voice) return Message.channel.send(`${Emojis.WARNING} The bot is not in a voice channel !`);

    Queue.clear();
    Voice.destroy();
    Server.Voice = null;
    Message.channel.send(`${Emojis.MUSIC_STOP} **Stopped**`);
  }
}