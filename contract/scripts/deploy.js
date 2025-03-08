const fs = require("fs");
const hre = require("hardhat");
const path = require("path");

async function main() {
  const taxFee = 5;
  const Contract = await hre.ethers.getContractFactory("Genesis");
  const contract = await Contract.deploy(taxFee); // passing tax in constructor

  // Wait for the deployment to complete
  await contract.waitForDeployment();

  // Get the contract address
  const contractAddress = await contract.getAddress();

  // Get the deployment transaction receipt
  const deploymentTransaction = contract.deploymentTransaction();
  const receipt = await deploymentTransaction.wait();

  // Get the block timestamp from the receipt
  const block = await hre.ethers.provider.getBlock(receipt.blockNumber);
  const deploymentTimestamp = block.timestamp;

  // Create a JSON object with the contract address and timestamp
  const deploymentInfo = {
    address: contractAddress,
    timestamp: deploymentTimestamp,
  };

  // Write the contract address and timestamp to the file
  fs.writeFile(
    path.join(__dirname, "../artifacts/contractAddress.json"),
    JSON.stringify(deploymentInfo, null, 4),
    "utf-8",
    (err) => {
      if (err) {
        console.error(err);
        return;
      }
      console.log("Deployed contract address:", contractAddress);
      console.log("Deployment timestamp:", deploymentTimestamp);
    }
  );
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
