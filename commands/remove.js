/**
 * Removes a song from the queue.
 *
 * @param {Int} (Args.0) pos
 */
module.exports = {
  name: "remove",
  desc: "Removes a song from the queue.",
  args: ["{Int} pos"],
  exec: ({Emojis, Queue, VoiceHandler}, Message, [pos]) => {
    pos = Number(pos);

    const len = Queue.length;

    if (pos < 0) pos += len;

    if (len === 0) return Message.channel.send(`${Emojis.WARNING} The queue is empty !`);

    if (Math.abs(pos) >= len) return Message.channel.send(`${Emojis.WARNING} Invalid position: Argument out of queue size.`);

    if (Queue.current && Queue.current.get("index") == pos) return Message.channel.send(`${Emojis.WARNING} Can't delete the current playing song !`);

    Message.channel.send(`${Emojis.SUCCESS} **Removed** ${Queue.remove(pos).get("title")} from the queue`);
  }
}