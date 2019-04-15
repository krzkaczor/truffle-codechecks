const { join } = require("path");
const fs = require("fs");
const { codechecks } = require("@codechecks/client");
const { values } = require("lodash");
const Units = require("ethereumjs-units");
const execa = require("execa");

const BLOCK_GAS_LIMIT = 8000000;
const gasPriceUsd = Units.convert(4, "gwei", "eth") * 161.48;

module.exports.main = async function main() {
  await trackGas();
  await graphContracts();
};

async function trackGas() {
  const gas = JSON.parse(fs.readFileSync(join(__dirname, "gas.json"), "utf-8"));
  codechecks.saveValue("gas", gas);
  if (!codechecks.isPr()) {
    return;
  }

  const previousGas = (await codechecks.getValue("gas")) || {};

  const gasSum = values(gas).reduce((a, c) => a + c, 0);
  const previousGasSum = values(previousGas).reduce((a, c) => a + c, 0);

  const change = previousGasSum
    ? (((gasSum - previousGasSum) / previousGasSum) * 100).toFixed(2)
    : "-- ";

  const report = [];
  for (const key of Object.keys(gas)) {
    const currentValue = gas[key];
    const previousValue = previousGas[key] || 0;

    report.push({
      name: key,
      gas: currentValue,
      diff: currentValue - previousValue,
      cost: "$" + (currentValue * gasPriceUsd).toFixed(2),
      blockLimit: ((currentValue / BLOCK_GAS_LIMIT) * 100).toFixed(2) + "%",
    });
  }

  await codechecks.success({
    name: "Gas usage",
    shortDescription: `Total: ${gasSum} (Change: ${change}%)`,
    longDescription: `
| Name | Gas | Diff | Cost | Block Limit % |
|:----:|:---:|:----:|:----:|:-------------:|
${report.map(r => `| ${r.name} | ${r.gas} | ${r.diff} | ${r.cost} | ${r.blockLimit} |`)}
    `,
  });
}

async function graphContracts() {
  await execa.shell("mkdir -p ./graphs");
  const output = await execa.shell(
    "./node_modules/.bin/surya graph contracts/MetaCoin.sol | dot -Tpng > graphs/contract.png",
  );
  if (output.stderr) {
    throw new Error(output.stderr);
  }
  await codechecks.saveCollection("graphs", join(__dirname, "./graphs"));
  const artifactLink = codechecks.getArtifactLink("graphs/contract.png");
  await codechecks.success({
    name: "Smart contract graph",
    shortDescription: "See smart contract graph",
    detailsUrl: {
      label: "Graph",
      url: artifactLink,
    },
  });
}
