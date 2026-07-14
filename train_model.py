import pandas as pd
import urllib.request
import os
import joblib
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
from sklearn.metrics import classification_report, accuracy_score

print("1. Fetching global English SMS dataset (5,500+ rows)...")
url = "https://raw.githubusercontent.com/justmarkham/pycon-2016-tutorial/master/data/sms.tsv"
global_df = pd.read_csv(url, sep='\t', header=None, names=['label', 'message'])
global_df['label'] = global_df['label'].map({'ham': 'HAM', 'spam': 'SPAM'})

print("2. Injecting massive localized Kinyarwanda & MoMo Fraud dataset...")
local_data = [
    # --- FAKE REVERSAL TACTIC ---
    ["SPAM", "Cash In from 078XXXXXXXX for 50,000 RWF. New balance: 51,200 RWF. Transaction ID: 4928374920. Message: wishyuye."],
    ["SPAM", "Confirmed. You have received 150,000 RWF from Emmanuel N. TxId: 839201839. Your MoMo balance is 154,300 RWF."],
    ["SPAM", "Deposit of 25000 RWF by Agent 102930 successful. TxId: 748392019. Your new MoMo account balance is 26500 RWF."],
    
    # --- ADMINISTRATIVE IMPERSONATION (KYC / RURA) ---
    ["SPAM", "Dear Customer, your Mobile Money account will be permanently blocked in 24 hours due to incomplete KYC registration. Call 078XXXXXXXX immediately to update your details."],
    ["SPAM", "MTN Warning: Konti yawe ya MoMo igiye gufungwa kubera kutuzuza imyirondoro. Kohereza PIN yawe kuri iyi nimero kugirango ugarure konti."],
    ["SPAM", "RURA ALERT: Your SIM card has been flagged for deactivation. Dial *182*... immediately to verify your identity and prevent network suspension."],
    
    # --- PROMISSORY PHISHING ---
    ["SPAM", "Congratulations! You have been selected as the winner of 1,000,000 RWF in the MTN Tombora promo. Send a 10,000 RWF processing tax to 079XXXXXXXX to claim your cash."],
    ["SPAM", "Amakuru Mashya! Watsindiye 500,000 RWF muri MTN promotion. Kugirango ubone amafaranga, ohereza 5,000 RWF ya transport kuri agent 078XXXXXXXX."],
    ["SPAM", "You have been shortlisted for the NGO field officer position. Salary: 300,000 RWF. Send 15,000 RWF via MoMo for your uniform and ID badge processing before Friday."],
    
    # --- DATA DRIFT & OBFUSCATION (Teaching the Dictionary) ---
    ["SPAM", "C0nfirmed. Y0u have receivd 20000 RWF. TxId: 938472."],
    ["SPAM", "You w0n in the M.T.N T0mb0la! Send tax fee t0 claim."],
    ["SPAM", "Dear cust0mer, ur M0M0 is bl0cked. Reply with P1N to unbl0ck."],
    
    # --- NORMAL/SAFE MESSAGES (HAM) to maintain balance ---
    ["HAM", "Uraho, uraza mu nama saa kumi?"],
    ["HAM", "Ese wamaze kohereza ya report? Ndagutegereje muri office."],
    ["HAM", "Sawa, turabonana ejo mu gitondo."],
    ["HAM", "Ndi mu nzira ndaza, mfite iminota nka cumi."],
    ["HAM", "Yego, amafaranga yagezeho. Urakoze."],
    ["HAM", "Are we still meeting for lunch at 1 PM?"]
]

local_df = pd.DataFrame(local_data, columns=['label', 'message'])

print("3. Merging datasets and creating the CSV...")
final_df = pd.concat([global_df, local_df], ignore_index=True)
os.makedirs('data', exist_ok=True)
final_df.to_csv('data/mtn_training_dataset.csv', index=False)

print("4. Training the Random Forest AI with TF-IDF Bigrams...")
X = final_df['message']
y = final_df['label']
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

vectorizer = TfidfVectorizer(ngram_range=(1, 2), max_features=7000, stop_words='english')
X_train_vec = vectorizer.fit_transform(X_train)
X_test_vec = vectorizer.transform(X_test)

classifier = RandomForestClassifier(n_estimators=100, random_state=42, n_jobs=-1)
classifier.fit(X_train_vec, y_train)

print("5. Evaluating the model...")
y_pred = classifier.predict(X_test_vec)
print(f"\nModel Accuracy: {accuracy_score(y_test, y_pred) * 100:.2f}%\n")

print("6. Exporting .pkl files...")
joblib.dump(classifier, 'data/spam_model.pkl')
joblib.dump(vectorizer, 'data/vectorizer.pkl')

print("🚀 Retraining Complete!")