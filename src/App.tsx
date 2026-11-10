/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { Navbar } from './components/Navbar';
import { TopicForm } from './components/TopicForm';
import { LoadingState } from './components/LoadingState';
import { PaperViewer } from './components/PaperViewer';
import { AcademicLevel, ResearchPaperData } from './types';
import { History, Trash2, ArrowUpRight } from 'lucide-react';

export default function App() {
  const [topic, setTopic] = useState('');
  const [researchQuestion, setResearchQuestion] = useState('');
  const [academicLevel, setAcademicLevel] = useState<AcademicLevel>('Undergraduate');
  const [paper, setPaper] = useState<ResearchPaperData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [savedPapers, setSavedPapers] = useState<ResearchPaperData[]>([]);

  const abortControllerRef = useRef<AbortController | null>(null);

  // Load saved papers from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem('rpa_saved_papers');
      if (saved) {
        setSavedPapers(JSON.parse(saved));
      }
    } catch (e) {
      console.warn('Could not read saved papers from localStorage', e);
    }
  }, []);

  const handleCancel = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort('user_cancelled');
      abortControllerRef.current = null;
    }
    setIsLoading(false);
    setErrorMessage('Generation was cancelled.');
  };

  const handleGenerate = async () => {
    // 8. Display clear error messages if the topic is empty or generation fails
    if (!topic || topic.trim().length === 0) {
      setErrorMessage('Please enter a research topic before generating a research paper.');
      return;
    }

    setErrorMessage(null);
    setIsLoading(true);

    const controller = new AbortController();
    abortControllerRef.current = controller;

    // Generous timeout of 120 seconds to prevent premature aborts while guarding against infinite hangs
    const timeoutId = setTimeout(() => {
      controller.abort('timeout');
    }, 120000);

    try {
      const response = await fetch('/api/generate-paper', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          topic: topic.trim(),
          researchQuestion: researchQuestion.trim(),
          academicLevel,
        }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate research paper. Please check server status.');
      }

      // Successful response: Set paper data, which immediately ends loading state and renders PaperViewer
      setPaper(data);
      setErrorMessage(null);

      // Save to local history
      try {
        const updated = [data, ...savedPapers.filter((p) => p.title !== data.title)].slice(0, 5);
        setSavedPapers(updated);
        localStorage.setItem('rpa_saved_papers', JSON.stringify(updated));
      } catch (e) {
        console.warn('LocalStorage save failed', e);
      }

      // Smooth scroll to top of paper view
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err: any) {
      clearTimeout(timeoutId);
      console.error('Generation failed:', err);

      const abortReason = controller.signal.reason;
      if (err.name === 'AbortError' || controller.signal.aborted) {
        if (abortReason === 'user_cancelled') {
          setErrorMessage('Generation was cancelled.');
        } else if (abortReason === 'timeout') {
          setErrorMessage('Generation took longer than expected. Please try generating again.');
        } else {
          setErrorMessage('The request was interrupted. Please try again.');
        }
      } else {
        setErrorMessage(
          err.message || 'An error occurred while generating the research paper. Please try again.'
        );
      }
    } finally {
      // 7. Make sure loading state is always reset in both success and error cases
      setIsLoading(false);
      abortControllerRef.current = null;
    }
  };

  const handleClearError = () => {
    setErrorMessage(null);
  };

  const handleReset = () => {
    setPaper(null);
    setErrorMessage(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLoadSavedPaper = (saved: ResearchPaperData) => {
    setPaper(saved);
    setTopic(saved.metadata?.topic || saved.title);
    setResearchQuestion(saved.metadata?.researchQuestion || '');
    if (saved.metadata?.academicLevel) {
      setAcademicLevel(saved.metadata.academicLevel);
    }
    setErrorMessage(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleClearHistory = () => {
    setSavedPapers([]);
    try {
      localStorage.removeItem('rpa_saved_papers');
    } catch (e) {
      // ignore
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 flex flex-col font-sans selection:bg-indigo-500 selection:text-white">
      <Navbar />

      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-10">
        {isLoading ? (
          <LoadingState topic={topic} level={academicLevel} onCancel={handleCancel} />
        ) : paper ? (
          <PaperViewer paper={paper} onReset={handleReset} />
        ) : (
          <div className="space-y-8">
            <TopicForm
              topic={topic}
              setTopic={setTopic}
              researchQuestion={researchQuestion}
              setResearchQuestion={setResearchQuestion}
              academicLevel={academicLevel}
              setAcademicLevel={setAcademicLevel}
              onGenerate={handleGenerate}
              isLoading={isLoading}
              errorMessage={errorMessage}
              onClearError={handleClearError}
            />

            {/* Saved Previous Drafts (Session History) */}
            {savedPapers.length > 0 && (
              <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-2xs">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <History className="w-4 h-4 text-indigo-600" />
                    <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                      Recent Generated Drafts ({savedPapers.length})
                    </h3>
                  </div>
                  <button
                    onClick={handleClearHistory}
                    className="text-[11px] text-slate-400 hover:text-rose-600 flex items-center gap-1 transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-3 h-3" />
                    <span>Clear history</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {savedPapers.map((saved, idx) => (
                    <div
                      key={idx}
                      onClick={() => handleLoadSavedPaper(saved)}
                      className="p-3.5 rounded-xl border border-slate-100 bg-slate-50/60 hover:bg-indigo-50/40 hover:border-indigo-200 transition-all cursor-pointer flex items-start justify-between gap-3 group"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-1.5">
                          <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-indigo-100 text-indigo-700">
                            {saved.metadata?.academicLevel || 'Undergraduate'}
                          </span>
                          <span className="text-[10px] text-slate-400">
                            {saved.metadata?.generatedAt
                              ? new Date(saved.metadata.generatedAt).toLocaleDateString()
                              : 'Draft'}
                          </span>
                        </div>
                        <p className="text-xs font-semibold text-slate-800 group-hover:text-indigo-900 line-clamp-1">
                          {saved.title}
                        </p>
                        <p className="text-[11px] text-slate-500 line-clamp-1">
                          {saved.abstract ? saved.abstract.substring(0, 90) : ''}...
                        </p>
                      </div>
                      <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-indigo-600 flex-shrink-0 mt-1 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="no-print mt-auto border-t border-slate-200/80 bg-white py-6">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
          <p>
            <span className="font-semibold text-slate-700">Research Paper Agent</span> · Academic Draft Assistant
          </p>
          <p className="text-slate-400 text-center sm:text-right">
            Designed for student inquiry structuring · Always cross-check citations with primary literature
          </p>
        </div>
      </footer>
    </div>
  );
}
