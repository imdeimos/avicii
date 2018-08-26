/**
 * Shows the queue. You can see other pages as well, using &queue <number>.
 */
module.exports = {
  name: "queue",
  desc: "Shows the queue.",
  args: ["{Int} page = 1"],
  exec: ({Emojis, Queue}, Message, [page = 1]) => {
    page = Number(page);

    if (isNaN(page)) return Message.channel.send(`${Emojis.FAILURE} **queue** expects a valid number !`);

    const end = 25 * page;

    const slice = Queue.slice(end - 25, end);

    if (slice.length == 0) return Message.channel.send(`${Emojis.WARNING} The queue is empty !`);

    let res = `**Page ${page}**`;

    slice.forEach(e => {
      res += `\n\`${e.get("index")}\` ${e.get("title")}`;
    });

    res += `\n\n*Showing ${slice.length} out of ${Queue.length} elements.*`;

    Message.channel.send(res);
  }
}