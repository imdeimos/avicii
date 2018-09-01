/**
 * Returns the list of commands available, or if a name was given, gives more insight on one's usage.
 * 
 * @param {String} [name]
 */
module.exports = {
  name: "help",
  desc: "Returns a list of command or details on how to use specific command.",
  args: ["{String} name = *"],
  examples: ["**help**\n=> List of commands", "**help** play\n=> Adds an element to the queue."],
  exec: ({Client, Emojis, Settings}, Message, [name = "*"]) => {
    const Commands = Client.Commands;

    if (name == "*") {
      let embed = {
        "embed": {
          "color": 0xff0000,
          "author": {
            "name": "Prefix"
          },
          "title": Settings.get("PREFIX"),
          "description": "**Commandes**\n"
        }
      };
      Commands.map(e => {
        embed.embed.description += `- **${e.name}** : ${e.desc} \n`;
      });
      Message.channel.send(embed);
    } else {
      const command = Commands.find(e => e.name === name);
      if (!command) return Message.channel.send(`${Emojis.WARNING} Unknown command ${name}.`);

      let embed = {
        "embed": {
          "color": 0xff0000,
          "title": command.name,
          "description": command.desc,
          "fields": [
            {
              "name": "Arguments",
              "value": command.args.length === 0 ? "None." : command.args.map(e => `• @param ${e}\n`).join(""),
              "inline": true
            }
          ]
        }
      };

      if (command.examples) {
        embed.embed.fields.push({
          "name": "Examples",
          "value": command.examples.map(e => `• ${e}\n`).join("")
        });
      }
      
      Message.channel.send(embed);
    }
  }
}