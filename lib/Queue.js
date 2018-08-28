/**
 * A song instance represents metadata (song info) - retrieved from the YouTube API - 
 * that could be downloaded into a readable Stream.
 * Queue store these instances as it's easier to both read and use.
 */
class Song {
  /**
   * Initialises a Song instance.
   *
   * @param {Object} info
   */
  constructor(info) {
    /**
     * Internal storage.
     * @type {Object}
     */
    this.DATA = info;

    /**
     * The list of keys stored.
     * @type {String[]}
     */
    this.KEYS = [
      /** Basic infos. */
      "author",
      "id",
      "thumbnail",
      "title",
      "url",

      /** Added in the {@link play} command. */
      "requestedBy",

      /** Updated by the {@link Queue} class. */
      "index"
    ];
  }

  /**
   * === METHODS ===
   */

  /**
   * Compares this song to another one based on their IDs.
   *
   * @param {Song} song
   * @return {Boolean}
   */
  equals(song) {
    return this.DATA.id === song.get("id");
  }

  /**
   * Get a key value.
   *
   * @param {String} key
   * @return {?*}
   */
  get(key) {
    return this.DATA.hasOwnProperty(key) ? this.DATA[key] : null;
  }

  /**
   * Sets a key value.
   *
   * @param {String} key
   * @param {*} value
   */
  set(key, value) {
    this.DATA[key] = value;
  }
}

/**
 * A First In First Out (FIFO) collection of songs to be played.
 */
class Queue extends Array {
  /**
   * Generates an Array instance with default values.
   *
   * @param {Song[]} [list]
   */
  constructor(...list) {
    /**
     * `this` will now refer to our list.
     * @type {Song[]}
     */
    super(...list);

    /**
     * Points to the current playing song.
     * @type {?Int}
     */
    this.INDEX_POINTER = null;

    /**
     * @private
     * Updates song indexes, like after a shuffle.
     */
    this._updateIndexes = () => {
      this.forEach((e, i) => {
        e.set("index", i);
      });
    };
  }

  /**
   * === GETTERS & SETTERS ===
   */

  /**
  * Get current song.
  *
  * @return {?Song}
  */
  get current() {
    return this[this.INDEX_POINTER] || null;
  }

  /**
   * Sets current song.
   *
   * @param {Song|Int} pos
   */
  set current(pos) {
    if (pos instanceof Song) {
      this.INDEX_POINTER = pos.get("index");
    } else {
      this.INDEX_POINTER = pos;
    }
  }

  /**
   * {@link Queue.get(0)}
   *
   * @return {?Song}
   */
  get first() {
    return this[0] || null;
  }

  /**
   * {@link Queue.get(-1)}
   *
   * @return {?Song}
   */
  get last() {
    return this[this.length - 1] || null;
  }

  /**
   * The song enqueued after the current one.
   *
   * @return {?Song}
   */
  get next() {
    return this[this.INDEX_POINTER + 1] || null;
  }

  /**
   * The previous song in the queue.
   *
   * @return {?Song}
   */
  get previous() {
    return this[this.INDEX_POINTER - 1] || null;
  }

  /**
   * === METHODS ===
   */

  /**
   * Empties the queue.
   */
  clear() {
    this.length = 0;
  }

  /**
   * Convenience function for `Queue.length === 0`
   *
   * @return {Boolean}
   */
  isEmpty() {
    return this.length === 0;
  }

  /**
   * Checks if the queue has a song declared as playing.
   *
   * @return {Boolean}
   */
  isPlaying() {
    return this.length !== 0 && this.INDEX_POINTER !== null;
  }

  /**
   * Appends one or more song to the end of the queue.
   *
   * @param {Song[]} ...elements
   * @return {Int} - The new queue length.
   */
  push(...elements) {
    const len = elements.length;
    for (let i = 0; i < len; i++) {
      if (!(elements[i] instanceof Song)) {
        elements[i] = new Song(elements[i]);
      }
      elements[i].set("index", len + i);
    }
    return Array.prototype.push.apply(this, elements);
  }

  /**
   * Removes a song from the queue.
   *
   * @param {Int} pos
   * @return {Song} - The removed element.
   */
  remove(pos) {
    const r = this.splice(pos, 1)[0];
    this._updateIndexes();
    return r;
  }

  /**
   * Randomly shuffle the queue using the
   * [Fischer-Yates Algorithm](https://en.wikipedia.org/wiki/Fisher–Yates_shuffle)
   *
   * @see https://jsperf.com/array-shuffle-comparator/5
   * @return {Queue}
   */
  shuffle() {
    const len = this.length;

    /** Check for unneeded cases (empty queue, singletons). */
    if (len === 0 || len === 1) return this;

    const current = this.current;

    /** Shuffle the playlist. */
    let temp, j;
		for (let i = 0; i < len; i++) {
			j = ~~(Math.random() * (i + 1));
			temp = this[i];
			this[i] = this[j];
			this[j] = temp;
		}
    this._updateIndexes();

    if (current) {
      /** Update current playing song index. */
      this.current = this.findIndex(e => e.equals(current));
    }

		return this;
  }

  /**
   * Sort the playlist by ascending/descending way.
   *
   * @param {Boolean} [ascending]
   * @return {Queue}
   */
  sort(ascending = true) {
    const len = this.length;

    /** Check for unneeded cases (empty queue, singletons). */
    if (len === 0 || len === 1) return this;

    const current = this.current;

    Array.prototype.sort.call(this, (a, b) => {
      const x = a.get("title").toLowerCase(), y = b.get("title").toLowerCase();
      let comparison = 0;

      if (x > y) {
        comparison = 1;
      } else if (x < y) {
        comparison = -1;
      }

      return ascending ? comparison : -comparison;
    });
    this._updateIndexes();

    if (current) {
      /** Update current playing song index. */
      this.current = this.findIndex(e => e.equals(current));
    }

    return this;
  }

  /**
   * Deletes duplicates song in the playlist, first instance is kept.
   *
   * @return {Playlist}
   */
  uniq() {
    const len = this.length;

    /** Check for unneeded cases (empty queue, singletons). */
    if (len === 0 || len === 1) return;

    /** Place the current song at the top of queue so it doesn't get deleted. */
    const current = this.current;
    this.unshift(current);
    this.splice(current.get("index"), 1);

    /** Counter of elements removed before the current song. */
    let removed = 0;
    let beforeCurrent = true;

    const ids = this.map(e => e.get("id"));

    this.splice(0, len, ...this.filter((v, i, a) => {
      /** Stop counting beyond the current song. */
      if (i === current.get("index")) {
        beforeCurrent = false;
      }

      let index = ids.indexOf(v.get("id"));
      if (beforeCurrent && index !== i) {
        removed += 1;
      }
      return index === i;
    }));

    /** Replace current to the new position. */
    this.shift();
    this.splice(current.get("index") - removed, 0, current);

    this._updateIndexes();

    return this;
  }
}

/** Exporting classes. */
module.exports = {
  Song,
  Queue
};
