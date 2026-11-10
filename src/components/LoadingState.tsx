import React, { useState, useEffect } from 'react';
import { BookOpen, Search, Compass, FileText, CheckCircle2, Loader2, XCircle } from 'lucide-react';

interface LoadingStateProps {
  topic: string;
  level: string;
  onCancel?: () => void;
}

const PHASES = [
  {
    title: 'Connecting to Gemini & Analyzing Inquiry',
    detail: 'Formulating academic title, scope, and research objectives...',
    threshold: 0,
  },
  {
    title: 'Synthesizing Literature & Methodology',
    detail: 'Establishing theoretical framework and analytical method...',
    threshold: 2,
  },
  {
    title: 'Drafting Main Discussion & Findings',
    detail: 'Balancing arguments, evidence, and critical insights...',
    threshold: 5,
  },
  {
    title: 'Finalizing Sections & References',
    detail: 'Structuring references and validating academic draft...',
    threshold: 8,
  },
];

export const LoadingState: React.FC<LoadingStateProps> = ({ topic, level, onCancel }) => {
  const [elapsedSeconds, setElapsedSeconds] = useState(0);

  useEffect(() => {
    const startTime = Date.now();
    const interval = setInterval(() => {
      setElapsedSeconds(Math.floor((Date.now() - startTime) / 1000));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-white rounded-2xl p-8 sm:p-12 shadow-sm border border-slate-200/90 text-center max-w-2xl mx-auto my-8 animate-in fade-in duration-200">
      <div className="relative w-16 h-16 mx-auto mb-5">
        <div className="w-16 h-16 rounded-2xl bg-indigo-600 text-white flex items-center justify-center shadow-lg shadow-indigo-200">
          <Loader2 className="w-8 h-8 animate-spin text-indigo-100" />
        </div>
      </div>

      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-semibold mb-2">
        <span className="w-2 h-2 rounded-full bg-indigo-600 animate-pulse" />
        <span>Gemini API Call in Progress ({elapsedSeconds}s)</span>
      </div>

      <h3 className="text-xl font-bold text-slate-900 mb-1 font-display-scholarly">
        Generating Research Paper Draft
      </h3>
      <p className="text-xs text-slate-500 max-w-md mx-auto mb-6 line-clamp-1 italic">
        Topic: "{topic}" ({level} Level)
      </p>

      {/* Progress Phases */}
      <div className="space-y-3 max-w-md mx-auto text-left mb-6">
        {PHASES.map((phase, idx) => {
          const isActive = elapsedSeconds >= phase.threshold;
          const isCurrent =
            isActive && (idx === PHASES.length - 1 || elapsedSeconds < PHASES[idx + 1].threshold);
          const isDone = idx < PHASES.length - 1 && elapsedSeconds >= PHASES[idx + 1].threshold;

          return (
            <div
              key={idx}
              className={`flex items-start gap-3 p-3 rounded-xl border transition-all ${
                isCurrent
                  ? 'bg-indigo-50/90 border-indigo-200 shadow-xs'
                  : isDone
                  ? 'bg-slate-50/90 border-slate-200/80 text-slate-700'
                  : 'bg-white border-slate-100 opacity-40'
              }`}
            >
              <div
                className={`w-6 h-6 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5 text-xs font-bold ${
                  isDone
                    ? 'bg-emerald-100 text-emerald-700'
                    : isCurrent
                    ? 'bg-indigo-600 text-white animate-pulse'
                    : 'bg-slate-200 text-slate-400'
                }`}
              >
                {isDone ? (
                  <CheckCircle2 className="w-3.5 h-3.5" />
                ) : isCurrent ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <span>{idx + 1}</span>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p
                  className={`text-xs font-semibold ${
                    isCurrent ? 'text-indigo-950 font-bold' : isDone ? 'text-slate-700' : 'text-slate-400'
                  }`}
                >
                  {phase.title}
                </p>
                <p className="text-[11px] text-slate-500 leading-tight mt-0.5">
                  {phase.detail}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {onCancel && (
        <button
          type="button"
          onClick={onCancel}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-500 hover:text-slate-800 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
        >
          <XCircle className="w-3.5 h-3.5" />
          <span>Cancel & Return to Form</span>
        </button>
      )}
    </div>
  );
};
