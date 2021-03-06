/**
 * Randomly shuffles the queue.
 */
module.exports = {
  name: "shuffle",
  desc: "Shuffles the queue.",
  args: [],
  exec: ({Emojis, Server}, Message, Args) => {
    const Queue = Server.Queue;
    
    const len = Queue.length;

    if (len === 0) {
      return Message.channel.send(`${Emojis.WARNING} The queue is empty !`);
    }

    Queue.shuffle();
    Message.channel.send(`${Emojis.MUSIC_SHUFFLE} **Shuffled** ${len} elements`);
  }
}