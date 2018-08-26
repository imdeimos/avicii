/**
 * === SETUP ===
 */

/** Google APIs manager. */
const {google} = require("googleapis");

/** YouTube API v3 initialiser. */
const Service = google.youtube({
	"version": "v3",
	"auth": process.env.YOUTUBE_API
});

/** YouTube video downloader. */
const ytdl = require("ytdl-core");

/**
 * === FUNCTIONS ===
 * Most functions are Promise-based and async.
 */

/**
* Simplify data retrieved from the API to get essentials.
*
* @param {Object} item
* @return {Object}
*/
function simplify(item) {
  /**
  * Duration is not returned, since it would take another API call.
  * @see https://issuetracker.google.com/issues/35170788
  */

  /** Check for unavailable videos. */
  if (!("thumbnails" in item.snippet)) return;

  /** ID is retrieved differently depending on the function that got info. */
  const id = item.kind == "youtube#video" ? item.id : (item.kind == "youtube#playlistItem" ? item.snippet.resourceId.videoId : item.id.videoId);

  let o = {
    "author": item.snippet.channelTitle,
    "id": id,
    "title": item.snippet.title,
    "url": `https://www.youtube.com/watch?v=${id}`
  };

  let thumbnails = item.snippet.thumbnails;

  /** Choose highest resolution thumbnail. */
  if ("maxres" in thumbnails) {
    o.thumbnail = thumbnails["maxres"].url;
  } else if ("standard" in thumbnails) {
    o.thumbnail = thumbnails["standard"].url;
  } else if ("high" in thumbnails) {
    o.thumbnail = thumbnails["high"].url;
  } else if ("medium" in thumbnails) {
    o.thumbnail = thumbnails["medium"].url;
  } else {
    o.thumbnail = thumbnails["default"].url;
  }

  return o;
}

/**
 * Searches for a query on YouTube and returns top results.
 *
 * @param {String} query
 * @param {Int} [maxResults]
 * @param {String} [type]
 * @return {Promise<Object[]>}
 */
function search(query, maxResults = 10, type = "video") {
  return new Promise((resolve, reject) => {
    Service.search.list({
      "part": "snippet",
      "q": query,
      "maxResults": maxResults,
      "type": type
    }, (err, info) => {
      if (err) reject(err);
      resolve(info.data.items.map(e => simplify(e)));
    });
  });
}

/**
 * Get ID from a URL.
 *
 * @param {String} url
 * @return {String}
 */
const getID = ytdl.getURLVideoID;

/**
 * Get playlist elements.
 *
 * @param {String} playlistId
 * @return {Promise<Object[]>}
 */
function getPlaylist(playlistId) {
  return new Promise((resolve, reject) => {
    /** The array containing the playlist items. */
    let res = [];

    /**
     * Loop to get items on every playlist page.
     *
     * @param {String} token - The first page token.
     * @return {Object[]}
     */
    function fetchAll(token) {
      Service.playlistItems.list({
        "part": "snippet",
        "playlistId": playlistId,
        "maxResults": 50,
        "pageToken": token
      }, (err, info) => {
        if (err) reject(err);

        res.push(...info.data.items.map(e => simplify(e)));
        const next = info.data.nextPageToken;

        if (next) {
          /** Recursivity. */
          fetchAll(next);
        } else {
          resolve(res);
        }
      });
    }

    Service.playlistItems.list({
      "part": "snippet",
      "playlistId": playlistId,
      "maxResults": 50
    }, (err, info) => {
      if (err) reject(err);

      res = info.data.items.map(e => simplify(e));
      const next = info.data.nextPageToken;

      /** Loop to get the whole playlist (if above 50 elements). */
      if (next) {
        fetchAll(next);
      } else {
        resolve(res);
      }
    });
  });
}

/**
 * Gets video information.
 *
 * @param {String} id - The video ID or a YouTube URL.
 * @return {Promise<Object>}
 */
function getVideo(id) {
  return new Promise((resolve, reject) => {
    try {
      /** This will return itself if ID is already correct. */
      id = ytdl.getVideoID(id);
    } catch (err) {
      /** ytdl will throw if it doesn't find an id. */
      reject(err);
    }

    Service.videos.list({
      "id": id,
      "part": "id,snippet"
    }, (err, info) => {
      if (err) reject(err);
      resolve(simplify(info.data.items[0]));
    });
  });
}

/**
 * Check if the given video ID is valid.
 *
 * @param {String} id
 * @return {Boolean}
 */
const validateID = ytdl.validateID;

/**
 * Check if the given url includes a valid ID.
 *
 * @param {String} url
 * @return {Boolean}
 */
const validateURL = ytdl.validateURL;

/** Exporting methods. */
module.exports = {
  search,

  getID,
  getPlaylist,
  getVideo,

  validateID,
  validateURL,

  ytdl
};
