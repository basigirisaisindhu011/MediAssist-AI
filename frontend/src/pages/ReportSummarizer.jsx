import { useState } from 'react';
import aiService from '../services/aiService';
import {
  FileText,
  Sparkles,
  ShieldAlert,
  Loader2,
  AlertCircle,
  Upload,
  CheckCircle2,
  Table
} from 'lucide-react';

export const ReportSummarizer = () => {
  const [documentText, setDocumentText] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);

  const sampleReportText = `PATIENT EVALUATION REPORT
Patient: John Doe | Age: 52 | Date: 2026-08-10
Fasting Blood Sugar: 145 mg/dL (Elevated)
HbA1c: 7.4% (Consistent with Type 2 Diabetes mellitus)
Total Cholesterol: 235 mg/dL
Systolic Blood Pressure: 138 mmHg
Diastolic Blood Pressure: 88 mmHg
Kidney Function (eGFR): 88 mL/min/1.73m2 (Normal)
Recommendations: Initiate low-glycemic dietary plan, increase aerobic physical activity to 150 mins/week, schedule follow-up consultation in 4 weeks.`;

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.name.match(/\.(txt|md|csv)$/i)) {
      setError('Please upload a text file (.txt, .md, .csv) for text extraction.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      setDocumentText(event.target.result);
      setError(null);
    };
    reader.readAsText(file);
  };

  const handleSummarize = async (e) => {
    e.preventDefault();
    if (!documentText.trim()) {
      setError('Please enter or upload document text to summarize.');
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const data = await aiService.summarizeReport({
        document_text: documentText,
      });
      setResult(data);
    } catch (err) {
      setError(
        err.response?.data?.detail || err.response?.data?.message || 'Failed to summarize report via gateway.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header Banner */}
      <div className="glass-panel p-6 sm:p-8 bg-gradient-to-r from-indigo-600/90 to-sky-600/90 text-white rounded-2xl shadow-xl">
        <div className="flex items-center space-x-3 mb-2">
          <div className="p-2.5 rounded-xl bg-white/20 backdrop-blur-md">
            <FileText className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            AI Medical Report Summarizer
          </h1>
        </div>
        <p className="text-indigo-100 text-sm sm:text-base max-w-xl">
          Paste diagnostic notes, lab findings, or upload report files to generate easy-to-understand executive summaries and extracted clinical metrics.
        </p>
      </div>

      {/* Main Input Form */}
      <div className="glass-card p-6 sm:p-8 space-y-6">
        {error && (
          <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-700 dark:text-rose-400 text-sm flex items-start space-x-2">
            <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSummarize} className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <label className="block text-sm font-semibold text-slate-800 dark:text-slate-200">
              Clinical Report Text
            </label>
            <div className="flex items-center space-x-2">
              <button
                type="button"
                onClick={() => setDocumentText(sampleReportText)}
                className="text-xs font-semibold text-sky-600 dark:text-sky-400 hover:underline"
              >
                Load Sample Report
              </button>
              <span className="text-slate-300 dark:text-slate-700">|</span>
              <label className="cursor-pointer inline-flex items-center space-x-1 text-xs font-semibold text-teal-600 dark:text-teal-400 hover:underline">
                <Upload className="w-3.5 h-3.5" />
                <span>Upload .txt File</span>
                <input
                  type="file"
                  accept=".txt,.md,.csv"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>
            </div>
          </div>

          <textarea
            rows={8}
            value={documentText}
            onChange={(e) => setDocumentText(e.target.value)}
            placeholder="Paste lab results, doctor consultation notes, or hospital discharge summary here..."
            className="w-full p-4 rounded-xl border border-slate-300 dark:border-slate-700 bg-white/70 dark:bg-slate-800/70 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500 font-mono text-sm leading-relaxed"
          />

          <button
            type="submit"
            disabled={loading || !documentText.trim()}
            className="w-full py-3.5 px-4 rounded-xl text-white font-bold bg-gradient-to-r from-indigo-600 to-sky-600 hover:from-indigo-700 hover:to-sky-700 disabled:opacity-50 disabled:cursor-not-allowed shadow-md shadow-indigo-500/20 flex items-center justify-center space-x-2 transition-all"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Summarizing Clinical Document...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5" />
                <span>Summarize Medical Report</span>
              </>
            )}
          </button>
        </form>
      </div>

      {/* Results Section */}
      {result && (
        <div className="glass-card p-6 sm:p-8 space-y-6 border-l-4 border-l-indigo-500 animate-fade-in">
          <div className="border-b border-slate-200 dark:border-slate-800 pb-4">
            <h2 className="text-xl font-extrabold text-slate-900 dark:text-slate-100 flex items-center space-x-2">
              <FileText className="w-5 h-5 text-indigo-600" />
              <span>AI Executive Summary</span>
            </h2>
            <p className="text-sm text-slate-700 dark:text-slate-300 mt-3 leading-relaxed p-4 rounded-xl bg-slate-100 dark:bg-slate-800/80">
              {result.summary}
            </p>
          </div>

          {/* Extracted Metrics Table */}
          {result.key_metrics && Object.keys(result.key_metrics).length > 0 && (
            <div className="space-y-3">
              <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200 flex items-center space-x-2">
                <Table className="w-4 h-4 text-indigo-600" />
                <span>Extracted Lab Metrics</span>
              </h3>
              <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800">
                <table className="w-full text-left text-sm">
                  <thead className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold">
                    <tr>
                      <th className="px-4 py-2.5">Clinical Metric</th>
                      <th className="px-4 py-2.5">Extracted Value</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                    {Object.entries(result.key_metrics).map(([key, val]) => (
                      <tr key={key}>
                        <td className="px-4 py-2.5 font-medium capitalize">{key.replace(/_/g, ' ')}</td>
                        <td className="px-4 py-2.5 text-slate-600 dark:text-slate-400">{String(val)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Action Recommendations */}
          {result.recommendations && result.recommendations.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200 flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-teal-600" />
                <span>Clinical Recommendations</span>
              </h3>
              <ul className="space-y-2 text-sm text-slate-700 dark:text-slate-300">
                {result.recommendations.map((rec, idx) => (
                  <li key={idx} className="p-3 rounded-xl bg-slate-100 dark:bg-slate-800/80 flex items-start space-x-2">
                    <span className="font-bold text-indigo-600">•</span>
                    <span>{rec}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* MANDATORY AI DISCLAIMER */}
          <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-900 dark:text-amber-200 text-xs sm:text-sm font-medium flex items-start space-x-3">
            <ShieldAlert className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
            <span>
              AI-generated information is not a medical diagnosis. Consult a qualified healthcare professional.
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReportSummarizer;
