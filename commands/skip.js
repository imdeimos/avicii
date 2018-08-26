/**
 * Skips one or more songs.
 * 
 * @param {Int} (Args.0) [n]
 */
module.exports = {
  name: "skip",
  desc: "Skips one or more songs.",
  args: ["{Int} n = 1"],
  exec: ({Emojis, Queue, VoiceHandler}, Message, [n = 1]) => {
    n = Number(n);

    if (isNaN(n)) return Message.channel.send(`${Emojis.FAILURE} **skip** expects an integer.`);

    if (VoiceHandler.Voice._destroyed) {
      VoiceHandler.Voice = null;
    }

    if (!VoiceHandler.Voice) return Message.channel.send(`${Emojis.WARNING} The bot is not in a voice channel !`);

    if (Queue.isEmpty()) return Message.channel.send(`${Emojis.WARNING} The queue is empty !`);

    const pos = Queue.current.get("index") + n;

    if (Math.abs(pos) >= Queue.length) {
      /** Out of queue boundaries. */
      Queue.clear();
      VoiceHandler.Voice.destroy();
      VoiceHandler.Voice = null;
      return VoiceHandler.Voice.end() && Message.channel.send(`${Emojis.STOPPED} **Stopped**`);
    }

    if (pos < 0) pos += Queue.length;

    /** We need to cancel the autoincrement from `Voice._onend`. */
    Queue.current = pos - 1;

    if (n == 1) {
      Message.channel.send(`${Emojis.MUSIC_SKIP} **Skipped**`);
    } else if (n < 0) {
      Message.channel.send(`${Emojis.MUSIC_PREV} **Skipped** back ${-n} songs`);
    } else {
      Message.channel.send(`${Emojis.MUSIC_SKIP} **Skipped** ${n} songs`);
    }

    VoiceHandler.Voice.end();
  }
}