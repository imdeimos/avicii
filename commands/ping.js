/**
 * Ping ? Pong ! Get latency (in ms).
 *
 * @return {Int}
 */
module.exports = {
  name: "ping",
  desc: "Get average latency to the Discord API, in milliseconds.",
  args: [],
  exec: ({Client, Emojis}, Message, Args) => {
    const ping = Math.round(Client.ping);
    Message.channel.send(`${Emojis.PING} Pong ! **${ping}**ms.`);
    return ping;
  }
}