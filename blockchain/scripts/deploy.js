const hre = require("hardhat");

async function main() {
  const AccessLog = await hre.ethers.getContractFactory("AccessLog");
  const contract = await AccessLog.deploy();
  await contract.waitForDeployment();

  console.log(`Contract deployed successfully to address: ${await contract.getAddress()}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});