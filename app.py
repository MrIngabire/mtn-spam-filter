import streamlit as st
import requests
import pandas as pd
from datetime import datetime

# --- Page Configuration & MTN Branding ---
st.set_page_config(page_title="MTN Smart Filter", page_icon="🛡️", layout="wide")

st.markdown("""
<style>
    .stApp { background-color: #17140c; color: #f4efdf; }
    h1, h2, h3 { color: #ffcc00; font-family: sans-serif; }
    .stTextArea textarea { background-color: #262013; color: white; border: 1px solid #ffcc00; }
    .stButton>button { background-color: #ffcc00; color: black; font-weight: bold; border-radius: 8px; }
    .spam-box { background-color: #4a1f14; border-left: 5px solid #ff5a3c; padding: 20px; border-radius: 5px; }
    .ham-box { background-color: #163d2b; border-left: 5px solid #2fb673; padding: 20px; border-radius: 5px; }
</style>
""", unsafe_allow_html=True)

st.title("🛡️ MTN Rwanda Smart Filter")
st.write("Centralized diagnostic dashboard connected to the AI Engine.")
st.divider()

# --- Create Interface Tabs ---
tab1, tab2 = st.tabs(["🔍 Manual Scanner (User View)", "🚨 MTN Admin Console (Worker View)"])

# ====== TAB 1: MANUAL SCANNER ======
with tab1:
    st.write("### 🔍 Test the Algorithm")
    sms_input = st.text_area("Paste an SMS to test the AI:", height=150)

    if st.button("Analyze Message"):
        if sms_input.strip() != "":
            try:
                response = requests.post("http://127.0.0.1:8000/predict", json={"text": sms_input})
                if response.status_code == 200:
                    result = response.json()
                    if result["classification"] == "SPAM":
                        st.markdown(f"<div class='spam-box'><h2>🚨 SPAM DETECTED</h2><p>Confidence: <b>{result['confidence_score']}%</b></p></div>", unsafe_allow_html=True)
                    else:
                        st.markdown(f"<div class='ham-box'><h2>✅ LIKELY SAFE (HAM)</h2><p>Confidence: <b>{result['confidence_score']}%</b></p></div>", unsafe_allow_html=True)
            except Exception as e:
                st.error("API Connection Failed.")
        else:
            st.warning("Please paste a message.")

# ====== TAB 2: MTN ADMIN CONSOLE ======
with tab2:
    st.write("### 🚨 Live Threat Reports (From Android Devices)")
    st.write("This table automatically populates when an Android app intercepts a spam message.")
    
    if st.button("🔄 Refresh Live Reports"):
        try:
            response = requests.get("http://127.0.0.1:8000/reports")
            if response.status_code == 200:
                reports = response.json()["reports"]
                if len(reports) > 0:
                    # Convert the JSON data into a clean Pandas Table
                    df = pd.DataFrame(reports)
                    st.dataframe(df, use_container_width=True)
                else:
                    st.info("No scammers have been reported yet. Waiting for incoming data from Android...")
        except:
            st.error("Could not fetch reports from the server.")