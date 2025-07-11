// client/src/App.jsx
import React, { useState } from 'react';
import SeoReport from './SeoReport';

export default function App() {
  const [url, setUrl] = useState('');

  const handleAnalyze = () => {
    // Nothing else needed here—SeoReport will fire on url change
  };

  return (
    <div className="p-4 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">TheSearchPilot</h1>
      <div className="flex gap-2">
        <input
          type="text"
          value={url}
          onChange={e => setUrl(e.target.value)}
          placeholder="https://example.com"
          className="flex-1 border p-2 rounded"
        />
        <button
          onClick={handleAnalyze}
          className="px-4 py-2 bg-blue-600 text-white rounded"
        >
          Analyze
        </button>
      </div>

      {/* Render SeoReport directly when url is non-empty */}
      {url && <SeoReport url={url} />}
    </div>
  );
}
