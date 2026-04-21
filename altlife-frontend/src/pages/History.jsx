import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  FiClock,
  FiDownload,
  FiTrash2,
  FiHeart,
  FiTrendingUp,
  FiDollarSign,
  FiRefreshCw,
} from "react-icons/fi";
import toast from "react-hot-toast";
import "./History.css";

const API_URL = "http://127.0.0.1:5000/api";

export default function History() {
  const navigate = useNavigate();
  const [outcomes, setOutcomes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [confirmId, setConfirmId] = useState(null);

  // 🔥 STRICT MODE FIX
  const fetchedOnce = useRef(false);

  useEffect(() => {
    if (fetchedOnce.current) return;
    fetchedOnce.current = true;
    loadHistory();
  }, []);

  const loadHistory = async () => {
    const token = localStorage.getItem("altlife_token");
    if (!token) return navigate("/login");

    try {
      const res = await fetch(`${API_URL}/history`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setOutcomes(data.outcomes || []);
    } catch {
      toast.error("Failed to load history");
    } finally {
      setLoading(false);
    }
  };

  // 🔥🔥 PDF DOWNLOAD (ONLY ADDITION)
  const downloadPDF = async (id) => {
    const token = localStorage.getItem("altlife_token");

    try {
      const res = await fetch(`${API_URL}/download/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) throw new Error();

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = `altlife_prediction_${id}.pdf`;
      document.body.appendChild(a);
      a.click();

      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch {
      toast.error("PDF download failed");
    }
  };

  const deleteOne = async (id) => {
    const token = localStorage.getItem("altlife_token");
    try {
      await fetch(`${API_URL}/history/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      setOutcomes((prev) => prev.filter((o) => o.id !== id));
      setConfirmId(null);
      toast.success("Prediction deleted");
    } catch {
      toast.error("Delete failed");
    }
  };

  if (loading) {
    return (
      <div className="history-page">
        <div className="page-header">
          <h1 className="page-title">Your History</h1>
          <p className="page-subtitle">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="history-page">
      <div className="container">

        <div className="page-header">
          <h1 className="page-title">Your History</h1>
          <p className="page-subtitle">
            You've explored {outcomes.length} alternate future
            {outcomes.length !== 1 && "s"}
          </p>
        </div>

        <div className="history-grid">
          {outcomes.map((o, i) => (
            <div
              key={o.id}
              className="history-card animate-fade-up"
              style={{ animationDelay: `${i * 0.08}s` }}
            >
              {confirmId === o.id && (
                <div className="delete-overlay">
                  <p>Delete this prediction?</p>
                  <div className="delete-actions">
                    <button
                      className="btn-cancel"
                      onClick={() => setConfirmId(null)}
                    >
                      Cancel
                    </button>
                    <button
                      className="btn-delete"
                      onClick={() => deleteOne(o.id)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              )}

              <div className={`card-content ${confirmId === o.id ? "blur" : ""}`}>
                <div className="history-top">
                  <span className="path-pill">
                    {o.choice.toUpperCase()}
                  </span>

                  <span className="history-date">
                    <FiClock />{" "}
                    {new Date(o.created_at + "Z").toLocaleString("en-IN", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                      hour12: true,
                    })}
                  </span>
                </div>

                <h3 className="history-name">{o.name}</h3>
                <p className="history-sub">
                  {o.age} years old, {o.career}
                </p>

                <div className="divider" />

                <div className="history-metrics">
                  <div className="metric">
                    <FiHeart className="h" /> {o.happiness}%
                  </div>
                  <div className="metric">
                    <FiTrendingUp className="s" /> {o.success}%
                  </div>
                  <div className="metric">
                    <FiDollarSign className="f" /> {o.finance}%
                  </div>
                </div>

                <div className="history-actions">
                  {/* ✅ PDF DOWNLOAD FIX */}
                  <button
                    className="icon-btn"
                    onClick={() => downloadPDF(o.id)}
                  >
                    <FiDownload />
                  </button>

                  <button
                    className="icon-btn danger"
                    onClick={() => setConfirmId(o.id)}
                  >
                    <FiTrash2 />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="history-footer">
          <button
            onClick={() => navigate("/choices")}
            className="btn btn-primary"
          >
            <FiRefreshCw /> Explore New Path
          </button>
        </div>

      </div>
    </div>
  );
}
