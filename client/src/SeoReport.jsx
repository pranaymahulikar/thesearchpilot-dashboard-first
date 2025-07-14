// client/src/SeoReport.jsx
import { useEffect, useState } from 'react';

export default function SeoReport({ url }) {
  const [strategy, setStrategy] = useState('mobile');
  const [report, setReport]     = useState(null);
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState('');

  useEffect(() => {
    if (!url) return;
    (async () => {
      setLoading(true);
      setError('');
      try {
        const endpoint = `/api/seo-check?url=${encodeURIComponent(url)}&strategy=${strategy}`;
        const res      = await fetch(endpoint);
        if (!res.ok) throw new Error(`Status ${res.status}`);
        const data     = await res.json();

        // Build Field Report
        const fm = data.loadingExperience?.metrics;
        const fieldReport = fm
          ? [
              {
                key: 'CLS',
                label: 'Cumulative Layout Shift',
                value: fm.CUMULATIVE_LAYOUT_SHIFT_SCORE.percentile,
                category: fm.CUMULATIVE_LAYOUT_SHIFT_SCORE.category,
              },
              {
                key: 'TTFB',
                label: 'Time to First Byte',
                value: fm.EXPERIMENTAL_TIME_TO_FIRST_BYTE.percentile,
                category: fm.EXPERIMENTAL_TIME_TO_FIRST_BYTE.category,
              },
              {
                key: 'FCP',
                label: 'First Contentful Paint',
                value: fm.FIRST_CONTENTFUL_PAINT_MS.percentile,
                category: fm.FIRST_CONTENTFUL_PAINT_MS.category,
              },
            ]
          : null;

        // Build Lab Report
        const lc = data.lighthouseResult?.categories;
        const au = data.lighthouseResult?.audits;
        const labReport = lc
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
              FCP:  au?.['first-contentful-paint']?.displayValue ?? null,
              LCP:  au?.['largest-contentful-paint']?.displayValue ?? null,
            }
          : null;

        setReport({ fieldReport, labReport });
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

  // Build real-world suggestions
  const suggestions = [];

  // Performance hints
  if (report.labReport?.performance != null) {
    const p = report.labReport.performance;
    if (p < 50) {
      suggestions.push(
        'Reduce JavaScript bundle size (code-split or tree-shake), and enable gzip/Brotli compression.'
      );
    } else if (p < 90) {
      suggestions.push(
        'Defer non-critical JavaScript and CSS, and use a CDN to serve static assets faster.'
      );
    }
  }

  // SEO hints
  if (report.labReport?.seo != null && report.labReport.seo < 100) {
    suggestions.push(
      'Ensure each page has a unique title (< 60 chars) and meta description (≈ 150 chars).'
    );
  }

  // Accessibility hints
  if (report.labReport?.accessibility != null && report.labReport.accessibility < 100) {
    suggestions.push(
      'Add appropriate ARIA labels, ensure form controls have associated labels, and provide alt text for all images.'
    );
  }

  // Best Practices hints
  if (report.labReport?.bestPractices != null && report.labReport.bestPractices < 100) {
    suggestions.push(
      'Serve images in modern formats (WebP/AVIF), and avoid deprecated APIs (check console warnings).'
    );
  }

  // Field hints
  if (report.fieldReport) {
    const ttfb = report.fieldReport.find(m => m.key === 'TTFB')?.value;
    if (ttfb != null && ttfb > 2000) {
      suggestions.push(
        'Improve server response time by caching at the CDN or upgrading your hosting plan.'
      );
    }
    const cls = report.fieldReport.find(m => m.key === 'CLS')?.value;
    if (cls != null && cls > 0) {
      suggestions.push(
        'Prevent layout shifts by reserving space for images and embeds via explicit width & height.'
      );
    }
  }

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
      {report.fieldReport ? (
        <section>
          <h4 className="text-lg font-semibold mb-2">
            Field Metrics (Real-User)
          </h4>
          <div className="grid grid-cols-3 gap-4">
            {report.fieldReport.map(({ key, label, value, category }) => (
              <div key={key} className="p-4 bg-gray-50 rounded-lg text-center">
                <div className="text-xl font-bold">{value ?? '—'}%</div>
                <div className="text-sm text-gray-600">{label}</div>
                <div className="mt-1 text-xs italic">{category || '—'}</div>
              </div>
            ))}
          </div>
        </section>
      ) : (
        <p className="text-gray-500">Field metrics not available for this URL.</p>
      )}

      {/* Lab Metrics */}
      {report.labReport ? (
        <section>
          <h4 className="text-lg font-semibold mb-2">
            Lab Metrics (Lighthouse)
          </h4>
          <div className="grid grid-cols-2 gap-4">
            {['performance','seo','accessibility','bestPractices'].map((key) => {
              const score = report.labReport[key];
              if (score == null) return null;
              return (
                <ScoreCard
                  key={key}
                  label={key.replace(/([A-Z])/g,' $1').toUpperCase()}
                  score={score}
                />
              );
            })}
          </div>
          <div className="mt-4 space-y-2">
            <Metric label="FCP (lab)" value={report.labReport.FCP} />
            <Metric label="LCP (lab)" value={report.labReport.LCP} />
          </div>
        </section>
      ) : (
        <p className="text-gray-500">Lab metrics not available for this URL.</p>
      )}

      {/* Actionable Suggestions */}
      {suggestions.length > 0 && (
        <section>
          <h4 className="text-lg font-semibold mb-2">What to Improve Next</h4>
          <ul className="list-disc list-inside text-sm space-y-1">
            {suggestions.map((hint, i) => (
              <li key={i}>{hint}</li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}

// Helper components
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
