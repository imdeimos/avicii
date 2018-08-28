const updateActivity = require("../lib/Utils.js").updateActivity;

/**
 * When the bot connects to the API.
 * @event ready
 */
module.exports = (Client) => {
  console.log("INFO: Client logged in.");
  updateActivity(Client).then(presence => {
    console.log("INFO: Activity set.");
  }).catch(console.error);
};
