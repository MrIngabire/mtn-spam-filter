import { useState, useEffect } from 'react';

export default function History() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const response = await fetch('http://127.0.0.1:8000/reports');
        const data = await response.json();
        setHistory(data.reports);
      } catch (error) {
        console.error("Failed to load history");
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, []);

  return (
    <div className="p-8">
      <h2 className="text-3xl font-bold text-mtn-yellow mb-2">My Scan History</h2>
      <p className="text-mtn-muted mb-8">A personal log of messages you have scanned for threats.</p>

      <div className="space-y-4 max-w-4xl">
        {loading ? (
          <p className="text-mtn-muted">Loading your scan history...</p>
        ) : history.length === 0 ? (
          <p className="text-mtn-muted italic">You haven't scanned any messages yet.</p>
        ) : (
          history.map((item, index) => (
            <div key={index} className="bg-mtn-surface border border-gray-800 p-5 rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-4 hover:border-gray-600 transition">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-xs font-mono text-mtn-muted">{item.timestamp}</span>
                  <span className="text-xs font-bold px-2 py-1 bg-gray-800 rounded text-gray-300">From: {item.sender}</span>
                </div>
                <p className="text-gray-200 italic">"{item.message}"</p>
              </div>
              
              <div className="flex-shrink-0 text-right">
                <div className={`px-4 py-2 rounded-lg font-bold text-sm ${item.confidence >= 50 ? 'bg-[#4a1f14] text-mtn-danger' : 'bg-[#163d2b] text-mtn-safe'}`}>
                  {item.confidence >= 50 ? '🚨 SPAM DETECTED' : '✅ SAFE'}
                </div>
                <p className="text-xs text-mtn-muted mt-2">Confidence: {item.confidence}%</p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}