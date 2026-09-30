const crypto = require("crypto");

/**
 * Uploads a file buffer to IPFS and returns its CID.
 *
 * This project ships with a lightweight local fallback (a SHA-256 content
 * hash) so the app runs out of the box without any external service. For a
 * real deployment, wire this up to `ipfs-http-client` pointed at Infura,
 * Pinata, or a self-hosted IPFS node using IPFS_API_URL from your .env, and
 * return the real CID from `client.add()` instead.
 */
async function uploadToIPFS(buffer) {
  if (process.env.IPFS_API_URL) {
    // Example real integration (requires `npm install ipfs-http-client`):
    //
    // const { create } = require("ipfs-http-client");
    // const client = create({ url: process.env.IPFS_API_URL });
    // const { cid } = await client.add(buffer);
    // return cid.toString();
    console.warn(
      "IPFS_API_URL is set but ipfs-http-client integration is not installed. " +
        "Falling back to local content hashing. See utils/ipfs.js."
    );
  }

  const hash = crypto.createHash("sha256").update(buffer).digest("hex");
  // Prefixed so it's visually distinguishable from a real IPFS CID in dev/demo mode.
  return `localhash-${hash}`;
}

function gatewayUrlFor(cid) {
  const base = process.env.IPFS_GATEWAY_URL || "https://ipfs.io/ipfs";
  return `${base}/${cid}`;
}

module.exports = { uploadToIPFS, gatewayUrlFor };
