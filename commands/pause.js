/**
 * Pauses music.
 */
module.exports = {
  name: "pause",
  desc: "Pauses the music.",
  args: [],
  exec: ({Emojis, Server}, Message, Args) => {
    const Voice = Server.Voice;
    if (Voice._destroyed) {
      Server.Voice = null;
    }
    
    if (!Voice) return Message.channel.send(`${Emojis.WARNING} The bot is not in a voice channel !`);
  
    if (Voice.isPaused()) return Message.channel.send(`${Emojis.WARNING} The music is already paused !`);
  
    Voice.pause();
    Message.channel.send(`${Emojis.MUSIC_PAUSE} **Paused**`);
  }
}