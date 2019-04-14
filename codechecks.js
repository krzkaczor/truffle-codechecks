const { join } = require("path");
const fs = require("fs");
const { codechecks } = require("codechecks");
const { values } = require("lodash");

module.exports = async function() {
  await trackGas();
};

async function trackGas() {
  const gas = JSON.parse(fs.readFileSync(join(__dirname, "gas.json"), "utf-8"));

  const gasSum = values(gas).reduce((a, c) => a + c, 0);

  await codechecks.success({ name: "Gas usage", shortDescription: `Total: ${gasSum}` });
}
