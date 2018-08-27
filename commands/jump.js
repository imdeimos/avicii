/**
 * Jump to a certain song in queue.
 *
 * @param {Int} (Args.0) pos
 */
module.exports = {
  name: "jump",
  desc: "Jumps to a position in the queue (stops current song).",
  args: ["{Int} pos"],
  exec: ({Emojis, Queue, Voice}, Message, [pos]) => {
    /** Convert pos to Int. */
    pos = Number(pos);

    const len = Queue.length;

    if (len === 0) return Message.channel.send(`${Emojis.WARNING} The queue is empty !`);

    if (Voice.Handler._destroyed) {
      Voice.Handler = null;
    }

    if (!Voice.Handler) {
      return Message.channel.send(`${Emojis.WARNING} No song is playing !`);
    }

    if (Math.abs(pos) >= len) {
      /** Out of queue boundaries. */
      Queue.clear();
      Voice.Handler.destroy();
      Voice.Handler = null;
      return Voice.Handler.end() && Message.channel.send(`${Emojis.STOPPED} **Stopped**`);
    }

    if (pos < 0) pos += len;

    /** Cancel the auto increment. */
    Queue.current = pos - 1;

    Message.channel.send(`:arrow_right: **Jumped** to position \`${pos}\` in queue`);

    /** Stops current song. */
    Voice.Handler.end();
  }
}