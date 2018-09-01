/**
 * Deletes duplicates inside the queue.
 */
module.exports = {
  name: "uniq",
  desc: "Deletes all duplicates songs in the queue (first one of each is kept).",
  args: [],
  exec: ({Emojis, Server}, Message, Args) => {
    const Queue = Server.Queue;
    
    const len = Queue.length;
    if (len === 0) {
      return Message.channel.send(`${Emojis.WARNING} The queue is empty !`);
    }
  
    Queue.uniq();
    Message.channel.send(`${Emojis.SUCCESS} **Deleted duplicates** (${len - Queue.length} found).`);
  }
}