const { ethers } = require("ethers");
const contractArtifact = require("../contractData/HealthcareRecords.json");

// The backend only ever READS from the blockchain. Every transaction that
// changes state (grantConsent, revokeConsent, addRecord) is signed by the
// user's own MetaMask wallet in the frontend.

const ZERO_ADDRESS = "0x0000000000000000000000000000000000000000";

let provider;
let warnedAboutAddress = false;

function getProvider() {
  if (!provider) {
    if (!process.env.RPC_URL) {
      throw new Error("RPC_URL is not set in backend/.env");
    }
    provider = new ethers.JsonRpcProvider(process.env.RPC_URL);
  }
  return provider;
}

// The address in contractData/HealthcareRecords.json (written by the deploy
// script) is the source of truth. CONTRACT_ADDRESS in .env is only used when
// the JSON still holds the placeholder address.
function getContractAddress() {
  const fromFile = contractArtifact.address;
  const fromEnv = process.env.CONTRACT_ADDRESS;
  const fileHasAddress = fromFile && fromFile.toLowerCase() !== ZERO_ADDRESS;

  if (fileHasAddress) {
    if (fromEnv && fromEnv.toLowerCase() !== fromFile.toLowerCase() && !warnedAboutAddress) {
      warnedAboutAddress = true;
      console.warn(
        `[blockchain] CONTRACT_ADDRESS in .env (${fromEnv}) differs from the address in ` +
          `contractData/HealthcareRecords.json (${fromFile}). Using the JSON address.`
      );
    }
    return fromFile;
  }
  if (!fromEnv) {
    throw new Error(
      "No contract address. Deploy the contract and copy contracts/deployed/HealthcareRecords.json " +
        "into backend/contractData/."
    );
  }
  return fromEnv;
}

function getReadOnlyContract() {
  if (!contractArtifact.abi || contractArtifact.abi.length === 0) {
    throw new Error(
      "backend/contractData/HealthcareRecords.json has an empty ABI. Copy the file from " +
        "contracts/deployed/ after deploying, then restart the backend."
    );
  }
  return new ethers.Contract(getContractAddress(), contractArtifact.abi, getProvider());
}

async function hasConsentOnChain(patientWallet, doctorWallet) {
  const address = getContractAddress();
  const code = await getProvider().getCode(address);
  if (code === "0x") {
    throw new Error(
      `No contract deployed at ${address} on ${process.env.RPC_URL}. If you restarted the Hardhat ` +
        "node, redeploy (npm run deploy:local) and copy the new JSON into backend/ and frontend/."
    );
  }
  return getReadOnlyContract().hasConsent(patientWallet, doctorWallet);
}

module.exports = {
  getProvider,
  getContractAddress,
  getReadOnlyContract,
  hasConsentOnChain,
};