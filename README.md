# Decentralised Healthcare System Using Blockchain Technology

A full-stack MERN + Solidity application that lets patients securely store,
manage, and share their medical records without depending on a single
centralized hospital database. Large medical files live off-chain on IPFS;
their cryptographic hash, ownership, and access permissions are enforced
on-chain via Ethereum smart contracts — giving patients real control over who
can see their data, and a permanent, tamper-proof audit trail of every access.

---

## Table of Contents

- [Key Features](#key-features)
- [Tech Stack](#tech-stack)
- [System Architecture](#system-architecture)
- [Folder Structure](#folder-structure)
- [Getting Started](#getting-started)
  - [1. Smart Contracts](#1-smart-contracts)
  - [2. Backend](#2-backend)
  - [3. Frontend](#3-frontend)
- [Environment Variables](#environment-variables)
- [API Reference](#api-reference)
- [Smart Contract Reference](#smart-contract-reference)
- [Known Limitations & Future Scope](#known-limitations--future-scope)
- [License](#license)

---

## Key Features

- **Patient-controlled consent** — patients grant or revoke a doctor's/hospital's
  access to their records; enforced by a Solidity smart contract, not application logic.
- **Tamper-proof record storage** — files are stored on IPFS; only the hash and
  metadata are written on-chain, keeping gas costs low while guaranteeing integrity.
- **Role-based dashboards** — separate experiences for **Patients**, **Doctors**,
  and **Hospitals**.
- **On-chain audit trail** — every grant, revoke, add, and view is permanently
  logged and independently verifiable.
- **MetaMask wallet integration** — wallet addresses double as on-chain identities.
- **JWT authentication** — standard session handling for the web app layer,
  separate from blockchain-level access control.

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React (Vite), Tailwind CSS, React Router, Axios, Ethers.js |
| Backend | Node.js, Express.js, MongoDB (Mongoose), JWT, Multer |
| Blockchain | Solidity, Hardhat, Ethereum (local Hardhat network or Sepolia testnet) |
| File Storage | IPFS (pluggable — ships with a local dev fallback) |
| Wallet | MetaMask |

## System Architecture

```
 ┌────────────┐        ┌─────────────┐        ┌───────────────────┐
 │  React UI  │  REST  │   Express   │  reads  │      MongoDB      │
 │ (Vite +    │◄──────►│   Backend   │◄───────►│  (users, record   │
 │ Tailwind)  │        │             │  writes │   metadata cache) │
 └─────┬──────┘        └──────┬──────┘        └───────────────────┘
       │                      │
       │ MetaMask             │ ethers.js
       ▼                      ▼
 ┌─────────────────────────────────────┐        ┌─────────────────┐
 │     Ethereum Smart Contract          │        │      IPFS       │
 │     HealthcareRecords.sol            │◄──────►│  (file storage) │
 │  - record hashes                     │  CID   └─────────────────┘
 │  - consent mapping                   │
 │  - on-chain audit trail              │
 └─────────────────────────────────────┘
```

**Data flow for a new record:**
1. Patient (or a consented doctor) uploads a file from the dashboard.
2. Backend pushes the file to IPFS and gets back a CID (content hash).
3. Backend calls `addRecord()` on the smart contract, anchoring the CID + description on-chain.
4. MongoDB caches the metadata (CID, tx hash, description) for fast dashboard queries.
5. Every future access request is checked against the contract's `hasConsent()` before any data is returned.

## Folder Structure

```
decentralised-healthcare-system/
├── contracts/              # Solidity smart contracts (Hardhat project)
│   ├── contracts/HealthcareRecords.sol
│   ├── scripts/deploy.js
│   ├── test/HealthcareRecords.test.js
│   └── hardhat.config.js
├── backend/                # Express + MongoDB REST API
│   ├── config/db.js
│   ├── models/             # User, Record, Consent
│   ├── controllers/        # auth, record, consent logic
│   ├── routes/
│   ├── middleware/auth.js
│   ├── utils/blockchain.js # ethers.js contract bridge
│   ├── utils/ipfs.js
│   └── server.js
└── frontend/                # React (Vite) + Tailwind CSS
    └── src/
        ├── pages/           # Home, Login, Register, PatientDashboard, DoctorDashboard
        ├── components/      # Navbar, ProtectedRoute
        ├── context/AuthContext.jsx
        └── utils/           # api.js (axios), web3.js (MetaMask)
```

## Getting Started

You'll run three parts: the **smart contract** (deploy once), the **backend**,
and the **frontend**. Node.js 18+ and MongoDB (local or Atlas) are required.

### 1. Smart Contracts

```bash
cd contracts
npm install
cp .env.example .env      # fill in SEPOLIA_RPC_URL + PRIVATE_KEY if deploying to testnet

# Run tests
npm run test

# Option A: local Hardhat network (good for development)
npm run node                        # in one terminal — keep it running
npm run deploy:local                # in another terminal

# Option B: deploy to Sepolia testnet
npm run deploy:sepolia
```

After deployment, copy the generated `contracts/deployed/HealthcareRecords.json`
over `backend/contractData/HealthcareRecords.json` so the backend has the
correct ABI and contract address.

### 2. Backend

```bash
cd backend
npm install
cp .env.example .env      # fill in MONGO_URI, JWT_SECRET, RPC_URL, CONTRACT_ADDRESS, SERVER_WALLET_PRIVATE_KEY
npm run dev                # starts on http://localhost:5000
```

### 3. Frontend

```bash
cd frontend
npm install
cp .env.example .env      # set VITE_API_URL if backend isn't on localhost:5000
npm run dev                 # starts on http://localhost:5173
```

Open `http://localhost:5173`, register a **Patient** account and a **Doctor**
account (connect MetaMask to auto-fill each wallet address), then:
1. Log in as the patient → upload a record → grant consent to the doctor's email.
2. Log in as the doctor → look up the patient by email → view/add records.

## Environment Variables

See `.env.example` in each of `contracts/`, `backend/`, and `frontend/` for the
full list. Key ones:

| Variable | Where | Purpose |
|---|---|---|
| `MONGO_URI` | backend | MongoDB Atlas/local connection string |
| `JWT_SECRET` | backend | Signs session tokens |
| `RPC_URL` | backend | Ethereum node endpoint (Hardhat local or Sepolia via Infura/Alchemy) |
| `CONTRACT_ADDRESS` | backend | Deployed `HealthcareRecords` contract address |
| `SERVER_WALLET_PRIVATE_KEY` | backend | Relayer wallet that pays gas for demo transactions |
| `VITE_API_URL` | frontend | Backend base URL |

## API Reference

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/auth/register` | Create a patient/doctor/hospital account |
| POST | `/api/auth/login` | Login, returns a JWT |
| GET | `/api/auth/me` | Get the logged-in user's profile |
| POST | `/api/records/upload` | Upload a file → IPFS + on-chain anchor |
| GET | `/api/records/mine` | Patient: list their own records |
| GET | `/api/records/patient/:patientEmail` | Doctor: fetch a patient's records (consent-gated) |
| POST | `/api/consent/grant` | Patient grants a doctor access |
| POST | `/api/consent/revoke` | Patient revokes a doctor's access |
| GET | `/api/consent/my-doctors` | Patient: list doctors with active consent |
| GET | `/api/consent/check/:patientWallet` | Doctor: check their own consent status |

## Smart Contract Reference

`HealthcareRecords.sol` exposes:

- `addRecord(patient, ipfsHash, description)` — patient or a consented doctor adds a record
- `grantConsent(doctor)` / `revokeConsent(doctor)` — patient-only
- `hasConsent(patient, doctor)` — public view check
- `getRecords(patient)` / `getRecordsView(patient)` — consent-gated record retrieval
- `getAuditTrail(patient)` — full on-chain access history
- Events: `RecordAdded`, `ConsentGranted`, `ConsentRevoked`, `RecordViewed`

## Known Limitations & Future Scope

This is a synopsis/academic-stage build. Documented honestly so it holds up
under review:

- **Transaction signing**: the backend currently uses one relayer wallet to
  pay gas for demo purposes. In production, patient/doctor-specific actions
  (`grantConsent`, `addRecord`) should be signed client-side via MetaMask.
- **IPFS**: ships with a local SHA-256 fallback so the app runs with zero
  external dependencies. Swap in `ipfs-http-client` (Infura/Pinata) for real
  distributed storage — the integration point is clearly marked in `utils/ipfs.js`.
- **Regulatory compliance** (e.g. HIPAA-equivalent rules) is out of scope for
  this build and would need a dedicated compliance review before production use.
- **Scalability**: gas costs and blockchain write latency should be benchmarked
  before any real hospital-scale deployment; Layer-2 networks (e.g. Polygon)
  are a natural next step.

## License

MIT — free to use and adapt for academic and personal projects.
