module.exports = {
  solc: {
    optimizer: {
      enabled: true,
      runs: 200,
    },
  },
  mocha: {
    reporter: "eth-gas-reporter",
    reporterOptions: {
      codechecks: true
    }
  }
};
