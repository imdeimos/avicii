/**
 * Reset the current song progress.
 */
module.exports = {
  name: "replay",
  desc: "Reset the current song progress.",
  args: [],
  exec: ({Emojis, Server}, Message, Args) => {
    const { Queue, Voice } = Server;
    
    if (Voice._destroyed) {
      Server.Voice = null;
    }
    
    if (!Voice) return Message.channel.send(`${Emojis.WARNING} No music is playing !`);

    if (Queue.isEmpty()) return Message.channel.send(`${Emojis.WARNING} The queue is empty !`);
    
    Voice.restart();
    Message.channel.send(`${Emojis.MUSIC_RESTART} **Restarted** song`);
  }
}