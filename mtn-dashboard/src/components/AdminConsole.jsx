import { useState, useEffect } from 'react';

export default function AdminConsole() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchReports = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://127.0.0.1:8000/reports');
      const data = await response.json();
      setReports(data.reports);
    } catch (error) {
      console.error("API Error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
    // Set an interval to auto-refresh every 5 seconds
    const interval = setInterval(fetchReports, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-3xl font-bold text-mtn-yellow mb-2">Flagged Messages</h2>
          <p className="text-mtn-muted">Live fraud-analyst queue from Android edge devices.</p>
        </div>
        <button onClick={fetchReports} className="bg-gray-800 text-white px-4 py-2 rounded-lg border border-gray-600 hover:border-mtn-yellow">
          🔄 Refresh
        </button>
      </div>

      <div className="bg-mtn-surface border border-gray-800 rounded-xl overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-black text-mtn-muted uppercase tracking-wider">
            <tr>
              <th className="p-4">Time</th>
              <th className="p-4">Sender</th>
              <th className="p-4">Message</th>
              <th className="p-4">Confidence</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-800">
            {loading && reports.length === 0 ? (
              <tr><td colSpan="4" className="p-8 text-center text-mtn-muted">Loading reports...</td></tr>
            ) : reports.length === 0 ? (
              <tr><td colSpan="4" className="p-8 text-center text-mtn-muted italic">No scammers reported yet.</td></tr>
            ) : (
              reports.map((r, i) => (
                <tr key={i} className="hover:bg-gray-900 transition">
                  <td className="p-4 whitespace-nowrap text-gray-400">{r.timestamp}</td>
                  <td className="p-4 font-mono text-mtn-yellow">{r.sender}</td>
                  <td className="p-4 text-gray-300 max-w-md truncate">{r.message}</td>
                  <td className="p-4">
                    <span className="bg-[#4a1f14] text-mtn-danger px-3 py-1 rounded-full font-bold text-xs">
                      {r.confidence}%
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}