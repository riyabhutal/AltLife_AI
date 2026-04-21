import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import {
  FiHeart,
  FiTrendingUp,
  FiDollarSign,
  FiDownload,
  FiRefreshCw,
  FiClock,
  FiBookOpen,
} from "react-icons/fi";
import toast from "react-hot-toast";
import "./Outcome.css";

const API_URL = "http://127.0.0.1:5000/api";

export default function Outcome() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [result, setResult] = useState(null);
  const [animatedScores, setAnimatedScores] = useState({
    happiness: 0,
    success: 0,
    finance: 0,
  });

  useEffect(() => {
    const profile = sessionStorage.getItem("altlife_profile");
    const choice = sessionStorage.getItem("altlife_choice");

    if (!profile || !choice) {
      navigate("/profile");
      return;
    }

    const cached = sessionStorage.getItem("prediction_result");
    setLoading(true);

    if (cached) {
      const parsed = JSON.parse(cached);
      setTimeout(() => {
        setResult(parsed);
        animateScores(parsed.prediction);
        setLoading(false);
      }, 1500);
      return;
    }

    generatePrediction(JSON.parse(profile), choice);
  }, []);

  const animateScores = (prediction) => {
    let step = 0;
    const steps = 60;

    const timer = setInterval(() => {
      step++;
      const t = step / steps;

      setAnimatedScores({
        happiness: Math.round(prediction.happiness * t),
        success: Math.round(prediction.success * t),
        finance: Math.round(prediction.finance * t),
      });

      if (step >= steps) clearInterval(timer);
    }, 20);
  };

  const generatePrediction = async (profile, choice) => {
    const token = localStorage.getItem("altlife_token");

    try {
      const res = await fetch(`${API_URL}/outcome`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ ...profile, choice }),
      });

      const data = await res.json();
      setTimeout(() => {
        setResult(data);
        sessionStorage.setItem("prediction_result", JSON.stringify(data));
        animateScores(data.prediction);
        setLoading(false);
      }, 1500);
    } catch {
      toast.error("Prediction failed");
      setLoading(false);
    }
  };

  const handleDownloadPDF = async () => {
    if (!result?.outcome?.id) return;
    const token = localStorage.getItem("altlife_token");

    const res = await fetch(
      `${API_URL}/download/${result.outcome.id}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );

    const blob = await res.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "altlife_prediction.pdf";
    a.click();
    window.URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div className="outcome-page">
        <div className="loading-state">
          <div className="loading-animation">
            <div className="loading-ring" />
            <div className="loading-ring" />
            <div className="loading-ring" />
          </div>
          <h2>Analyzing Your Future</h2>
          <p>Our AI is exploring possibilities...</p>
        </div>
      </div>
    );
  }

  if (!result) return null;

  const { prediction, outcome } = result;

  return (
    <div className="outcome-page">
      <div className="container">

        <div className="page-header">
          <h1 className="page-title">Your Alternate Future</h1>
          <p className="page-subtitle">
            {outcome.name}, your {outcome.choice} journey
          </p>
        </div>

        <div className="metrics-grid animate-fade-up">
          <Metric icon={<FiHeart />} label="Happiness" value={animatedScores.happiness} color="happiness" />
          <Metric icon={<FiTrendingUp />} label="Success" value={animatedScores.success} color="success" />
          <Metric icon={<FiDollarSign />} label="Finance" value={animatedScores.finance} color="finance" />
        </div>

        {/* 🔥 GRAPH – ONLY THIS PART UPGRADED */}
        <div className="chart-section glass-card animate-fade-up stagger-2">
          <h3 className="chart-title">
            <FiTrendingUp /> 6-Year Projection
          </h3>

          <ResponsiveContainer width="100%" height={350}>
            <LineChart
              data={prediction.projection}
              margin={{ top: 20, right: 30, left: 10, bottom: 10 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.08)" />

              <XAxis
                dataKey="year"
                tickFormatter={(v) => `Year ${v}`}
                stroke="#a5b4fc"
                tick={{ fill: "#a5b4fc", fontSize: 12 }}
              />

              <YAxis
                domain={[0, 100]}
                stroke="#a5b4fc"
                tick={{ fill: "#a5b4fc", fontSize: 12 }}
              />

              <Tooltip
                cursor={{ stroke: "#7c3aed", strokeWidth: 1 }}
                labelFormatter={(l) => `Year ${l}`}
                contentStyle={{
                  background: "rgba(30, 27, 75, 0.95)",
                  border: "1px solid rgba(139, 92, 246, 0.4)",
                  borderRadius: "14px",
                  boxShadow: "0 12px 40px rgba(0,0,0,0.4)",
                  padding: "12px 14px",
                }}
                labelStyle={{ color: "#c7d2fe", fontWeight: 600 }}
              />

              <Legend verticalAlign="bottom" iconType="circle" />

              <Line type="monotone" dataKey="happiness" stroke="#10b981" strokeWidth={3}
                dot={{ r: 5, fill: "#10b981" }} activeDot={{ r: 7 }} />

              <Line type="monotone" dataKey="success" stroke="#6366f1" strokeWidth={3}
                dot={{ r: 5, fill: "#6366f1" }} activeDot={{ r: 7 }} />

              <Line type="monotone" dataKey="finance" stroke="#f59e0b" strokeWidth={3}
                dot={{ r: 5, fill: "#f59e0b" }} activeDot={{ r: 7 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="story-section glass-card animate-fade-up stagger-3">
          <h3 className="story-title"><FiBookOpen /> Your Story</h3>
          <p>{prediction.story}</p>
        </div>

        <div className="outcome-actions animate-fade-up stagger-4">
          <button className="btn btn-secondary" onClick={handleDownloadPDF}>
            <FiDownload /> Download PDF
          </button>
          <button className="btn btn-primary" onClick={() => navigate("/choices")}>
            <FiRefreshCw /> Try Another Path
          </button>
          <button className="btn btn-secondary" onClick={() => navigate("/history")}>
            <FiClock /> View History
          </button>
        </div>

      </div>
    </div>
  );
}

function Metric({ icon, label, value, color }) {
  return (
    <div className={`metric-card ${color}`}>
      <div className="metric-icon">{icon}</div>
      <div className="metric-content">
        <span className="metric-label">{label}</span>
        <span className="metric-value">{value}%</span>
      </div>
      <div className="metric-bar">
        <div className="metric-fill" style={{ width: `${value}%` }} />
      </div>
    </div>
  );
}
