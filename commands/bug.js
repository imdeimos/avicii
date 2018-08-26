/**
 * Show link to report a bug.
 *
 * @return {String}
 */
module.exports = {
  name: "bug",
  desc: "Sends link to report a bug.",
  args: [],
  exec: ({Emojis, packageJSON}, Message, Args) => {
    let link = packageJSON.bugs.url;
    Message.channel.send(`${Emojis.LINK} If you find a bug or whatever isn't working, report it to ${link}.`);
    return link;
  }
}