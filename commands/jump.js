/**
 * Jump to a certain song in queue.
 *
 * @param {Int} (Args.0) pos
 */
module.exports = {
  name: "jump",
  desc: "Skips to a position in the queue.",
  args: ["{Int} pos"],
  examples: ["**jump** 0\n=> Jumped to position 0 in queue !"],
  exec: ({Emojis, Server}, Message, [pos]) => {
    const { Queue, Voice } = Server;

    /** Convert pos to Int. */
    pos = Number(pos);

    const len = Queue.length;

    if (len === 0) return Message.channel.send(`${Emojis.WARNING} The queue is empty !`);

    if (Voice._destroyed) {
      Server.Voice = null;
    }

    if (!Server.Voice) {
      return Message.channel.send(`${Emojis.WARNING} No song is playing !`);
    }

    if (Math.abs(pos) >= len) {
      /** Out of queue boundaries. */
      Queue.clear();
      Voice.destroy();
      Server.Voice = null;
      return Voice.end() && Message.channel.send(`${Emojis.STOPPED} **Stopped**`);
    }

    if (pos < 0) pos += len;

    /** Cancel the auto increment. */
    Queue.current = pos - 1;

    Message.channel.send(`:arrow_right: **Jumped** to position \`${pos}\` in queue`);

    /** Stops current song. */
    Voice.end();
  }
}