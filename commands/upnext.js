/**
 * Shows a portion of the queue.
 */
module.exports = {
  name: "upnext",
  desc: "Get the songs enqueued after the current one.",
  args: [],
  exec: ({Emojis, Server}, Message, Args) => {
    const Queue = Server.Queue;
    
    const len = Queue.length;

    if (len === 0) return Message.channel.send(`${Emojis.WARNING} The queue is empty !`);

    const start = Queue.current ? Queue.current.get("index") : 0;
    const slice = Queue.slice(start, start + 10);

    let embed = {
      "embed": {
        "color": 0xff0000,
        "author": {
          "name": "Now playing",
          "icon_url": "https://yt3.ggpht.com/OgVV66t5vou1LkAbPh7yHbJA73Z2kKHs6-mFaeVFjnlU-pWESAPXFi-5pMASF7Mp1YLfoMdeI38v68U=s288-mo-c-c0xffffffff-rj-k-no"
        },
        "title": slice[0] ? `\`${start}.\` ${slice[0].get("title")}` : "None",
        "description": "\n\n:arrow_down: **Up next :** :arrow_down:\n",
        "footer": {
          "text": `Showing ${slice.length} out of ${Queue.length} elements.`
        }
      }
    }

    /** Remove current playing song. */
    slice.shift();

    if (slice.length === 0) embed.embed.description += "None";

    for (let i = 0; i < slice.length; i++) {
      let e = slice[i];
      embed.embed.description += `\`${e.get("index")}.\` ${e.get("title")}\n`;
    }

    Message.channel.send(embed);
  }
}