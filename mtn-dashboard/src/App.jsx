import { useState } from 'react';
import Scanner from './components/Scanner';
import AdminConsole from './components/AdminConsole';
import Reports from './components/Reports'; // NEW IMPORT
import History from './components/History'; // NEW
import DatasetAdmin from './components/DatasetAdmin'; // NEW

export default function App() {
  const [currentRole, setCurrentRole] = useState(null);
  const [activeTab, setActiveTab] = useState('scanner');

  const pageAccess = {
    user: ['scanner', 'history'],
    worker: ['scanner', 'worker', 'reports'],
    admin: ['scanner', 'worker', 'reports', 'admin']
  };

  const roleLabels = { user: 'MTN USER', worker: 'MTN WORKER', admin: 'SYSTEM ADMIN' };

  const handleLogin = (role) => {
    setCurrentRole(role);
    setActiveTab('scanner');
  };

  const handleLogout = () => {
    setCurrentRole(null);
    setActiveTab('scanner');
  };

  if (!currentRole) {
    return (
      <div className="min-h-screen bg-mtn-bg flex items-center justify-center p-8">
        <div className="max-w-3xl w-full text-center">
          <div className="w-16 h-16 bg-mtn-yellow text-black font-bold text-3xl flex items-center justify-center rounded-xl mx-auto mb-6">M</div>
          <h1 className="text-4xl font-bold mb-2">MTN Rwanda <span className="text-mtn-yellow">Smart Filter</span></h1>
          <p className="text-mtn-muted mb-12">Prototype diagnostic system — sign in to access your dashboard view.</p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
            <div onClick={() => handleLogin('user')} className="bg-mtn-surface border border-gray-800 hover:border-mtn-yellow p-6 rounded-xl cursor-pointer transition transform hover:-translate-y-1">
              <span className="text-3xl block mb-4">📱</span>
              <h3 className="font-bold text-lg mb-2">MTN User</h3>
              <p className="text-sm text-mtn-muted leading-relaxed">Scan a suspicious SMS and read the diagnosis before acting on it.</p>
            </div>
            
            <div onClick={() => handleLogin('worker')} className="bg-mtn-surface border border-gray-800 hover:border-mtn-yellow p-6 rounded-xl cursor-pointer transition transform hover:-translate-y-1">
              <span className="text-3xl block mb-4">🎧</span>
              <h3 className="font-bold text-lg mb-2">MTN Worker</h3>
              <p className="text-sm text-mtn-muted leading-relaxed">Review flagged messages, spot trends, and block reported numbers.</p>
            </div>
            
            <div onClick={() => handleLogin('admin')} className="bg-mtn-surface border border-gray-800 hover:border-mtn-yellow p-6 rounded-xl cursor-pointer transition transform hover:-translate-y-1">
              <span className="text-3xl block mb-4">🛠️</span>
              <h3 className="font-bold text-lg mb-2">System Admin</h3>
              <p className="text-sm text-mtn-muted leading-relaxed">Monitor model health and update the threat-term training data.</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const allowedTabs = pageAccess[currentRole];

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-mtn-bg text-white font-sans">
      <aside className="w-full md:w-64 bg-mtn-surface border-r border-gray-800 p-6 flex flex-col">
        <div className="flex items-center gap-3 mb-10">
          <div className="w-8 h-8 bg-mtn-yellow text-black font-bold text-lg flex items-center justify-center rounded-lg">M</div>
          <div>
            <h1 className="font-bold text-sm">Smart Filter</h1>
            <p className="text-[10px] text-mtn-muted tracking-widest">MTN RWANDA</p>
          </div>
        </div>
        
        <nav className="flex flex-col gap-2 flex-1">
          {allowedTabs.includes('scanner') && (
            <button onClick={() => setActiveTab('scanner')} className={`text-left px-4 py-3 rounded-lg flex items-center gap-3 transition ${activeTab === 'scanner' ? 'bg-gray-800 text-mtn-yellow border-l-4 border-mtn-yellow' : 'text-mtn-muted hover:bg-gray-900 hover:text-white'}`}>
              <span>🔍</span> Scan messages
            </button>
          )}
          {allowedTabs.includes('history') && (
            <button onClick={() => setActiveTab('history')} className={`text-left px-4 py-3 rounded-lg flex items-center gap-3 transition ${activeTab === 'history' ? 'bg-gray-800 text-mtn-yellow border-l-4 border-mtn-yellow' : 'text-mtn-muted hover:bg-gray-900 hover:text-white'}`}>
              <span>🕒</span> My scan history
            </button>
          )}
          {allowedTabs.includes('worker') && (
            <button onClick={() => setActiveTab('worker')} className={`text-left px-4 py-3 rounded-lg flex items-center gap-3 transition ${activeTab === 'worker' ? 'bg-gray-800 text-mtn-yellow border-l-4 border-mtn-yellow' : 'text-mtn-muted hover:bg-gray-900 hover:text-white'}`}>
              <span>🚩</span> Flagged messages
            </button>
          )}
          {allowedTabs.includes('reports') && (
            <button onClick={() => setActiveTab('reports')} className={`text-left px-4 py-3 rounded-lg flex items-center gap-3 transition ${activeTab === 'reports' ? 'bg-gray-800 text-mtn-yellow border-l-4 border-mtn-yellow' : 'text-mtn-muted hover:bg-gray-900 hover:text-white'}`}>
              <span>📊</span> Network trends
            </button>
          )}
          {allowedTabs.includes('admin') && (
            <button onClick={() => setActiveTab('admin')} className={`text-left px-4 py-3 rounded-lg flex items-center gap-3 transition ${activeTab === 'admin' ? 'bg-gray-800 text-mtn-yellow border-l-4 border-mtn-yellow' : 'text-mtn-muted hover:bg-gray-900 hover:text-white'}`}>
              <span>🛠️</span> Model & Dataset
            </button>
          )}
        </nav>

        <div className="mt-8 pt-6 border-t border-gray-800">
          <div className="inline-flex items-center gap-2 px-3 py-1 mb-4 rounded-full border border-yellow-700 text-mtn-yellow text-xs font-mono">
            ● {roleLabels[currentRole]}
          </div>
          <button onClick={handleLogout} className="block text-mtn-muted text-sm hover:text-mtn-danger transition">
            ↩ Sign out
          </button>
        </div>
      </aside>

      <main className="flex-1 overflow-y-auto">
        {activeTab === 'scanner' && <Scanner />}
        {activeTab === 'worker' && <AdminConsole />}
        {activeTab === 'reports' && <Reports />}
        {activeTab === 'history' && <History />}
        {activeTab === 'admin' && <DatasetAdmin />}
      </main>
    </div>
  );
}