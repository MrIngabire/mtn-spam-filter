import { useState } from 'react';

export default function Scanner() {
  const [smsText, setSmsText] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const analyzeMessage = async () => {
    if (!smsText.trim()) return;
    setLoading(true);
    
    try {
      const response = await fetch('http://127.0.0.1:8000/predict', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: smsText })
      });
      
      const data = await response.json();
      setResult(data);
    } catch (error) {
      console.error("API Error:", error);
      alert("Failed to connect to the AI backend.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8">
      <h2 className="text-3xl font-bold text-mtn-yellow mb-2">Scan a Message</h2>
      <p className="text-mtn-muted mb-8">Run an SMS through the TF-IDF + Naive Bayes pipeline.</p>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Input Section */}
        <div className="bg-mtn-surface border border-gray-800 p-6 rounded-xl">
          <h3 className="text-sm tracking-widest text-mtn-muted font-bold mb-4 uppercase">Message Input</h3>
          <textarea 
            value={smsText}
            onChange={(e) => setSmsText(e.target.value)}
            className="w-full h-40 bg-black border border-gray-800 rounded-lg p-4 text-white focus:outline-none focus:border-mtn-yellow"
            placeholder="Paste or type a suspicious SMS..."
          />
          <button 
            onClick={analyzeMessage}
            disabled={loading}
            className="mt-4 bg-mtn-yellow text-black font-bold py-3 px-6 rounded-lg hover:bg-yellow-400 transition w-full lg:w-auto"
          >
            {loading ? 'Analyzing...' : 'Analyze Message'}
          </button>
        </div>

        {/* Results Section */}
        <div className="bg-mtn-surface border border-gray-800 p-6 rounded-xl flex flex-col justify-center items-center text-center">
          {!result ? (
            <p className="text-mtn-muted">Awaiting input...</p>
          ) : (
            <div className={`w-full p-6 rounded-lg border-l-4 ${result.classification === 'SPAM' ? 'bg-[#4a1f14] border-mtn-danger' : 'bg-[#163d2b] border-mtn-safe'}`}>
              <h2 className={`text-2xl font-bold mb-2 ${result.classification === 'SPAM' ? 'text-mtn-danger' : 'text-mtn-safe'}`}>
                {result.classification === 'SPAM' ? '🚨 SPAM DETECTED' : '✅ LIKELY SAFE'}
              </h2>
              <p className="text-xl">Confidence Score: <span className="font-mono font-bold">{result.confidence_score}%</span></p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}