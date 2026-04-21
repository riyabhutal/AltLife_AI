# predict_api.py
from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib, os
import pandas as pd
import numpy as np

app = Flask(__name__)
CORS(app)

MODEL_PATH = "model_artifacts/model.pkl"
model = None
if os.path.exists(MODEL_PATH):
    try:
        model = joblib.load(MODEL_PATH)
        print(f"[predict_api] Model loaded from {MODEL_PATH}")
    except Exception as e:
        print("[predict_api] ERROR loading model:", e)
else:
    print(f"[predict_api] Model NOT FOUND at {MODEL_PATH} — service will return fallback predictions")

@app.route("/", methods=["GET"])
def index():
    return {
        "status": "predict_api up",
        "model_loaded": bool(model),
        "model_path": MODEL_PATH if model else None
    }

@app.route("/predict", methods=["POST"])
def predict():
    """
    Request body accepted keys:
      - age (int)
      - career (str)
      - lifestyle (str)
      - choice (optional string; ML may ignore)
      - name/goals (ignored by ML)
    Response:
      { "model_used": <path or null>,
        "predictions": {"happiness": int, "success": int, "finance": int},
        "final_score": float(0..1)  # average mapped to 0..1
      }
    """
    data = request.json or {}
    age = data.get("age", 25)
    career = (data.get("career") or "unknown")
    lifestyle = (data.get("lifestyle") or "unknown")
    choice = data.get("choice") or "Career Path"

    # If model not loaded, return a deterministic fallback based on age/lifestyle/career
    if model is None:
        # simple deterministic-ish fallback
        try:
            age_i = int(age)
        except Exception:
            age_i = 25
        base = 0.5 + (min(45, max(18, age_i)) - 18) * 0.003  # slight upward drift with age
        if "art" in career.lower():
            base += 0.02
        if lifestyle.lower() == "relaxed":
            base += 0.04
        if lifestyle.lower() == "ambitious":
            base += 0.0
        base = max(0.05, min(0.95, base))
        happiness = int(max(0, min(100, (base + 0.12) * 100)))
        success = int(max(0, min(100, (base + 0.2) * 100)))
        finance = int(max(0, min(100, (base + 0.02) * 100)))
        final_score = round(((happiness + success + finance) / 3) / 100.0, 3)
        return jsonify({"model_used": None, "predictions": {"happiness": happiness, "success": success, "finance": finance}, "final_score": final_score})

    # If we have a model, build the DataFrame like train expects
    try:
        df = pd.DataFrame([{
            "age": int(age) if age is not None else 25,
            "career": career or "unknown",
            "lifestyle": lifestyle or "unknown",
            "choice": choice or "Career Path"
        }])

        preds = model.predict(df)  # expected shape: (1, 3) or flattened
        preds = np.clip(np.array(preds).flatten(), 0, 100)

        # Map predictions to happiness, success, finance
        if len(preds) >= 3:
            happiness, success, finance = [int(round(float(x))) for x in preds[:3]]
        else:
            v = int(round(float(preds[0]))) if preds.size > 0 else 50
            happiness = success = finance = max(0, min(100, v))

        final_score = round(((happiness + success + finance) / 3) / 100.0, 3)
        return jsonify({"model_used": MODEL_PATH, "predictions": {"happiness": happiness, "success": success, "finance": finance}, "final_score": final_score})
    except Exception as e:
        return jsonify({"error": "Prediction failed", "detail": str(e)}), 500

if __name__ == "__main__":
    app.run(debug=True, port=5001)
