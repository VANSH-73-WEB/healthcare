// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/// @title HealthcareRecords
/// @notice Stores tamper-proof references (IPFS hashes) to patient medical
///         records on-chain, and enforces patient-controlled, consent-based
///         access for doctors and hospitals via smart contract logic.
/// @dev    Only the hash / CID of each record is stored on-chain. The actual
///         medical file lives off-chain on IPFS. This keeps gas costs low
///         while still giving every record a cryptographically verifiable
///         fingerprint and a permanent, auditable access trail.
contract HealthcareRecords {
    struct Record {
        string ipfsHash;     // IPFS CID of the encrypted medical file
        address uploadedBy;  // doctor / hospital wallet that added the record
        uint256 timestamp;   // block time the record was added
        string description;  // short label, e.g. "Blood Test - July 2026"
    }

    struct AccessLog {
        address accessor;
        uint256 timestamp;
        string action; // "GRANTED", "REVOKED", "VIEWED", "ADDED"
    }

    /// patient address => list of their records
    mapping(address => Record[]) private patientRecords;

    /// patient address => doctor address => has consent
    mapping(address => mapping(address => bool)) private consent;

    /// patient address => full audit trail
    mapping(address => AccessLog[]) private auditTrail;

    event RecordAdded(address indexed patient, address indexed addedBy, string ipfsHash, uint256 timestamp);
    event ConsentGranted(address indexed patient, address indexed doctor, uint256 timestamp);
    event ConsentRevoked(address indexed patient, address indexed doctor, uint256 timestamp);
    event RecordViewed(address indexed patient, address indexed viewer, uint256 timestamp);

    modifier onlySelfOrConsented(address patient) {
        require(
            msg.sender == patient || consent[patient][msg.sender],
            "HealthcareRecords: caller is not the patient and has no consent"
        );
        _;
    }

    /// @notice Patient adds their own record, or a consented doctor adds one
    ///         on behalf of the patient (e.g. after a checkup).
    function addRecord(
        address patient,
        string calldata ipfsHash,
        string calldata description
    ) external onlySelfOrConsented(patient) {
        patientRecords[patient].push(
            Record({
                ipfsHash: ipfsHash,
                uploadedBy: msg.sender,
                timestamp: block.timestamp,
                description: description
            })
        );
        auditTrail[patient].push(
            AccessLog({ accessor: msg.sender, timestamp: block.timestamp, action: "ADDED" })
        );
        emit RecordAdded(patient, msg.sender, ipfsHash, block.timestamp);
    }

    /// @notice Patient grants a doctor/hospital wallet permission to view
    ///         and (optionally) add records on their behalf.
    function grantConsent(address doctor) external {
        require(doctor != address(0), "HealthcareRecords: invalid address");
        consent[msg.sender][doctor] = true;
        auditTrail[msg.sender].push(
            AccessLog({ accessor: doctor, timestamp: block.timestamp, action: "GRANTED" })
        );
        emit ConsentGranted(msg.sender, doctor, block.timestamp);
    }

    /// @notice Patient revokes a previously granted consent.
    function revokeConsent(address doctor) external {
        consent[msg.sender][doctor] = false;
        auditTrail[msg.sender].push(
            AccessLog({ accessor: doctor, timestamp: block.timestamp, action: "REVOKED" })
        );
        emit ConsentRevoked(msg.sender, doctor, block.timestamp);
    }

    /// @notice Returns whether `doctor` currently has consent for `patient`.
    function hasConsent(address patient, address doctor) external view returns (bool) {
        return consent[patient][doctor];
    }

    /// @notice Fetches all records for a patient. Only callable by the
    ///         patient themselves or a doctor who currently holds consent.
    function getRecords(address patient)
        external
        onlySelfOrConsented(patient)
        returns (Record[] memory)
    {
        auditTrail[patient].push(
            AccessLog({ accessor: msg.sender, timestamp: block.timestamp, action: "VIEWED" })
        );
        emit RecordViewed(patient, msg.sender, block.timestamp);
        return patientRecords[patient];
    }

    /// @notice Read-only variant that does not write to the audit trail —
    ///         useful for the patient checking their own dashboard cheaply.
    function getRecordsView(address patient)
        external
        view
        onlySelfOrConsented(patient)
        returns (Record[] memory)
    {
        return patientRecords[patient];
    }

    /// @notice Returns the full, immutable audit trail for a patient.
    function getAuditTrail(address patient)
        external
        view
        onlySelfOrConsented(patient)
        returns (AccessLog[] memory)
    {
        return auditTrail[patient];
    }

    /// @notice Number of records stored for a patient (handy for the UI).
    function recordCount(address patient) external view returns (uint256) {
        return patientRecords[patient].length;
    }
}
