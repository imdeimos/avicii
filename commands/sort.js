/**
 * Sorts songs by title, ascending or descending.
 * 
 * @param {Char} [order]
 */
module.exports = {
  name: "sort",
  desc: "Sorts all songs, ascending (<) or descending (>).",
  args: ["{Char} order = <"],
  exec: ({Emojis, Queue}, Message, Args) => {
    Args[0] = Args[0] || '<';

    const len = Queue.length;

    if (len === 0) {
      return Message.channel.send(`${Emojis.WARNING} The queue is empty !`);
    }

    Queue.sort(Args[0] == '<');
    Message.channel.send(`${Emojis.SUCCESS} **Sorted** ${len} elements`);
  }
}