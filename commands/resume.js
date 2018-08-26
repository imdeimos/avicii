/**
 * Resumes music.
 */
module.exports = {
  name: "resume",
  desc: "Resumes a paused music.",
  args: [],
  exec: ({Emojis, VoiceHandler}, Message, Args) => {
    if (VoiceHandler.Voice._destroyed) {
      VoiceHandler.Voice = null;
    }
    
    if (!VoiceHandler.Voice) return Message.channel.send(`${Emojis.WARNING} The bot is not in a voice channel !`);

    if (!VoiceHandler.Voice.isPaused()) return Message.channel.send(`${Emojis.WARNING} The music is already playing !`);

    Message.channel.send(`${Emojis.MUSIC_PLAY} **Resumed**`);
    VoiceHandler.Voice.resume();
  }
}