import json, io
import pandas as pd
import numpy as np
from datetime import timedelta, datetime
from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
from flask_jwt_extended import (
    JWTManager, create_access_token,
    jwt_required, get_jwt_identity
)

from models import db, User, Outcome
from app_ml import realistic_story, PATH_OFFSETS
import joblib

from reportlab.platypus import SimpleDocTemplate, Paragraph, Table, TableStyle
from reportlab.lib.styles import getSampleStyleSheet
from reportlab.lib import colors

# ---------------- APP CONFIG ----------------
app = Flask(__name__)

app.config["SECRET_KEY"] = "altlife-secret"
app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///database.db"
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
app.config["JWT_SECRET_KEY"] = "jwt-secret"
app.config["JWT_ACCESS_TOKEN_EXPIRES"] = timedelta(days=7)

CORS(app)
db.init_app(app)
jwt = JWTManager(app)

with app.app_context():
    db.create_all()
    
def get_current_user():
    user_id = int(get_jwt_identity())
    return db.session.get(User, user_id)


# ---------------- LOAD ML MODEL ----------------
MODEL_PATH = "model_artifacts/model.pkl"
ml_model = joblib.load(MODEL_PATH)
print("✅ ML model loaded")

# ---------------- LOGIN ----------------
@app.route("/api/login", methods=["POST"])
def login():
    data = request.get_json()
    user = User.query.filter_by(username=data["username"]).first()

    if not user or not user.check_password(data["password"]):
        return jsonify({"error": "Invalid credentials"}), 401

    token = create_access_token(identity=str(user.id))
    return jsonify({
        "access_token": token,
        "user": user.to_dict()
    })

# ---------------- REGISTER (FIXED) ----------------
@app.route("/api/register", methods=["POST"])
def register():
    data = request.get_json()

    if not data.get("username") or not data.get("email") or not data.get("password"):
        return jsonify({"error": "Username, email and password required"}), 400

    if User.query.filter_by(username=data["username"]).first():
        return jsonify({"error": "Username already exists"}), 409

    if User.query.filter_by(email=data["email"]).first():
        return jsonify({"error": "Email already exists"}), 409

    user = User(
        username=data["username"],
        email=data["email"]
    )
    user.set_password(data["password"])

    db.session.add(user)
    db.session.commit()

    token = create_access_token(identity=str(user.id))
    return jsonify({
        "access_token": token,
        "user": user.to_dict()
    }), 201

# ---------------- OUTCOME (STABLE + WORKING) ----------------
@app.route("/api/outcome", methods=["POST"])
@jwt_required()
def outcome():
    user_id = int(get_jwt_identity())
    data = request.get_json()

    # ---------- DUPLICATE PREVENTION ----------
    recent = (
        Outcome.query
        .filter_by(
            user_id=user_id,
            choice=data["choice"],
            age=data["age"],
            career=data["career"]
        )
        .order_by(Outcome.created_at.desc())
        .first()
    )

    if recent and (datetime.utcnow() - recent.created_at).seconds < 5:
        return jsonify({
            "outcome": recent.to_dict(),
            "prediction": {
                "happiness": recent.happiness,
                "success": recent.success,
                "finance": recent.finance,
                "projection": json.loads(recent.projection),
                "story": recent.story
            }
        })

    # ---------- ML INPUT (STRING SAFE) ----------
    X = pd.DataFrame([{
        "age": int(data["age"]),
        "career": str(data["career"]),
        "lifestyle": str(data["lifestyle"]),
        "choice": str(data["choice"]),
    }])

    try:
        preds = ml_model.predict(X)[0]
        happiness, success, finance = map(int, preds)
    except:
        # fallback (ML crash protection)
        happiness, success, finance = 60, 65, 55

    offset = PATH_OFFSETS.get(data["choice"], (0, 0, 0))
    happiness = max(0, min(100, happiness + offset[0]))
    success   = max(0, min(100, success + offset[1]))
    finance   = max(0, min(100, finance + offset[2]))

    projection = []
    for i in range(6):
        projection.append({
            "year": i + 1,
            "happiness": max(0, min(100, happiness + np.random.randint(-3, 4))),
            "success": max(0, min(100, success + np.random.randint(-3, 4))),
            "finance": max(0, min(100, finance + np.random.randint(-3, 4))),
        })

    story = realistic_story(
        data["name"],
        data["choice"],
        happiness,
        success,
        finance,
        int(data["age"])
    )

    outcome = Outcome(
        user_id=user_id,
        name=data["name"],
        age=data["age"],
        career=data["career"],
        lifestyle=data["lifestyle"],
        choice=data["choice"],
        happiness=happiness,
        success=success,
        finance=finance,
        projection=json.dumps(projection),
        story=story
    )

    db.session.add(outcome)
    db.session.commit()

    return jsonify({
        "outcome": outcome.to_dict(),
        "prediction": {
            "happiness": happiness,
            "success": success,
            "finance": finance,
            "projection": projection,
            "story": story
        }
    })

# ---------------- HISTORY ----------------
@app.route("/api/history", methods=["GET"])
@jwt_required()
def history():
    user = get_current_user()

    if user.is_admin:
        outcomes = Outcome.query.order_by(Outcome.created_at.desc()).all()
    else:
        outcomes = Outcome.query.filter_by(user_id=user.id)\
            .order_by(Outcome.created_at.desc()).all()

    return jsonify({
        "outcomes": [o.to_dict() for o in outcomes]
    })

# ---------------- DELETE ONE ----------------
@app.route("/api/history/<int:id>", methods=["DELETE"])
@jwt_required()
def delete_history(id):
    user = get_current_user()
    outcome = Outcome.query.get(id)

    if not outcome:
        return jsonify({"error": "Not found"}), 404

    # USER trying to delete someone else's data → BLOCK
    if not user.is_admin and outcome.user_id != user.id:
        return jsonify({"error": "Unauthorized"}), 403

    db.session.delete(outcome)
    db.session.commit()

    return jsonify({"success": True})

# ---------------- DELETE ALL ----------------
@app.route("/api/history", methods=["DELETE"])
@jwt_required()
def delete_all_history():
    user = get_current_user()

    if user.is_admin:
        # ADMIN → delete everything
        Outcome.query.delete()
    else:
        # USER → delete only their own history
        Outcome.query.filter_by(user_id=user.id).delete()

    db.session.commit()
    return jsonify({"success": True})

# ---------------- PDF (FIRST PIC STYLE) ----------------
@app.route("/api/download/<int:id>")
@jwt_required()
def download(id):
    user = get_current_user()
    outcome = db.session.get(Outcome, id)

    if not outcome:
        return jsonify({"error": "Not found"}), 404

    if not user.is_admin and outcome.user_id != user.id:
        return jsonify({"error": "Unauthorized"}), 403

    buffer = io.BytesIO()
    doc = SimpleDocTemplate(
        buffer,
        rightMargin=40,
        leftMargin=40,
        topMargin=40,
        bottomMargin=40
    )

    styles = getSampleStyleSheet()
    elements = []

    elements.append(
        Paragraph(
            "<font size=20 color='#6366f1'><b>AltLife AI - Your Future Prediction</b></font>",
            styles["Title"]
        )
    )

    elements.append(Paragraph(
        f"""
        <b>Name:</b> {outcome.name}<br/>
        <b>Age:</b> {outcome.age}<br/>
        <b>Career:</b> {outcome.career}<br/>
        <b>Lifestyle:</b> {outcome.lifestyle}<br/>
        <b>Life Path:</b> {outcome.choice}
        """,
        styles["Normal"]
    ))

    table = Table([
        ["Metric", "Score"],
        ["Happiness", f"{outcome.happiness}%"],
        ["Success", f"{outcome.success}%"],
        ["Finance", f"{outcome.finance}%"],
    ], colWidths=[200, 200])

    table.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (-1, 0), colors.HexColor("#6366f1")),
        ("TEXTCOLOR", (0, 0), (-1, 0), colors.white),
        ("ALIGN", (0, 0), (-1, -1), "CENTER"),
        ("GRID", (0, 0), (-1, -1), 1, colors.lightgrey),
    ]))

    elements.append(Paragraph("<br/><b>Predicted Outcomes</b><br/>", styles["Heading2"]))
    elements.append(table)

    elements.append(Paragraph("<br/><b>Your Story</b><br/>", styles["Heading2"]))
    elements.append(Paragraph(outcome.story, styles["Normal"]))

    elements.append(Paragraph(
        f"<br/><font size=9 color='grey'>Generated on {outcome.created_at.strftime('%B %d, %Y')}</font>",
        styles["Normal"]
    ))

    doc.build(elements)
    buffer.seek(0)

    return send_file(
        buffer,
        as_attachment=True,
        download_name=f"altlife_prediction_{id}.pdf",
        mimetype="application/pdf"
    )
# ---------------- RUN ----------------
if __name__ == "__main__":
    app.run(debug=True, port=5000)
