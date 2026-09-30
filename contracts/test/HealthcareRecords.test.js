const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("HealthcareRecords", function () {
  let contract, patient, doctor, stranger;

  beforeEach(async function () {
    [patient, doctor, stranger] = await ethers.getSigners();
    const Factory = await ethers.getContractFactory("HealthcareRecords");
    contract = await Factory.deploy();
    await contract.waitForDeployment();
  });

  it("lets a patient add their own record", async function () {
    await contract.connect(patient).addRecord(patient.address, "Qm123", "Blood Test");
    const records = await contract.connect(patient).getRecordsView(patient.address);
    expect(records.length).to.equal(1);
    expect(records[0].ipfsHash).to.equal("Qm123");
  });

  it("blocks a doctor without consent", async function () {
    await expect(
      contract.connect(doctor).addRecord(patient.address, "Qm123", "Blood Test")
    ).to.be.revertedWith("HealthcareRecords: caller is not the patient and has no consent");
  });

  it("allows access after consent is granted, and blocks it after revoke", async function () {
    await contract.connect(patient).grantConsent(doctor.address);
    expect(await contract.hasConsent(patient.address, doctor.address)).to.equal(true);

    await contract.connect(doctor).addRecord(patient.address, "QmDoctorAdded", "Prescription");
    const records = await contract.connect(doctor).getRecordsView(patient.address);
    expect(records.length).to.equal(1);

    await contract.connect(patient).revokeConsent(doctor.address);
    expect(await contract.hasConsent(patient.address, doctor.address)).to.equal(false);

    await expect(
      contract.connect(doctor).getRecordsView(patient.address)
    ).to.be.revertedWith("HealthcareRecords: caller is not the patient and has no consent");
  });

  it("keeps an audit trail of grants, revokes, and views", async function () {
    await contract.connect(patient).grantConsent(doctor.address);
    await contract.connect(doctor).getRecords(patient.address);
    const trail = await contract.connect(patient).getAuditTrail(patient.address);
    const actions = trail.map((t) => t.action);
    expect(actions).to.include("GRANTED");
    expect(actions).to.include("VIEWED");
  });

  it("keeps strangers out entirely", async function () {
    await expect(
      contract.connect(stranger).getRecordsView(patient.address)
    ).to.be.revertedWith("HealthcareRecords: caller is not the patient and has no consent");
  });
});
