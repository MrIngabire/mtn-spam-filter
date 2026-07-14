
# 🛡️ MTN Smart Filter: AI-Powered MoMo Fraud Detection

![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![FastAPI](https://img.shields.io/badge/FastAPI-005571?style=for-the-badge&logo=fastapi)
![Android](https://img.shields.io/badge/Android-3DDC84?style=for-the-badge&logo=android&logoColor=white)
![Scikit-Learn](https://img.shields.io/badge/scikit--learn-%23F7931E.svg?style=for-the-badge&logo=scikit-learn&logoColor=white)

An intelligent, edge-to-cloud SMS spam filtering system designed to combat localized Mobile Money (MoMo) fraud, Kinyarwanda phishing, and data drift in Rwanda. 

Developed as an academic research project for the **University of Kigali (School of Computing and Information Technology)**.

---

## 📖 Project Overview

Standard rule-based SMS filters often fail against localized telecommunications fraud (such as "Fake Reversals" and "Data Drift" where scammers obfuscate words like `bl0cked` or `t0mb0la`). 

The **MTN Smart Filter** solves this through a decoupled architecture:
1. **The Edge (Android):** A background service silently intercepts incoming SMS messages before the user interacts with them.
2. **The Brain (AI API):** A custom-trained Random Forest model analyzes the text using TF-IDF N-Grams to catch contextual fraud phrases in both English and Kinyarwanda.
3. **The Command Center (React):** A role-based web dashboard allows MTN Network Administrators to view live threat trends, monitor intercepted scams, and manage the machine learning dataset.

---

## ✨ Key Features

* **📱 Background SMS Interception:** Android `BroadcastReceiver` catches messages and alerts users with a localized UI Threat Card if fraud is detected.
* **🧠 N-Gram NLP Model:** Upgraded from Naive Bayes to a `RandomForestClassifier` with Bigrams `(1,2)` to understand multi-word context (e.g., "5000 RWF" or "MTN Tombola").
* **🔐 Role-Based Access Control (RBAC):** Distinct dashboard views for MTN Subscribers (Scan History), MTN Workers (Live Threat Logs), and System Admins (Model Health).
* **📊 Real-Time Visual Analytics:** Live-updating network trend charts built with `Recharts`.
* **💾 Edge & Cloud Persistence:** Uses `SharedPreferences` for local mobile storage and `SQLite` for permanent cloud backend logging.

---

## 🏗️ System Architecture

1. **Data Ingestion:** Android OS -> `SmsReceiver` -> HTTP POST Request.
2. **Backend Processing:** FastAPI -> Data Cleaning -> TF-IDF Vectorization -> Random Forest Prediction.
3. **Data Persistence:** SQLite Database (Server) + SharedPreferences (Mobile).
4. **Client Visualization:** React SPA -> HTTP GET (CORS enabled) -> Tailwind CSS UI & Recharts.

---

## 🚀 Installation & Setup

### Prerequisites
* Python 3.9+
* Node.js (LTS)
* Android Studio (Giraffe or newer)

### 1. Backend Setup (FastAPI & AI Model)
Navigate to the backend directory, install the requirements, and train the initial AI model:
```bash
# Install dependencies
pip install fastapi uvicorn scikit-learn pandas joblib

# Run the training script to build the AI models (.pkl files)
python train_model.py

# Start the FastAPI server
uvicorn api_server:app --reload

```

*The API will be live at `http://127.0.0.1:8000*`

### 2. Frontend Setup (React Dashboard)

Open a new terminal, navigate to the frontend directory, and start the Vite development server:

```bash
# Install Node modules
npm install
npm install recharts

# Start the React app
npm run dev

```

*The Dashboard will be live at `http://localhost:5173*`

### 3. Android Setup (Mobile Edge Device)

1. Open the `android_app` folder in **Android Studio**.
2. Sync the Gradle files.
3. Click the green **Run** button to install the app on an Emulator.
4. *Note: Ensure your emulator has SMS permissions granted to intercept messages.*

---

## 🧪 Testing the System

To see the system in action, use the Android Emulator's "Extended Controls" (the `...` menu) to send a fake SMS to the device.

**Test Cases to try:**

* **Fake Reversal:** *"Deposit of 25000 RWF by Agent 102930 successful. TxId: 748392019."*
* **Data Drift:** *"Dear cust0mer, ur M0M0 is bl0cked. Reply with P1N to unbl0ck."*
* **Safe Message (HAM):** *"Uraho, uraza mu nama saa kumi?"*

Watch the Android screen instantly generate a Threat Card, and check the React Dashboard to see the threat automatically populated in the live network tables!

---

## 🎓 Academic Context

* **Institution:** University of Kigali (UoK)
* **Author:** Fabrice
* **Purpose:** Final Year BBICT/CS Research Project Defense

## 📜 License

This project is open-source and available under the [MIT License](https://www.google.com/search?q=LICENSE).

```

```
