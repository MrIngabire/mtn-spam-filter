import { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

export default function Reports() {
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const response = await fetch('http://127.0.0.1:8000/reports');
        const data = await response.json();
        
        // Format data for the chart: Grab the latest 10 reports and map them for Recharts
        const formatted = data.reports.slice(0, 10).reverse().map(report => ({
          name: report.sender,
          Confidence: report.confidence
        }));
        setChartData(formatted);
      } catch (error) {
        console.error("Failed to load analytics");
      }
    };
    
    fetchAnalytics();
    const interval = setInterval(fetchAnalytics, 5000); // Live reload every 5s
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="p-8">
      <h2 className="text-3xl font-bold text-mtn-yellow mb-2">Network Trends Analytics</h2>
      <p className="text-mtn-muted mb-8">Visualization of the last 10 intercepted threats.</p>
      
      <div className="bg-mtn-surface border border-gray-800 p-6 rounded-xl h-96">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#262013" />
            <XAxis dataKey="name" stroke="#9a927a" />
            <YAxis stroke="#9a927a" domain={[0, 100]} />
            <Tooltip 
              contentStyle={{ backgroundColor: '#17140c', borderColor: '#ffcc00' }}
              itemStyle={{ color: '#ffcc00' }}
            />
            <Bar dataKey="Confidence" fill="#ff5a3c" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}