/**
 * Pauses music.
 */
module.exports = {
  name: "pause",
  desc: "Pauses the music.",
  args: [],
  exec: ({Emojis, Voice}, Message, Args) => {
    if (Voice.Handler._destroyed) {
      Voice.Handler = null;
    }
    
    if (!Voice.Handler) return Message.channel.send(`${Emojis.WARNING} The bot is not in a voice channel !`);
  
    if (Voice.Handler.isPaused()) return Message.channel.send(`${Emojis.WARNING} The music is already paused !`);
  
    Voice.Handler.pause();
    Message.channel.send(`${Emojis.MUSIC_PAUSE} **Paused**`);
  }
}