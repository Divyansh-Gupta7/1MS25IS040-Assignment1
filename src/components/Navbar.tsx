import React, { useState } from 'react';
import { BookOpen, Sparkles, ShieldCheck, Info, X, ExternalLink } from 'lucide-react';

export const Navbar: React.FC = () => {
  const [showIntegrityModal, setShowIntegrityModal] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-700 to-indigo-900 flex items-center justify-center text-white shadow-md shadow-indigo-200">
              <BookOpen className="w-5 h-5 text-indigo-100" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-slate-900 text-lg tracking-tight font-display-scholarly">
                  Research Paper Agent
                </span>
                <span className="text-xs px-2 py-0.5 rounded-full font-medium bg-indigo-50 text-indigo-700 border border-indigo-200/60 hidden sm:inline-block">
                  Academic Draft Assistant
                </span>
              </div>
              <p className="text-xs text-slate-500 hidden sm:block">
                Structured scholarly drafting for School, Undergraduate & Postgraduate inquiries
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowIntegrityModal(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-600 hover:text-indigo-600 bg-slate-100 hover:bg-indigo-50 rounded-lg transition-colors border border-transparent hover:border-indigo-200"
              title="Academic Integrity & Citation Rules"
            >
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span className="hidden sm:inline">Academic Guidelines</span>
              <span className="sm:hidden">Guidelines</span>
            </button>
          </div>
        </div>
      </header>

      {/* Academic Integrity Modal */}
      {showIntegrityModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 relative">
            <button
              onClick={() => setShowIntegrityModal(false)}
              className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-200">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-lg">Academic Integrity & Draft Usage</h3>
                <p className="text-xs text-slate-500">Student Ethical Writing Standards</p>
              </div>
            </div>

            <div className="space-y-3 text-sm text-slate-600 leading-relaxed">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80">
                <h4 className="font-semibold text-slate-800 text-xs uppercase tracking-wider mb-1">
                  1. Draft Status
                </h4>
                <p className="text-xs text-slate-600">
                  Every document produced by this agent is an exploratory working draft. It provides structural framing, research questions, and initial conceptual synthesis. Students must critically review, expand, and rewrite text in their own words.
                </p>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80">
                <h4 className="font-semibold text-slate-800 text-xs uppercase tracking-wider mb-1">
                  2. Citation Verification
                </h4>
                <p className="text-xs text-slate-600">
                  References are categorized into <span className="font-semibold text-emerald-700">Established Literature</span> (widely recognized seminal works) and <span className="font-semibold text-indigo-700">Suggested Literature</span> (recommended exploratory directions). Always locate and read the original papers before submitting.
                </p>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80">
                <h4 className="font-semibold text-slate-800 text-xs uppercase tracking-wider mb-1">
                  3. Transparent Research Approach
                </h4>
                <p className="text-xs text-slate-600">
                  A concise research approach section details the analytical perspective and literature review strategy without concealing the underlying methodology.
                </p>
              </div>
            </div>

            <div className="mt-5 pt-4 border-t border-slate-100 flex justify-end">
              <button
                onClick={() => setShowIntegrityModal(false)}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-medium transition-colors"
              >
                I Understand
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
