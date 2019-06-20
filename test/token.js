const ERC20Basic = artifacts.require("ERC20Basic");

contract("MetaCoin", ([deployer, receiver]) => {
  it("estimate deployment gas", async () => {
    const contractInstance = await ERC20Basic.new(1000);
    // console.log(contractInstance);

    const gasDeployEstimation = await ERC20Basic.new.estimateGas(1000);
  });

  it("work", async () => {
    const contractInstance = await ERC20Basic.new(1000);

    const tx = await contractInstance.transfer(receiver, 100, { from: deployer });
  });
});
