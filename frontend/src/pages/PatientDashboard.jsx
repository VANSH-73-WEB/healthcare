import React, { useEffect, useState } from "react";
import api from "../utils/api.js";


export default function PatientDashboard() {
  const [records, setRecords] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [file, setFile] = useState(null);
  const [description, setDescription] = useState("");
  const [doctorEmail, setDoctorEmail] = useState("");
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);

  async function loadData() {
    const [recRes, docRes] = await Promise.all([
      api.get("/records/mine"),
      api.get("/consent/my-doctors"),
    ]);
    setRecords(recRes.data.records);
    setDoctors(docRes.data.doctors);
  }

  useEffect(() => {
    loadData();
  }, []);

  async function handleUpload(e) {
    e.preventDefault();
    if (!file) return setStatus("Please choose a file first.");
    setLoading(true);
    setStatus("Uploading to IPFS and anchoring on-chain...");
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("description", description);
      await api.post("/records/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setStatus("Record added successfully.");
      setFile(null);
      setDescription("");
      loadData();
    } catch (err) {
      setStatus(err.response?.data?.message || "Upload failed.");
    } finally {
      setLoading(false);
    }
  }

  async function handleGrantConsent(e) {
    e.preventDefault();
    setStatus("Granting consent on-chain...");
    try {
      await api.post("/consent/grant", { doctorEmail });
      setStatus(`Consent granted to ${doctorEmail}`);
      setDoctorEmail("");
      loadData();
    } catch (err) {
      setStatus(err.response?.data?.message || "Failed to grant consent.");
    }
  }

  async function handleRevoke(email) {
    setStatus("Revoking consent on-chain...");
    try {
      await api.post("/consent/revoke", { doctorEmail: email });
      setStatus(`Consent revoked for ${email}`);
      loadData();
    } catch (err) {
      setStatus(err.response?.data?.message || "Failed to revoke consent.");
    }
  }

  return (
    <div className="container-page max-w-5xl py-12 space-y-8">
      <div>
        <span className="eyebrow mb-2">Your account</span>
        <h1 className="font-display text-2xl sm:text-3xl font-bold text-ink">
          Patient Dashboard
        </h1>
      </div>

      {status && (
        <div className="bg-teal-50 border border-teal-500/20 text-ink text-sm px-4 py-3 rounded-xl">
          {status}
        </div>
      )}

      {/* Upload record */}
      <section className="card-surface p-6 sm:p-7">
        <h2 className="font-display font-semibold text-ink mb-4">Add a Medical Record</h2>
        <form onSubmit={handleUpload} className="space-y-3">
          <input
            type="text"
            placeholder="Description (e.g. Blood Test - July 2026)"
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

      {/* Consent management */}
      <section className="card-surface p-6 sm:p-7">
        <h2 className="font-display font-semibold text-ink mb-4">Manage Doctor Access</h2>
        <form onSubmit={handleGrantConsent} className="flex gap-2 mb-4">
          <input
            type="email"
            placeholder="Doctor's email"
            required
            className="flex-1 border border-ink/10 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-400 focus:border-transparent transition"
            value={doctorEmail}
            onChange={(e) => setDoctorEmail(e.target.value)}
          />
          <button className="btn-primary shrink-0 !px-5">Grant Access</button>
        </form>

        <ul className="divide-y divide-ink/5">
          {doctors.length === 0 && (
            <li className="text-sm text-body py-2">No doctors currently have access.</li>
          )}
          {doctors.map((d) => (
            <li key={d._id} className="flex justify-between items-center py-2.5">
              <span className="text-sm text-body">
                <strong className="text-ink">{d.name}</strong> ({d.specialization || d.role}) &mdash; {d.email}
              </span>
              <button
                onClick={() => handleRevoke(d.email)}
                className="text-alert-500 text-sm font-semibold hover:underline"
              >
                Revoke
              </button>
            </li>
          ))}
        </ul>
      </section>

      {/* Records list */}
      <section className="card-surface p-6 sm:p-7">
        <h2 className="font-display font-semibold text-ink mb-4">My Records</h2>
        <ul className="divide-y divide-ink/5">
          {records.length === 0 && (
            <li className="text-sm text-body py-2">No records uploaded yet.</li>
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
    </div>
  );
}
