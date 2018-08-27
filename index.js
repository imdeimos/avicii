/**
 * === SETUP ===
 */

/** We need fs since requiring package.json doesn't work. */
const fs = require("fs");
const packageJSON = JSON.parse(fs.readFileSync("./package.json"));

/** Discord API. */
const Discord = require("discord.js");
const Client = new Discord.Client();

/** Emojis used to stylize the bot. */
const Emojis = require("./config/Emojis.json");

/** Settings handler. */
const Settings = new (require("./lib/Settings.js"))();

/** Command prefix. */
const PREFIX = Settings.get("PREFIX");

/** Queue system. */
const Queue = new (require("./lib/Queue.js").Queue)();

/** Voice is an object, so that commands could use its properties. */
let Voice = {
  Handler: null
};

/**
 * === COMMAND HANDLER ===
 */

/** An object containing all commands. */
Client.Commands = new Discord.Collection();

/** Loop over the `commands` directory. */
fs.readdir("./commands/", (err, files) => {
  if (err) return console.error(err);

  /** Filter only .js files. */
  const commands = files.filter(file => file.split('.').pop() === "js");

  if (commands.length === 0) {
    return console.log(`ERROR: No commands found.`);
  }

  console.log(`INFO: Loading ${commands.length} commands ...`);

  commands.forEach(command => {
    let object = require(`./commands/${command}`);
    let name = command.split(".")[0];

    console.log(`INFO: Loaded ${command}`);

    /** Push the function to the Commands object. */
    Client.Commands.set(name, object);
  });
  console.log(`INFO: All commands are loaded successfully !`);
});

/**
 * === EVENTS ===
 */

/** Loop over the `events` directory. */
fs.readdir("./events/", (err, files) => {
  if (err) return console.error(err);

  files.forEach(file => {
    let func = require(`./events/${file}`);
    let name = file.split(".")[0];

    /** Bind the event to the client. */
    Client.on(name, (...args) => func(Client, ...args));
  });
});

/**
 * Whenever a message is sent.
 * @event Message
 */
Client.on("message", Message => {
  /** Filter only valid commands. */
  if (!Message.content.startsWith(PREFIX) || Message.author.bot) return;

  /** Decomposes the message to get two parts : name and args. */
  const Args = Message.content.slice(PREFIX.length).split(/ +/g);
  const Name = Args.shift().toLowerCase();

  /** Logs. */
  console.log("\n");
  console.log(`INFO: Received message: ${Message.content}`);
  console.log(`      by ${Message.author.username}`);
  console.log(`NAME: ${Name}`);
  console.log(`ARGS: ${Args}`);

  /**
   * Command code is splitted for easier read and maintenance.
   * Each command part is given an array of dependencies objects (Client, Queue ...), the Message instance and the arguments array.
   */

  /** Check if name is correct. */
  if (!Client.Commands.get(Name)) {
    return Message.channel.send(`${Emojis.FAILURE} Unknown command **${Name}**, check **${PREFIX}help** for a list of commands.`);
  }

  /** Call command. */
  Client.Commands.get(Name).exec({Client, Emojis, packageJSON, Queue, Settings, Voice}, Message, Args);
});

/** Login the bot with all our events binded. */
Client.login(process.env.TOKEN);
