import { useState } from 'react';

export default function DatasetAdmin() {
  const [isRetraining, setIsRetraining] = useState(false);

  const handleRetrain = () => {
    setIsRetraining(true);
    // Simulate a retraining delay for the prototype demonstration
    setTimeout(() => {
      setIsRetraining(false);
      alert("✅ Model successfully retrained with the latest database entries!");
    }, 3000);
  };

  return (
    <div className="p-8">
      <h2 className="text-3xl font-bold text-mtn-yellow mb-2">Model & Dataset Administration</h2>
      <p className="text-mtn-muted mb-8">Manage the Random Forest classification engine and training corpora.</p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Stat Cards */}
        <div className="bg-mtn-surface border border-gray-800 p-6 rounded-xl">
          <h3 className="text-mtn-muted text-sm font-bold uppercase tracking-wider mb-2">Active Algorithm</h3>
          <p className="text-2xl text-white font-mono">Random Forest</p>
          <p className="text-mtn-safe text-xs mt-2">● Online & Serving</p>
        </div>
        
        <div className="bg-mtn-surface border border-gray-800 p-6 rounded-xl">
          <h3 className="text-mtn-muted text-sm font-bold uppercase tracking-wider mb-2">Training Corpus Size</h3>
          <p className="text-2xl text-white font-mono">5,582 Rows</p>
          <p className="text-mtn-muted text-xs mt-2">English + Kinyarwanda</p>
        </div>

        <div className="bg-mtn-surface border border-gray-800 p-6 rounded-xl">
          <h3 className="text-mtn-muted text-sm font-bold uppercase tracking-wider mb-2">Model Accuracy</h3>
          <p className="text-2xl text-mtn-yellow font-mono">98.24%</p>
          <p className="text-mtn-muted text-xs mt-2">Last evaluated: Today</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Hyperparameters */}
        <div className="bg-mtn-surface border border-gray-800 p-6 rounded-xl">
          <h3 className="text-lg font-bold text-white mb-4">Current Hyperparameters</h3>
          <ul className="space-y-3 text-sm font-mono text-gray-300">
            <li className="flex justify-between border-b border-gray-800 pb-2">
              <span>n_estimators:</span> <span className="text-mtn-yellow">100</span>
            </li>
            <li className="flex justify-between border-b border-gray-800 pb-2">
              <span>random_state:</span> <span className="text-mtn-yellow">42</span>
            </li>
            <li className="flex justify-between border-b border-gray-800 pb-2">
              <span>vectorizer:</span> <span className="text-mtn-yellow">TF-IDF</span>
            </li>
            <li className="flex justify-between border-b border-gray-800 pb-2">
              <span>ngram_range:</span> <span className="text-mtn-yellow">(1, 2) Bigrams</span>
            </li>
          </ul>
        </div>

        {/* Retraining Action */}
        <div className="bg-mtn-surface border border-gray-800 p-6 rounded-xl flex flex-col justify-center items-center text-center">
          <h3 className="text-lg font-bold text-white mb-2">Manual Retraining Trigger</h3>
          <p className="text-sm text-mtn-muted mb-6">
            Compiles newly flagged threats from the SQLite database and rebuilds the Random Forest decision trees.
          </p>
          <button 
            onClick={handleRetrain}
            disabled={isRetraining}
            className={`font-bold py-3 px-8 rounded-lg transition ${isRetraining ? 'bg-gray-600 text-gray-400 cursor-not-allowed' : 'bg-mtn-yellow text-black hover:bg-yellow-400'}`}
          >
            {isRetraining ? '🔄 Compiling Trees...' : '⚙️ Initialize Retraining Protocol'}
          </button>
        </div>
      </div>
    </div>
  );
}