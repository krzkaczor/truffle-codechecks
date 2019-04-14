const { join } = require("path");

const fs = require("fs");

const tracks = {};

module.exports = {
  track(operationName, gasUsed) {
    tracks[operationName] = gasUsed;
  },

  finish() {
    fs.writeFileSync(join(__dirname, "./gas.json"), JSON.stringify(tracks));
  },
};
