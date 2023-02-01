/* Magic Mirror
 * Node Helper: MMM-LOLESPORTS-SCHEDULES
 *
 * By xadamxk
 * MIT Licensed.
 */

var NodeHelper = require("node_helper");
var LolesportsApi = require("esm")(module)("lolesports-js-sdk");
var defaultClient = LolesportsApi.ApiClient.instance;
var api = new LolesportsApi.EventsApi();

module.exports = NodeHelper.create({
  // Override socketNotificationReceived method.
  socketNotificationReceived: function (notification, payload) {
    let self = this;
    if (notification === "MMM-LOLESPORTS-SCHEDULES-GET-SCHEDULE") {
      defaultClient.basePath = payload["basePath"];
      defaultClient.authentications["apiKeyAuth"]["apiKey"] = payload["apiKey"];

      api.getSchedule(
        self.getLocale(payload["hl"]),
        { leagueId: payload["leagueId"] },
        function (error, data, response) {
          if (error) {
            console.error(error);
          } else {
            // console.log("API called successfully. Returned data: " + JSON.stringify(data));
            self.sendNotification("MMM-LOLESPORTS-SCHEDULES-SCHEDULE", data);
          }
        }
      );
    }
  },
  // Get correct locale
  getLocale: function (hl) {
    switch (hl) {
      case "en-US": {
        return LolesportsApi.Locale.enUS;
      }
      case "fr-FR": {
        return LolesportsApi.Locale.frFR;
      }
      default:
        return LolesportsApi.Locale.enUS;
    }
  },
  // Send Notification to module
  sendNotification: function (str, payload) {
    this.sendSocketNotification(str, payload);
  }
});
