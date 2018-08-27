/**
 * Resumes music.
 */
module.exports = {
  name: "resume",
  desc: "Resumes a paused music.",
  args: [],
  exec: ({Emojis, Voice}, Message, Args) => {
    if (Voice.Handler._destroyed) {
      Voice.Handler = null;
    }
    
    if (!Voice.Handler) return Message.channel.send(`${Emojis.WARNING} The bot is not in a voice channel !`);

    if (!Voice.Handler.isPaused()) return Message.channel.send(`${Emojis.WARNING} The music is already playing !`);

    Message.channel.send(`${Emojis.MUSIC_PLAY} **Resumed**`);
    Voice.Handler.resume();
  }
}