import React, { useState } from 'react';
import { ReferenceItem } from '../types';
import { BookMarked, Check, Copy, Library, Compass, AlertCircle, ExternalLink } from 'lucide-react';

interface ReferencesSectionProps {
  references: ReferenceItem[];
}

export const ReferencesSection: React.FC<ReferencesSectionProps> = ({ references }) => {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const handleCopyCitation = (citation: string, index: number) => {
    navigator.clipboard.writeText(citation);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const establishedCount = references.filter(
    (r) => r.category.toLowerCase().includes('established') || r.category.toLowerCase().includes('real')
  ).length;
  const suggestedCount = references.length - establishedCount;

  return (
    <section id="section-references" className="pt-6 border-t border-slate-200">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 font-display-scholarly flex items-center gap-2">
            <Library className="w-5 h-5 text-indigo-700" />
            References & Scholarly Sources
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Classified citations adhering to academic integrity standards
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 font-medium">
            <span className="w-2 h-2 rounded-full bg-emerald-600" />
            {establishedCount} Established
          </span>
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-indigo-50 text-indigo-800 border border-indigo-200 font-medium">
            <span className="w-2 h-2 rounded-full bg-indigo-600" />
            {suggestedCount} Suggested
          </span>
        </div>
      </div>

      {/* Distinction explanation callout */}
      <div className="mb-6 p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600 space-y-2">
        <div className="flex items-start gap-2">
          <AlertCircle className="w-4 h-4 text-indigo-600 flex-shrink-0 mt-0.5" />
          <div>
            <span className="font-semibold text-slate-800">Citation Transparency Note: </span>
            To maintain strict scholarly honesty without hallucinated claims, references are partitioned into two tiers:
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pl-6 pt-1">
          <div className="p-2.5 bg-white rounded-lg border border-slate-200/80">
            <span className="font-bold text-emerald-800 text-[11px] uppercase tracking-wider block mb-0.5">
              • Established Literature
            </span>
            <span className="text-[11px] text-slate-500">
              Widely cited seminal works, canonical textbooks, or published institutional benchmarks (e.g., UNESCO, WHO, foundational scholars).
            </span>
          </div>
          <div className="p-2.5 bg-white rounded-lg border border-slate-200/80">
            <span className="font-bold text-indigo-800 text-[11px] uppercase tracking-wider block mb-0.5">
              • Suggested Literature
            </span>
            <span className="text-[11px] text-slate-500">
              Recommended topical investigations, peer-reviewed journal directions, or prospective studies for students to locate and consult in their library catalogue.
            </span>
          </div>
        </div>
      </div>

      {/* References List */}
      <div className="space-y-3">
        {references.map((ref, idx) => {
          const isEstablished =
            ref.category.toLowerCase().includes('established') ||
            ref.category.toLowerCase().includes('real');

          return (
            <div
              key={idx}
              className="p-4 rounded-xl border border-slate-200 bg-white hover:border-slate-300 transition-all group"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-2.5 flex-1">
                  <span className="text-xs font-mono font-semibold text-slate-400 mt-0.5">
                    [{idx + 1}]
                  </span>
                  <div className="space-y-1.5 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span
                        className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${
                          isEstablished
                            ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                            : 'bg-indigo-50 text-indigo-800 border-indigo-200'
                        }`}
                      >
                        {ref.category}
                      </span>
                    </div>

                    <p className="text-xs sm:text-sm font-serif-paper text-slate-800 leading-relaxed select-text">
                      {ref.citation}
                    </p>

                    {ref.relevance && (
                      <p className="text-xs text-slate-500 italic bg-slate-50/80 p-2 rounded-lg border border-slate-100">
                        <span className="font-semibold text-slate-600 not-italic">Relevance: </span>
                        {ref.relevance}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-1.5 opacity-90 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => handleCopyCitation(ref.citation, idx)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 transition-colors"
                    title="Copy Citation"
                  >
                    {copiedIndex === idx ? (
                      <Check className="w-4 h-4 text-emerald-600" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </button>
                  <a
                    href={`https://scholar.google.com/scholar?q=${encodeURIComponent(ref.citation)}`}
                    target="_blank"
                    rel="noreferrer"
                    className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 transition-colors"
                    title="Search in Google Scholar"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
