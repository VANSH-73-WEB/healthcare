import React, { useState } from "react";
import api from "../utils/api.js";

export default function DoctorDashboard() {
  const [patientEmail, setPatientEmail] = useState("");
  const [patient, setPatient] = useState(null);
  const [records, setRecords] = useState([]);
  const [file, setFile] = useState(null);
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLookup(e) {
    e.preventDefault();
    setStatus("Checking consent and fetching records...");
    try {
      const res = await api.get(`/records/patient/${patientEmail}`);
      setPatient(res.data.patient);
      setRecords(res.data.records);
      setStatus("");
    } catch (err) {
      setPatient(null);
      setRecords([]);
      setStatus(err.response?.data?.message || "Failed to fetch patient records.");
    }
  }

  async function handleUpload(e) {
    e.preventDefault();
    if (!file) return setStatus("Please choose a file first.");
    setLoading(true);
    setStatus("Uploading to IPFS and anchoring on-chain...");
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("description", description);
      formData.append("patientEmail", patientEmail);
      await api.post("/records/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setStatus("Record added for patient.");
      setFile(null);
      setDescription("");
      handleLookup(e);
    } catch (err) {
      setStatus(err.response?.data?.message || "Upload failed.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="container-page max-w-5xl py-12 space-y-8">
      <div>
        <span className="eyebrow mb-2">Your account</span>
        <h1 className="font-display text-2xl sm:text-3xl font-bold text-ink">
          Doctor Dashboard
        </h1>
      </div>

      {status && (
        <div className="bg-teal-50 border border-teal-500/20 text-ink text-sm px-4 py-3 rounded-xl">
          {status}
        </div>
      )}

      <section className="card-surface p-6 sm:p-7">
        <h2 className="font-display font-semibold text-ink mb-4">Look Up a Patient</h2>
        <form onSubmit={handleLookup} className="flex gap-2">
          <input
            type="email"
            placeholder="Patient's email"
            required
            className="flex-1 border border-ink/10 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-400 focus:border-transparent transition"
            value={patientEmail}
            onChange={(e) => setPatientEmail(e.target.value)}
          />
          <button className="btn-primary shrink-0 !px-5">Fetch Records</button>
        </form>
        <p className="text-xs text-body mt-2.5">
          You'll only be able to view records if the patient has granted your wallet consent.
        </p>
      </section>

      {patient && (
        <>
          <section className="card-surface p-6 sm:p-7">
            <h2 className="font-display font-semibold text-ink mb-4">
              Add a Record for {patient.name}
            </h2>
            <form onSubmit={handleUpload} className="space-y-3">
              <input
                type="text"
                placeholder="Description (e.g. Prescription - July 2026)"
                className="w-full border border-ink/10 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-400 focus:border-transparent transition"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
              <input
                type="file"
                className="w-full text-sm"
                onChange={(e) => setFile(e.target.files[0])}
              />
              <button type="submit" disabled={loading} className="btn-primary">
                {loading ? "Uploading..." : "Upload Record"}
              </button>
            </form>
          </section>

          <section className="card-surface p-6 sm:p-7">
            <h2 className="font-display font-semibold text-ink mb-4">
              Records for {patient.name} ({patient.email})
            </h2>
            <ul className="divide-y divide-ink/5">
              {records.length === 0 && (
                <li className="text-sm text-body py-2">No records found.</li>
              )}
              {records.map((r) => (
                <li key={r._id} className="py-3">
                  <p className="font-semibold text-ink text-sm">{r.description}</p>
                  <p className="text-xs text-body mt-0.5">
                    Uploaded by {r.uploadedBy?.name} on {new Date(r.createdAt).toLocaleString()}
                  </p>
                  <p className="text-xs text-body/70 break-all">
                    IPFS: {r.ipfsHash} &middot; Tx: {r.txHash}
                  </p>
                </li>
              ))}
            </ul>
          </section>
        </>
      )}
    </div>
  );
}
