const gasUsageTracker = require("../codecheck-gas-usage");

const ERC20Basic = artifacts.require("ERC20Basic");

contract("MetaCoin", ([deployer, receiver]) => {
  it("estimate deployment gas", async () => {
    const contractInstance = await ERC20Basic.new(1000);
    // console.log(contractInstance);

    const gasDeployEstimation = await ERC20Basic.new.estimateGas(1000);
    gasUsageTracker.track("deployment", gasDeployEstimation);
  });

  it("work", async () => {
    const contractInstance = await ERC20Basic.new(1000);

    const tx = await contractInstance.transfer(receiver, 100, { from: deployer });

    gasUsageTracker.track("transfer", tx.receipt.gasUsed);
  });

  after(() => {
    gasUsageTracker.finish();
  });
});
