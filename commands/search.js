const YouTube = require("../lib/YouTube.js");

/**
 * Searches a query on YouTube and lets you choose between the top 10 results.
 * 
 * @param {...String} query
 * @return {Object[10]}
 */
module.exports = {
  name: "search",
  desc: "Searches on YouTube for a query.",
  args: ["{String} query"],
  examples: ["**search** avicii\n=> 10 elements", "**play** <number>\n=> Playing Avicii - Wake me up !"],
  exec: ({Client, Emojis}, Message, Query) => {
    Query = Query.join(" ");

    if (!Query) {
      return Message.channel.send(`${Emojis.WARNING} No query given !`);
    }

    let m = {
      embed: {
        color: 0xff0000,
        title: `Search results for \`${Query}\``,
        description: ""
      }
    };

    YouTube.search(Query).then(res => {
      if (res.length === 0) {
        m.embed.description = "None.";
      } else {
        res.forEach((e, i) => {
          m.embed.description += `\n\`${i}\` ${e.title} | [Link](${e.url})`;
        });

        /** Add it as a property to the client object, for the play command. */
        Client.guilds.get(Message.guild.id).SearchResults = res;
      }
      Message.channel.send(m);
    }).catch(err => Message.channel.send(`${Emojis.FAILURE} Error: Unable to get search results.`) && console.error(err));
  }
}