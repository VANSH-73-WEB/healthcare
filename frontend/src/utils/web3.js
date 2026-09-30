import { BrowserProvider, Contract } from "ethers";
import artifact from "../contractData/HealthcareRecords.json";

export async function connectWallet() {
  if (!window.ethereum) {
    throw new Error("MetaMask is not installed. Please install it to use wallet features.");
  }
  const provider = new BrowserProvider(window.ethereum);
  const accounts = await provider.send("eth_requestAccounts", []);
  return accounts[0];
}

export async function getConnectedAddress() {
  if (!window.ethereum) return null;
  const provider = new BrowserProvider(window.ethereum);
  const accounts = await provider.listAccounts();
  return accounts.length ? accounts[0].address : null;
}

// Returns a contract instance signed by the user's MetaMask account, after
// checking MetaMask is on the wallet the user registered with.
async function getSignedContract(expectedWallet) {
  if (!window.ethereum) {
    throw new Error("MetaMask is not installed.");
  }
  const provider = new BrowserProvider(window.ethereum);
  await provider.send("eth_requestAccounts", []);
  const signer = await provider.getSigner();
  const current = (await signer.getAddress()).toLowerCase();

  if (expectedWallet && current !== expectedWallet.toLowerCase()) {
    throw new Error(
      "MetaMask is on a different account than your registered wallet. Switch accounts and try again."
    );
  }
  return new Contract(artifact.address, artifact.abi, signer);
}

// Patient signs this, so msg.sender on-chain is the patient's wallet.
export async function grantConsentFromWallet(doctorWallet, patientWallet) {
  const contract = await getSignedContract(patientWallet);
  const tx = await contract.grantConsent(doctorWallet);
  const receipt = await tx.wait();
  return receipt.hash;
}

export async function revokeConsentFromWallet(doctorWallet, patientWallet) {
  const contract = await getSignedContract(patientWallet);
  const tx = await contract.revokeConsent(doctorWallet);
  const receipt = await tx.wait();
  return receipt.hash;
}