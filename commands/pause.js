/**
 * Pauses music.
 */
module.exports = {
  name: "pause",
  desc: "Pauses the music.",
  args: [],
  exec: ({Emojis, VoiceHandler}, Message, Args) => {
    if (VoiceHandler.Voice._destroyed) {
      VoiceHandler.Voice = null;
    }
    
    if (!VoiceHandler.Voice) return Message.channel.send(`${Emojis.WARNING} The bot is not in a voice channel !`);
  
    if (VoiceHandler.Voice.isPaused()) return Message.channel.send(`${Emojis.WARNING} The music is already paused !`);
  
    VoiceHandler.Voice.pause();
    Message.channel.send(`${Emojis.MUSIC_PAUSE} **Paused**`);
  }
}