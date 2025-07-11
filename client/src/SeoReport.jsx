// client/src/SeoReport.jsx
import { useEffect, useState } from 'react';

export default function SeoReport({ url }) {
  const [strategy, setStrategy] = useState('mobile');
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!url) return;
    (async () => {
      setLoading(true);
      setError('');
      try {
        const endpoint = `/api/seo-check?url=${encodeURIComponent(url)}&strategy=${strategy}`;
        const res = await fetch(endpoint);
        if (!res.ok) throw new Error(`Status ${res.status}`);
        const data = await res.json();

        // Field metrics
        const fm = data.loadingExperience?.metrics;
        const field = fm
          ? {
              CLS:  fm.CUMULATIVE_LAYOUT_SHIFT_SCORE?.percentile ?? null,
              TTFB: fm.EXPERIMENTAL_TIME_TO_FIRST_BYTE?.percentile ?? null,
              FCP:  fm.FIRST_CONTENTFUL_PAINT_MS?.percentile ?? null,
            }
          : null;

        // Lab metrics
        const lc = data.lighthouseResult?.categories;
        const au = data.lighthouseResult?.audits;
        const lab = lc
          ? {
              performance:   lc.performance?.score != null
                               ? Math.round(lc.performance.score * 100)
                               : null,
              seo:           lc.seo?.score != null
                               ? Math.round(lc.seo.score * 100)
                               : null,
              accessibility: lc.accessibility?.score != null
                               ? Math.round(lc.accessibility.score * 100)
                               : null,
              bestPractices: lc['best-practices']?.score != null
                               ? Math.round(lc['best-practices'].score * 100)
                               : null,
              FCP: au?.['first-contentful-paint']?.displayValue ?? null,
              LCP: au?.['largest-contentful-paint']?.displayValue ?? null,
            }
          : null;

        setReport({ field, lab });
      } catch (e) {
        console.error(e);
        setError('Failed to fetch SEO data.');
      } finally {
        setLoading(false);
      }
    })();
  }, [url, strategy]);

  if (loading) return <p className="mt-4 text-gray-500">Analyzing {strategy}…</p>;
  if (error)   return <p className="mt-4 text-red-600">{error}</p>;
  if (!report) return null;

  return (
    <div className="mt-8 space-y-6 bg-white p-6 rounded-lg shadow">
      {/* Strategy Toggle */}
      <div className="flex space-x-4">
        {['mobile','desktop'].map((strat) => (
          <button
            key={strat}
            onClick={() => setStrategy(strat)}
            className={`px-4 py-2 rounded ${
              strategy === strat
                ? 'bg-indigo-600 text-white'
                : 'bg-gray-200 text-gray-700'
            }`}
          >
            {strat[0].toUpperCase() + strat.slice(1)}
          </button>
        ))}
      </div>

      {/* Field Metrics */}
      {report.field ? (
        <section>
          <h4 className="text-lg font-semibold mb-2">Field Metrics</h4>
          <div className="grid grid-cols-3 gap-4">
            {Object.entries(report.field).map(([label, value]) =>
              value !== null ? (
                <MetricBar key={label} label={label} value={value} max={100} unit="%" />
              ) : (
                <MetricFallback key={label} label={label} />
              )
            )}
          </div>
        </section>
      ) : (
        <p className="text-gray-500">Field metrics not available.</p>
      )}

      {/* Lab Metrics */}
      {report.lab ? (
        <section>
          <h4 className="text-lg font-semibold mb-2">Lab Metrics</h4>
          <div className="grid grid-cols-2 gap-4">
            {['performance','seo','accessibility','bestPractices'].map((key) => (
              report.lab[key] != null
                ? <ScoreCard
                    key={key}
                    label={key.replace(/([A-Z])/g,' $1').toUpperCase()}
                    score={report.lab[key]}
                  />
                : <MetricFallback key={key} label={key} />
            ))}
          </div>
          <div className="mt-4 space-y-2">
            {report.lab.FCP ? (
              <Metric label="FCP (lab)" value={report.lab.FCP} />
            ) : (
              <MetricFallback label="FCP (lab)" />
            )}
            {report.lab.LCP ? (
              <Metric label="LCP (lab)" value={report.lab.LCP} />
            ) : (
              <MetricFallback label="LCP (lab)" />
            )}
          </div>
        </section>
      ) : (
        <p className="text-gray-500">Lab metrics not available.</p>
      )}
    </div>
  );
}

// Helper components
function MetricBar({ label, value, max, unit='' }) {
  const pct = Math.min(100, Math.round((value / max) * 100));
  const color = pct >= 90 ? 'bg-green-500'
              : pct >= 50 ? 'bg-yellow-500'
              : 'bg-red-500';
  return (
    <div>
      <div className="flex justify-between text-sm mb-1">
        <span>{label}</span>
        <span>{value}{unit}</span>
      </div>
      <div className="w-full bg-gray-200 h-2 rounded">
        <div className={`${color} h-2 rounded`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

function ScoreCard({ label, score }) {
  const color = score >= 90 ? 'text-green-600'
              : score >= 50 ? 'text-yellow-600'
              : 'text-red-600';
  return (
    <div className="p-4 border rounded-lg text-center">
      <div className={`text-3xl font-bold ${color}`}>{score}</div>
      <div className="text-sm text-gray-500">{label}</div>
    </div>
  );
}

function Metric({ label, value }) {
  return (
    <div className="flex justify-between">
      <span className="font-medium">{label}:</span>
      <span className="text-gray-700">{value}</span>
    </div>
  );
}

function MetricFallback({ label }) {
  return (
    <div className="flex justify-between text-sm text-gray-400 italic">
      <span>{label}</span>
      <span>—</span>
    </div>
  );
}
