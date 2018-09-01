/**
 * Finds items in the queue that matches the specified pattern.
 * 
 * @param {RegExp} pattern
 * @return {Song[]}
 */
module.exports = {
  name: "find",
  desc: "Finds items in the queue that matches the specified pattern. For more information on patterns, see [the MDN documentation](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions#Writing_a_regular_expression_pattern).",
  args: ["{RegExp} pattern"],
  examples: ["**find** trap\n=> 42 results"],
  exec: ({Server}, Message, Pattern) => {
    const Queue = Server.Queue;

    /** Pattern is the args array, so we need to join it. */
    Pattern = Pattern.join(" ");

    let m = {
      embed: {
        color: 0xff0000,
        title: `Results that matches \`${Pattern}\`:`,
        description: ""
      }
    }

    /** Convert it to RegExp. */
    Pattern = new RegExp(Pattern, "i");

    const results = Queue.filter(e => Pattern.test(e.get("title")));

    if (results.length == 0) {
      m.embed.description = "None.";
    } else {
      results.forEach(e => {
        m.embed.description += `\n\`${e.get("index")}\` ${e.get("title")}`;
      });
    }

    Message.channel.send(m);
  }
}