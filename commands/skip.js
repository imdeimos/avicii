/**
 * Skips one or more songs.
 * 
 * @param {Int} (Args.0) [n]
 */
module.exports = {
  name: "skip",
  desc: "Skips one or more songs.",
  args: ["{Int} n = 1"],
  examples: ["**skip**\n=> Skipped !", "**skip** -1\n=> Skipped back 1 songs !"],
  exec: ({Emojis, Server}, Message, [n = 1]) => {
    const { Queue, Voice } = Server;
    
    n = Number(n);

    if (isNaN(n)) return Message.channel.send(`${Emojis.FAILURE} **skip** expects an integer.`);

    if (Voice._destroyed) {
      Server.Voice = null;
    }

    if (!Voice) return Message.channel.send(`${Emojis.WARNING} The bot is not in a voice channel !`);

    if (Queue.isEmpty()) return Message.channel.send(`${Emojis.WARNING} The queue is empty !`);

    if (!Queue.current) return Message.channel.send(`${Emojis.WARNING} No song is playing !`);

    const pos = Queue.current.get("index") + n;

    if (Math.abs(pos) >= Queue.length) {
      /** Out of queue boundaries. */
      Queue.clear();
      Voice.destroy();
      Server.Voice = null;
      return Message.channel.send(`${Emojis.MUSIC_STOP} **Stopped**`);
    }

    if (pos < 0) pos += Queue.length;

    Queue.current = pos - 1;

    if (n == 1) {
      Message.channel.send(`${Emojis.MUSIC_SKIP} **Skipped**`);
    } else if (n < 0) {
      Message.channel.send(`${Emojis.MUSIC_PREV} **Skipped** back ${-n} songs`);
    } else {
      Message.channel.send(`${Emojis.MUSIC_SKIP} **Skipped** ${n} songs`);
    }

    Voice.end();
  }
}