const hre = require("hardhat");
const fs = require("fs");
const path = require("path");

async function main() {
  const [deployer] = await hre.ethers.getSigners();
  console.log("Deploying contracts with account:", deployer.address);

  const HealthcareRecords = await hre.ethers.getContractFactory("HealthcareRecords");
  const contract = await HealthcareRecords.deploy();
  await contract.waitForDeployment();

  const address = await contract.getAddress();
  console.log("HealthcareRecords deployed to:", address);

  // Write the address + ABI out so the backend can pick them up directly.
  const artifact = await hre.artifacts.readArtifact("HealthcareRecords");
  const outDir = path.join(__dirname, "..", "deployed");
  fs.mkdirSync(outDir, { recursive: true });
  fs.writeFileSync(
    path.join(outDir, "HealthcareRecords.json"),
    JSON.stringify({ address, abi: artifact.abi }, null, 2)
  );
  console.log("Saved ABI + address to contracts/deployed/HealthcareRecords.json");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
