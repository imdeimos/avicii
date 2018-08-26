/**
 * Stops current song, clears the queue and leave the voice channel.
 */
module.exports = {
  name: "stop",
  desc: "Stops current song, clears the queue and leave the voice channel.",
  args: [],
  exec: ({Emojis, Queue, VoiceHandler}, Message, Args) => {
    if (VoiceHandler.Voice._destroyed) {
      VoiceHandler.Voice = null;
    }
    
    if(!VoiceHandler.Voice) return Message.channel.send(`${Emojis.WARNING} The bot is not in a voice channel !`);

    Queue.clear();
    VoiceHandler.Voice.destroy();
    VoiceHandler.Voice = null;
    Message.channel.send(`${Emojis.MUSIC_STOP} **Stopped**`);
  }
}