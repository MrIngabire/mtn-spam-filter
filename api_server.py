from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import joblib
import re
import os
import sqlite3
from datetime import datetime

print("Starting API Server and loading AI Models...")

app = FastAPI(title="MTN SMS Spam Filter API")

# --- Enable CORS for React Frontend ---
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- Database Setup ---
DB_FILE = os.path.join('data', 'spam_reports.db')
os.makedirs('data', exist_ok=True)

def init_db():
    conn = sqlite3.connect(DB_FILE)
    cursor = conn.cursor()
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS reports (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            timestamp TEXT,
            sender TEXT,
            message TEXT,
            confidence REAL
        )
    ''')
    conn.commit()
    conn.close()

init_db() 

# --- Load the trained AI models ---
model_path = os.path.join('data', 'spam_model.pkl')
vec_path = os.path.join('data', 'vectorizer.pkl')

try:
    classifier = joblib.load(model_path)
    vectorizer = joblib.load(vec_path)
except Exception as e:
    print(f"Warning: Model files not found. Ensure train_model.py has been run. Error: {e}")

# --- Data Models ---
class SMSRequest(BaseModel):
    text: str

class ReportRequest(BaseModel):
    sender: str
    message: str
    confidence: float

# --- Helper Functions ---
def clean_text(text):
    text = str(text).lower()
    text = re.sub(r'[^a-zA-Z0-9\s]', '', text)
    return text

# --- Endpoints ---
@app.post("/predict")
async def predict_spam(request: SMSRequest):
    cleaned_msg = clean_text(request.text)
    vectorized_msg = vectorizer.transform([cleaned_msg])
    
    prediction = classifier.predict(vectorized_msg)[0]
    probabilities = classifier.predict_proba(vectorized_msg)[0]
    confidence = max(probabilities) * 100
    
    return {
        "original_message": request.text,
        "classification": prediction.upper(),
        "confidence_score": round(confidence, 2)
    }

@app.post("/report")
async def report_scammer(request: ReportRequest):
    timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    conn = sqlite3.connect(DB_FILE)
    cursor = conn.cursor()
    cursor.execute('''
        INSERT INTO reports (timestamp, sender, message, confidence)
        VALUES (?, ?, ?, ?)
    ''', (timestamp, request.sender, request.message, request.confidence))
    conn.commit()
    conn.close()
    return {"status": "success", "message": "Scammer reported to MTN SQLite Database"}

@app.get("/reports")
async def get_reports():
    conn = sqlite3.connect(DB_FILE)
    conn.row_factory = sqlite3.Row 
    cursor = conn.cursor()
    cursor.execute('SELECT * FROM reports ORDER BY id DESC')
    rows = cursor.fetchall()
    conn.close()
    
    return {"reports": [dict(row) for row in rows]}

@app.get("/")
async def root():
    return {"message": "MTN SMS Spam Filter API is running! 🚀"}