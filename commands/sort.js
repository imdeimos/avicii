/**
 * Sorts songs by title, ascending or descending.
 * 
 * @param {Char} [order]
 */
module.exports = {
  name: "sort",
  desc: "Sorts all songs, ascending (<) or descending (>).",
  args: ["{Char} order = <"],
  exec: ({Emojis, Server}, Message, [order]) => {
    const Queue = Server.Queue;

    if (!order || (order !== '<' && order !== '>')) {
      return Message.channel.send(`${Emojis.WARNING} Invalid argument, must be either **<** or **>**.`);
    }

    const len = Queue.length;

    if (len === 0) {
      return Message.channel.send(`${Emojis.WARNING} The queue is empty !`);
    }

    Queue.sort(order == '<');
    Message.channel.send(`${Emojis.SUCCESS} **Sorted** ${len} elements`);
  }
}