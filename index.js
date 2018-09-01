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
const Queue = require("./lib/Queue.js").Queue;

const updateActivity = require("./lib/Utils.js").updateActivity;

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
    return console.error(`ERROR: No commands found.`);
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

  /** Filter only .js files. */
  const events = files.filter(file => file.split('.').pop() === "js");

  if (events.length === 0) {
    return console.error(`ERROR: No events found.`);
  }

  console.log(`\nINFO: Loading ${events.length} events ...`);

  files.forEach(file => {
    let func = require(`./events/${file}`);
    let name = file.split(".")[0];

    console.log(`INFO: Loaded ${file}`);

    /** Bind the event to the client. */
    Client.on(name, (...args) => func(Client, ...args));
  });
  console.log(`INFO: All events are loaded successfully !\n`);
});

/**
 * When the bot is connected to the Discord API.
 */
Client.on("ready", () => {
  console.log("INFO: Client logged in.");
  updateActivity(Client).then(presence => {
    console.log("INFO: Activity set.");
  }).catch(console.error);

  /**
   * === SERVERS ===
   */

  /** Bind to each guild a unique Queue and Voice instance. */
  Client.guilds.filter(e => e.available).forEach((guild, id) => {
    /**
     * The queue for each server.
     * @type {Queue}
     */
    guild.Queue = new Queue();

    /**
     * The voice handler.
     * @type {?VoiceHandler}
     */
    guild.Voice = null;
  });
});

/**
 * Whenever a message is sent.
 * @event Message
 */
Client.on("message", Message => {
  /** Filter only valid commands. */
  if (!Message.content.startsWith(PREFIX) || Message.author.bot || !Message.guild) return;

  /** Decomposes the message to get two parts : name and args. */
  const Args = Message.content.slice(PREFIX.length).split(/ +/g);
  const Name = Args.shift().toLowerCase();

  /** Logs. */
  console.log("\n");
  console.log(`INFO: Received message: ${Message.content}`);
  console.log(`      by ${Message.author.username}`);
  console.log(`NAME: ${Name}`);
  console.log(`ARGS: ${Args}`);

  /** The server the message was sent in. */
  const Server = Message.guild;

  /**
   * Command code is splitted for easier read and maintenance.
   * Each command part is given an array of dependencies objects (Client, Queue ...), the Message instance and the arguments array.
   */

  const Command = Client.Commands.get(Name);

  /** Check if name is correct. */
  if (!Command) {
    return Message.channel.send(`${Emojis.FAILURE} Unknown command **${Name}**, check **${PREFIX}help** for a list of commands.`);
  }

  /** Call command. */
  Command.exec({Client, Emojis, "Guilds": Client.guilds, packageJSON, Settings, Server}, Message, Args);
});

/** Login the bot with all our events binded. */
Client.login(process.env.TOKEN);