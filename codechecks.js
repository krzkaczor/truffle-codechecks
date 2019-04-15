const { join } = require("path");
const fs = require("fs");
const { codechecks } = require("@codechecks/client");
const { values } = require("lodash");
const Units = require("ethereumjs-units");

module.exports.main = async function main() {
  await trackGas();
};

async function trackGas() {
  const gas = JSON.parse(fs.readFileSync(join(__dirname, "gas.json"), "utf-8"));
  codechecks.saveValue("gas", gas);
  if (!codechecks.isPr()) {
    return;
  }

  const previousGas = codechecks.getValue("gas");

  const gasSum = values(gas).reduce((a, c) => a + c, 0);
  const previousGasSum = values(previousGas).reduce((a, c) => a + c, 0);

  const change = previousGasSum
    ? (((gasSum - previousGasSum) / previousGasSum) * 100).toFixed(2)
    : "-- ";

  await codechecks.success({
    name: "Gas usage",
    shortDescription: `Total: ${gasSum} (Change: ${change}%)`,
  });
}

const BLOCK_GAS_LIMIT = 8000000;

function formatGas(gas) {
  return Units.lazyConvert(`${gas} wei`, "gwei");
}
