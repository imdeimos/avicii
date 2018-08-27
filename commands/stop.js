/**
 * Stops current song, clears the queue and leave the voice channel.
 */
module.exports = {
  name: "stop",
  desc: "Stops current song, clears the queue and leave the voice channel.",
  args: [],
  exec: ({Emojis, Queue, Voice}, Message, Args) => {
    if (Voice.Handler._destroyed) {
      Voice.Handler = null;
    }
    
    if(!Voice.Handler) return Message.channel.send(`${Emojis.WARNING} The bot is not in a voice channel !`);

    Queue.clear();
    Voice.Handler.destroy();
    Voice.Handler = null;
    Message.channel.send(`${Emojis.MUSIC_STOP} **Stopped**`);
  }
}