/**
 * Reset the current song progress.
 */
module.exports = {
  name: "replay",
  desc: "Reset the current song progress.",
  args: [],
  exec: ({Emojis, Queue, Voice}, Message, Args) => {
    if (Voice.Handler._destroyed) {
      Voice.Handler = null;
    }
    
    if (!Voice.Handler) return Message.channel.send(`${Emojis.WARNING} No music is playing !`);

    if (Queue.isEmpty()) return Message.channel.send(`${Emojis.WARNING} The queue is empty !`);

    Voice.Handler.restart();
    Message.channel.send(`${Emojis.MUSIC_RESTART} **Restarted** song`);
  }
}