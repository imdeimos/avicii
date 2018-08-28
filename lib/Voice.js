/** Settings handler. */
const Settings = new (require("./Settings.js"))();

/** YouTube downloader. */
const ytdl = require("ytdl-core");

/**
 * An Audio handler that connects to a channel and provides stream manipulation,
 * i.e play, pause ...
 */
class VoiceHandler {
  /**
   * Initialize the Voice instance.
   *
   * @param {VoiceChannel} channel
   * @param {TextChannel} text
   * @param {Queue} queue
   */
  constructor(channel, text, queue) {
    /**
     * The channel to play audio to.
     * @type {VoiceChannel}
     */
    this.CHANNEL = channel;

    /**
     * The command channel.
     * @type {TextChannel}
     */
    this.TEXT_CHANNEL = text;

    /**
     * The connection to the channel.
     * @type {VoiceConnection}
     */
    this.CHANNEL.join().catch(console.error);

    /**
     * A reference to the waiting list.
     * @type {Queue}
     */
    this.QUEUE = queue;

    /**
     * The stream that is being played.
     * @type {?ReadableStream}
     */
    this.STREAM = null;

    /**
     * The current stream distpatcher, if any.
     * @type {?StreamDispatcher}
     */
    this.DISPATCHER = null;

    /**
     * Wheter or not the instance have been cleaned up.
     * @type {Boolean}
     */
    this._destroyed = false;

    /**
     * Triggered whenever a dispatcher "ends".
     * @private
     * 
     * @param {Boolean} [announceNext] - If given, overwrites settings "ANNOUNCE_PLAYING" value.
     */
    this._onend = (announceNext = true) => {
      const next = this.QUEUE.next;
      if (next !== null) {
        this.play(ytdl(next.get("url"), { filter: "audioonly", quality: "highestaudio" }));

        if (announceNext === true) {
          Settings.announcePlaying(this.TEXT_CHANNEL, next);
        }
      } else {
        this.destroy();
      }
    };
  }

  /**
   * Ends stream and destructs the instance.
   */
  destroy() {
    if (!this.DISPATCHER) return;
    
    /** Unbind the "end" event to avoid a loopception. */
    this.DISPATCHER.removeListener("end", this._onend);
    this.DISPATCHER.end();
    this.CHANNEL.leave();

    /** Clean up properties. */
    Object.keys(this).forEach(key => {
      this[key] = null;
    });

    this._destroyed = true;
  }

  /**
   * Ends the dispatcher.
   * 
   * @param {Boolean} [announceNext]
   */
  end(announceNext = true) {
    if (!this.DISPATCHER) return;
    this.DISPATCHER.end(announceNext);
  }

  /**
   * Get the bot's volume.
   * 
   * @return {Int}
   */
  getVolume() {
    return Settings.get("VOLUME");
  }

  /**
   * Check if the dispatcher is paused, or returns null if no dispatcher is found.
   *
   * @return {?Boolean}
   */
  isPaused() {
    return this.DISPATCHER && this.DISPATCHER.paused;
  }

  /**
   * Pauses the dispatcher.
   */
  pause() {
    if (this.DISPATCHER && !this.DISPATCHER.paused) this.DISPATCHER.pause();
  }

  /**
   * Plays a stream.
   *
   * @param {ReadableStream} stream
   */
  play(stream) {
    this.STREAM = stream;
    this.DISPATCHER = this.CHANNEL.connection.playStream(stream);

    const current = this.QUEUE.current;

    if (!current) {
      this.QUEUE.current = 0;
    } else {
      this.QUEUE.current = current.get("index") + 1;
    }

    this.setVolume(Settings.get("VOLUME"));

    /** Autoplay. */
    this.DISPATCHER.on("end", this._onend);
  }

  /**
   * Restarts current stream.
   */
  restart() {
    if (!this.DISPATCHER) return;

    this.DISPATCHER.removeListener("end", this._onend);
    this.DISPATCHER.end();
    
    /** Replays the same stream. */
    this.play(ytdl(this.QUEUE.current.get("url")), { filter: "audioonly", quality: "highestaudio" });
  }

  /**
   * Resumes the dispatcher.
   */
  resume() {
    if(this.DISPATCHER && this.DISPATCHER.paused) this.DISPATCHER.resume();
  }

  /**
   * Sets the dispatcher volume.
   * 
   * @param {Int} vol - An integer in the range [0, 200] (default: 100).
   */
  setVolume(vol) {
    if (!this.DISPATCHER) return;

    vol = Math.round(vol / 100);
    Settings.set("VOLUME", vol);
    this.DISPATCHER.setVolume(vol);
  }
}

module.exports = VoiceHandler;
