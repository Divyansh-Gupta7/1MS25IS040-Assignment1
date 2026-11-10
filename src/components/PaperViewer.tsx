import React, { useState } from 'react';
import { ResearchPaperData } from '../types';
import { ReferencesSection } from './ReferencesSection';
import {
  formatPaperAsText,
  downloadFile,
  getTotalPaperWords,
} from '../utils';
import {
  Copy,
  Download,
  FileCode,
  Printer,
  Check,
  AlertTriangle,
  Calendar,
  RotateCcw,
  BookOpen,
  Compass,
  FileText,
  ListOrdered,
  Lightbulb,
  ArrowUp,
} from 'lucide-react';

interface PaperViewerProps {
  paper: ResearchPaperData;
  onReset: () => void;
}

export const PaperViewer: React.FC<PaperViewerProps> = ({ paper, onReset }) => {
  const [copied, setCopied] = useState(false);

  // Defensive defaults
  const keywords = Array.isArray(paper.keywords) ? paper.keywords : [];
  const researchObjectives = Array.isArray(paper.research_objectives) ? paper.research_objectives : [];
  const findings = Array.isArray(paper.findings) ? paper.findings : [];
  const references = Array.isArray(paper.references) ? paper.references : [];

  const totalWords = getTotalPaperWords(paper);
  const readingTimeMinutes = Math.max(1, Math.ceil(totalWords / 200));

  const handleCopyPaper = async () => {
    const formatted = formatPaperAsText(paper);
    try {
      await navigator.clipboard.writeText(formatted);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch (e) {
      console.error('Failed to copy', e);
    }
  };

  const handleDownloadTxt = () => {
    const text = formatPaperAsText(paper);
    const safeTopic = (paper.metadata?.topic || 'Research_Paper')
      .replace(/[^a-zA-Z0-9_-]/g, '_')
      .substring(0, 40);
    downloadFile(text, `${safeTopic}_Draft.txt`, 'text/plain;charset=utf-8');
  };

  const handleDownloadJSON = () => {
    // 9. The JSON download button must download the actual generated structured data.
    const jsonOutput = {
      title: paper.title,
      abstract: paper.abstract,
      keywords: keywords,
      introduction: paper.introduction,
      research_objectives: researchObjectives,
      methodology: paper.methodology,
      discussion: paper.discussion,
      findings: findings,
      conclusion: paper.conclusion,
      references: references.map((r) => (typeof r === 'string' ? r : r.citation)),
      research_approach: paper.research_approach,
      detailed_references: references,
    };
    const jsonStr = JSON.stringify(jsonOutput, null, 2);
    const safeTopic = (paper.metadata?.topic || 'Research_Paper')
      .replace(/[^a-zA-Z0-9_-]/g, '_')
      .substring(0, 40);
    downloadFile(jsonStr, `${safeTopic}_Structured_Data.json`, 'application/json;charset=utf-8');
  };

  const handlePrint = () => {
    window.print();
  };

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Action Header Banner (Sticky on scroll) */}
      <div className="no-print sticky top-16 z-30 bg-white/95 backdrop-blur-md p-4 rounded-2xl border border-slate-200/90 shadow-md flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <button
            onClick={onReset}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>New Inquiry</span>
          </button>
          <div className="h-4 w-px bg-slate-300 mx-1 hidden sm:block" />
          <span className="text-xs text-slate-500 hidden md:inline">
            <span className="font-semibold text-slate-700">{totalWords} words</span> · ~{readingTimeMinutes} min read
          </span>
        </div>

        {/* Action Buttons: Copy, Download TXT, Download JSON, Print */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={handleCopyPaper}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold rounded-xl transition-all shadow-sm cursor-pointer ${
              copied
                ? 'bg-emerald-600 text-white'
                : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-100'
            }`}
            title="Copy entire formatted draft to clipboard"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5" />
                <span>Copied Paper!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copy Paper</span>
              </>
            )}
          </button>

          <button
            onClick={handleDownloadTxt}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl transition-colors shadow-sm cursor-pointer"
            title="Download full draft as plain text (.txt)"
          >
            <Download className="w-3.5 h-3.5 text-indigo-600" />
            <span>Download TXT</span>
          </button>

          <button
            onClick={handleDownloadJSON}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl transition-colors shadow-sm cursor-pointer"
            title="Download structured paper data as JSON (.json)"
          >
            <FileCode className="w-3.5 h-3.5 text-indigo-600" />
            <span>Download JSON</span>
          </button>

          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors cursor-pointer"
            title="Print or Save as PDF"
          >
            <Printer className="w-3.5 h-3.5 text-slate-600" />
            <span className="hidden sm:inline">Print / PDF</span>
          </button>
        </div>
      </div>

      {/* Academic Draft Notice (Mandatory verification banner) */}
      <div className="no-print p-4 rounded-2xl bg-amber-50/90 border border-amber-200/90 text-amber-900 flex items-start gap-3 shadow-xs">
        <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
        <div className="text-xs sm:text-sm space-y-1">
          <p className="font-bold text-amber-950">
            Student Academic Draft Notice
          </p>
          <p className="text-amber-800 leading-relaxed text-xs">
            This document is a generated research draft designed to provide structural scaffolding, conceptual synthesis, and methodological foundations. As an academic author, you should <span className="font-semibold underline">critically verify all claims</span>, cross-reference literature citations in university databases, expand original arguments, and format according to your department's specific style guide (APA, MLA, IEEE, etc.).
          </p>
        </div>
      </div>

      {/* Quick Section Jump Navigation */}
      <div className="no-print bg-slate-100/80 p-2.5 rounded-xl flex items-center gap-1.5 overflow-x-auto text-xs font-medium text-slate-600">
        <span className="text-[11px] uppercase tracking-wider text-slate-400 font-bold px-2 whitespace-nowrap">
          Jump to:
        </span>
        <button
          onClick={() => scrollToSection('section-abstract')}
          className="px-2.5 py-1 rounded-lg bg-white hover:bg-indigo-50 hover:text-indigo-700 text-slate-700 shadow-xs whitespace-nowrap transition-colors"
        >
          Abstract
        </button>
        <button
          onClick={() => scrollToSection('section-approach')}
          className="px-2.5 py-1 rounded-lg bg-white hover:bg-indigo-50 hover:text-indigo-700 text-slate-700 shadow-xs whitespace-nowrap transition-colors"
        >
          Research Approach
        </button>
        <button
          onClick={() => scrollToSection('section-introduction')}
          className="px-2.5 py-1 rounded-lg bg-white hover:bg-indigo-50 hover:text-indigo-700 text-slate-700 shadow-xs whitespace-nowrap transition-colors"
        >
          Introduction
        </button>
        <button
          onClick={() => scrollToSection('section-objectives')}
          className="px-2.5 py-1 rounded-lg bg-white hover:bg-indigo-50 hover:text-indigo-700 text-slate-700 shadow-xs whitespace-nowrap transition-colors"
        >
          Objectives
        </button>
        <button
          onClick={() => scrollToSection('section-methodology')}
          className="px-2.5 py-1 rounded-lg bg-white hover:bg-indigo-50 hover:text-indigo-700 text-slate-700 shadow-xs whitespace-nowrap transition-colors"
        >
          Methodology
        </button>
        <button
          onClick={() => scrollToSection('section-discussion')}
          className="px-2.5 py-1 rounded-lg bg-white hover:bg-indigo-50 hover:text-indigo-700 text-slate-700 shadow-xs whitespace-nowrap transition-colors"
        >
          Discussion
        </button>
        <button
          onClick={() => scrollToSection('section-findings')}
          className="px-2.5 py-1 rounded-lg bg-white hover:bg-indigo-50 hover:text-indigo-700 text-slate-700 shadow-xs whitespace-nowrap transition-colors"
        >
          Findings
        </button>
        <button
          onClick={() => scrollToSection('section-conclusion')}
          className="px-2.5 py-1 rounded-lg bg-white hover:bg-indigo-50 hover:text-indigo-700 text-slate-700 shadow-xs whitespace-nowrap transition-colors"
        >
          Conclusion
        </button>
        <button
          onClick={() => scrollToSection('section-references')}
          className="px-2.5 py-1 rounded-lg bg-white hover:bg-indigo-50 hover:text-indigo-700 text-slate-700 shadow-xs whitespace-nowrap transition-colors"
        >
          References
        </button>
      </div>

      {/* Main Scholarly Paper Canvas */}
      <article className="paper-page bg-white rounded-2xl shadow-sm border border-slate-200/90 p-6 sm:p-12 lg:p-16 space-y-8 max-w-4xl mx-auto">
        {/* Header Metadata */}
        <div className="border-b border-slate-200 pb-8 text-center space-y-4">
          <div className="flex items-center justify-center gap-2 flex-wrap text-xs">
            <span className="px-3 py-1 rounded-full font-semibold uppercase tracking-wider bg-indigo-50 text-indigo-700 border border-indigo-200">
              Level: {paper.metadata?.academicLevel || 'Undergraduate'}
            </span>
            <span className="px-3 py-1 rounded-full font-semibold uppercase tracking-wider bg-slate-100 text-slate-700 border border-slate-200">
              Draft Document
            </span>
            {paper.metadata?.generatedAt && (
              <span className="text-slate-400 flex items-center gap-1 text-xs">
                <Calendar className="w-3.5 h-3.5" />
                {new Date(paper.metadata.generatedAt).toLocaleDateString(undefined, {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </span>
            )}
          </div>

          {/* Paper Title */}
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-900 font-serif-paper leading-tight max-w-3xl mx-auto">
            {paper.title}
          </h1>

          {/* Research Topic & Question sub-header */}
          <div className="pt-2 text-xs sm:text-sm text-slate-500 max-w-2xl mx-auto space-y-1">
            <p>
              <strong className="text-slate-700">Topic:</strong> {paper.metadata?.topic}
            </p>
            {paper.metadata?.researchQuestion && (
              <p>
                <strong className="text-slate-700">Primary Inquiry:</strong> {paper.metadata?.researchQuestion}
              </p>
            )}
          </div>
        </div>

        {/* Section 1: Abstract & Keywords */}
        <section id="section-abstract" className="space-y-4">
          <div className="bg-slate-50/90 rounded-2xl p-6 border border-slate-200/80 space-y-4">
            <h2 className="text-xs font-bold uppercase tracking-widest text-slate-500 font-display-scholarly text-center">
              Abstract
            </h2>
            <p className="text-sm sm:text-base font-serif-paper text-slate-800 leading-relaxed text-justify">
              {paper.abstract}
            </p>

            {/* Keywords */}
            <div className="pt-3 border-t border-slate-200/60 flex items-start gap-2 flex-wrap">
              <span className="text-xs font-semibold text-slate-700 uppercase tracking-wider mt-1">
                Keywords:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {keywords.map((kw, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium bg-white text-slate-700 border border-slate-200 shadow-2xs"
                  >
                    {kw}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Section 2: Research Approach */}
        <section id="section-approach" className="space-y-3 pt-4 border-t border-slate-100">
          <div className="flex items-center gap-2 text-indigo-900 font-display-scholarly">
            <Compass className="w-5 h-5 text-indigo-600" />
            <h2 className="text-lg font-bold text-slate-900">Research Approach & Analytical Lens</h2>
          </div>
          <div className="p-4 rounded-xl bg-indigo-50/50 border border-indigo-100 text-xs sm:text-sm text-slate-700 leading-relaxed font-serif-paper">
            {paper.research_approach}
          </div>
        </section>

        {/* Section 3: Introduction */}
        <section id="section-introduction" className="space-y-3 pt-4 border-t border-slate-100">
          <h2 className="text-lg sm:text-xl font-bold text-slate-900 font-display-scholarly flex items-center gap-2">
            <FileText className="w-5 h-5 text-indigo-700" />
            1. Introduction & Background
          </h2>
          <div className="prose prose-slate max-w-none text-sm sm:text-base font-serif-paper text-slate-800 leading-relaxed whitespace-pre-line space-y-4">
            {paper.introduction}
          </div>
        </section>

        {/* Section 4: Research Objectives */}
        <section id="section-objectives" className="space-y-3 pt-4 border-t border-slate-100">
          <h2 className="text-lg sm:text-xl font-bold text-slate-900 font-display-scholarly flex items-center gap-2">
            <ListOrdered className="w-5 h-5 text-indigo-700" />
            2. Research Objectives
          </h2>
          <div className="grid grid-cols-1 gap-2.5">
            {researchObjectives.map((obj, idx) => (
              <div
                key={idx}
                className="flex items-start gap-3 p-3.5 rounded-xl bg-slate-50/80 border border-slate-200 text-xs sm:text-sm text-slate-800"
              >
                <span className="w-6 h-6 rounded-lg bg-indigo-600 text-white flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
                  {idx + 1}
                </span>
                <span className="leading-relaxed font-serif-paper">{obj}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Section 5: Methodology */}
        <section id="section-methodology" className="space-y-3 pt-4 border-t border-slate-100">
          <h2 className="text-lg sm:text-xl font-bold text-slate-900 font-display-scholarly flex items-center gap-2">
            <Compass className="w-5 h-5 text-indigo-700" />
            3. Methodology & Theoretical Framework
          </h2>
          <div className="prose prose-slate max-w-none text-sm sm:text-base font-serif-paper text-slate-800 leading-relaxed whitespace-pre-line space-y-4">
            {paper.methodology}
          </div>
        </section>

        {/* Section 6: Main Discussion */}
        <section id="section-discussion" className="space-y-3 pt-4 border-t border-slate-100">
          <h2 className="text-lg sm:text-xl font-bold text-slate-900 font-display-scholarly flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-indigo-700" />
            4. Main Discussion & Critical Analysis
          </h2>
          <div className="prose prose-slate max-w-none text-sm sm:text-base font-serif-paper text-slate-800 leading-relaxed whitespace-pre-line space-y-4">
            {paper.discussion}
          </div>
        </section>

        {/* Section 7: Findings */}
        <section id="section-findings" className="space-y-3 pt-4 border-t border-slate-100">
          <h2 className="text-lg sm:text-xl font-bold text-slate-900 font-display-scholarly flex items-center gap-2">
            <Lightbulb className="w-5 h-5 text-indigo-700" />
            5. Key Findings & Synthesis
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {findings.map((finding, idx) => (
              <div
                key={idx}
                className="p-4 rounded-xl border border-indigo-100 bg-indigo-50/30 hover:bg-indigo-50/60 transition-colors space-y-1"
              >
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-indigo-600" />
                  <span className="text-xs font-bold uppercase tracking-wider text-indigo-900">
                    Finding 0{idx + 1}
                  </span>
                </div>
                <p className="text-xs sm:text-sm font-serif-paper text-slate-800 leading-relaxed">
                  {finding}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Section 8: Conclusion */}
        <section id="section-conclusion" className="space-y-3 pt-4 border-t border-slate-100">
          <h2 className="text-lg sm:text-xl font-bold text-slate-900 font-display-scholarly flex items-center gap-2">
            <FileText className="w-5 h-5 text-indigo-700" />
            6. Conclusion & Scholarly Implications
          </h2>
          <div className="prose prose-slate max-w-none text-sm sm:text-base font-serif-paper text-slate-800 leading-relaxed whitespace-pre-line space-y-4">
            {paper.conclusion}
          </div>
        </section>

        {/* Section 9: References (Categorized into Established vs Suggested) */}
        <ReferencesSection references={references} />

        {/* Paper End Mark */}
        <div className="pt-8 border-t border-slate-200 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-100 text-slate-500 text-xs font-mono">
            <span>*** End of Academic Research Paper Draft ***</span>
          </div>
        </div>
      </article>

      {/* Footer Back to Top and Quick Reset */}
      <div className="no-print max-w-4xl mx-auto flex items-center justify-between text-xs text-slate-500 px-2 py-4">
        <button
          onClick={onReset}
          className="flex items-center gap-1.5 text-indigo-600 hover:text-indigo-800 font-semibold cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Formulate Another Topic</span>
        </button>

        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="flex items-center gap-1 hover:text-slate-800 cursor-pointer"
        >
          <ArrowUp className="w-3.5 h-3.5" />
          <span>Back to Top</span>
        </button>
      </div>
    </div>
  );
};
