/**
 * Reset the current song progress.
 */
module.exports = {
  name: "replay",
  desc: "Reset the current song progress.",
  args: [],
  exec: ({Emojis, Queue, VoiceHandler}, Message, Args) => {
    if (VoiceHandler.Voice._destroyed) {
      VoiceHandler.Voice = null;
    }
    
    if (!VoiceHandler.Voice) return Message.channel.send(`${Emojis.WARNING} No music is playing !`);

    if (Queue.isEmpty()) return Message.channel.send(`${Emojis.WARNING} The queue is empty !`);

    VoiceHandler.Voice.restart();
    Message.channel.send(`${Emojis.MUSIC_RESTART} **Restarted** song`);
  }
}