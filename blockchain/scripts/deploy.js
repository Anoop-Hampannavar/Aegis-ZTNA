const hre = require("hardhat");

async function main() {
  const AccessLog = await hre.ethers.getContractFactory("AccessLog");
  const accessLog = await AccessLog.deploy();
  await accessLog.waitForDeployment();

  const contractAddress = await accessLog.getAddress();
  console.log("----------------------------------------------------");
  console.log("AccessLog Contract Deployed to:", contractAddress);
  console.log("----------------------------------------------------");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
