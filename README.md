# 🌌 AltLife AI – Life Simulator

AltLife AI is an intelligent life simulation web application that predicts your future based on your choices, lifestyle, and career. Using Machine Learning, it analyzes your inputs and generates realistic predictions for **happiness, success, and financial growth**, along with a personalized life story.

---

## 🚀 Features

* 🔮 AI-based future prediction
* 📊 Happiness, Success & Finance scoring
* 📈 6-Year life projection graphs
* 📖 Personalized life story generation
* 🔐 User authentication (JWT)
* 📂 History tracking of predictions
* 📥 Download prediction as PDF

---

## 🧠 How It Works

1. User enters profile details (age, career, lifestyle, goals)
2. Selects a life path (e.g., Entrepreneurship, Corporate Ladder)
3. Machine Learning model predicts outcomes
4. System generates:

   * Scores (Happiness, Success, Finance)
   * 6-year projection
   * Realistic life story

The ML model is trained using synthetic data and a Random Forest algorithm.

---

## 🛠️ Tech Stack

### Frontend

* React.js
* CSS (custom UI)
* Recharts (data visualization)

### Backend

* Flask
* Flask-SQLAlchemy
* JWT Authentication

### Machine Learning

* Scikit-learn (Random Forest)
* Pandas, NumPy

### Database

* SQLite

---

## 📂 Project Structure

```
AltLife_AI/
│
├── frontend/ (React App)
├── backend/
│   ├── app.py
│   ├── models.py
│   ├── predict_api.py
│   ├── train_model.py
│   └── database.db
│
└── README.md
```

---

## ⚙️ Installation & Setup

### 1️⃣ Clone the repository

```
git clone https://github.com/riyabhutal/AltLife_AI.git
cd AltLife_AI
```

### 2️⃣ Backend Setup

```
cd backend
pip install -r requirements.txt
python app.py
```

### 3️⃣ Frontend Setup

```
cd frontend
npm install
npm run dev
```

---

## 📊 Machine Learning Model

* Model: RandomForestRegressor
* Multi-output prediction:

  * Happiness
  * Success
  * Finance
* Uses OneHotEncoding for categorical features

---

## 📸 Screenshots

### 🔐 Login / Signup

<img width="1333" height="568" alt="Screenshot 2026-01-03 010947" src="https://github.com/user-attachments/assets/5d9f76aa-6335-4148-a90a-4c66cad74e48" />

### 👤 Profile Creation

<img width="692" height="524" alt="Screenshot 2026-01-03 011233" src="https://github.com/user-attachments/assets/f0c238c3-5968-4c18-95ee-8b57ea75b400" />


### 🧭 Life Path Selection

<img width="672" height="497" alt="Screenshot 2026-01-03 011303" src="https://github.com/user-attachments/assets/141328d9-90b0-42bf-898f-82c7dea25944" />


### 📊 Prediction Result (Charts + Scores)

<img width="452" height="403" alt="Screenshot 2026-01-03 011328" src="https://github.com/user-attachments/assets/939766e9-cb40-475c-9b24-10abc83ac601" />


### 📖 Generated Story

<img width="324" height="241" alt="Screenshot 2026-01-03 011348" src="https://github.com/user-attachments/assets/f1f3566a-91e8-4dd9-83b5-ea2db4921073" />


### 🕓 History Dashboard

<img width="454" height="503" alt="Screenshot 2026-01-03 011358" src="https://github.com/user-attachments/assets/e88a1316-f054-49b9-bece-7fbcea144d11" />

---

## 💡 Future Improvements

* Real dataset integration
* More accurate ML models
* Deployment (AWS / Vercel)
* Social sharing of results

---

## 👩‍💻 Author

**Riya Bhutal**
BSc IT Student | Aspiring Data Analyst & Developer

---

## ⭐ Contribute

Feel free to fork, improve, and contribute to this project!

---

## 📜 License

This project is open-source and available under the MIT License.
