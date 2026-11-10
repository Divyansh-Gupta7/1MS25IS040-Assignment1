import React from 'react';
import { AcademicLevel, PresetTopic } from '../types';
import { PRESET_EXAMPLES } from '../utils';
import { Sparkles, HelpCircle, Layers, ArrowRight, BookMarked, AlertCircle } from 'lucide-react';

interface TopicFormProps {
  topic: string;
  setTopic: (val: string) => void;
  researchQuestion: string;
  setResearchQuestion: (val: string) => void;
  academicLevel: AcademicLevel;
  setAcademicLevel: (val: AcademicLevel) => void;
  onGenerate: () => void;
  isLoading: boolean;
  errorMessage: string | null;
  onClearError: () => void;
}

export const TopicForm: React.FC<TopicFormProps> = ({
  topic,
  setTopic,
  researchQuestion,
  setResearchQuestion,
  academicLevel,
  setAcademicLevel,
  onGenerate,
  isLoading,
  errorMessage,
  onClearError,
}) => {
  const handleSelectPreset = (preset: PresetTopic) => {
    setTopic(preset.topic);
    setResearchQuestion(preset.question);
    setAcademicLevel(preset.level);
    onClearError();
  };

  const getAcademicLevelDescription = (level: AcademicLevel) => {
    switch (level) {
      case 'School':
        return 'Clear, foundational concepts, accessible scholarly tone, structured explanations.';
      case 'Undergraduate':
        return 'Analytical rigor, balanced benefits/challenges, structured methodology & synthesis.';
      case 'Postgraduate':
        return 'Advanced theoretical frameworks, critical epistemology, deep methodological nuance.';
      default:
        return '';
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200/90 overflow-hidden">
      {/* Card Header */}
      <div className="p-6 sm:p-8 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white relative">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-200 text-xs font-medium border border-indigo-400/30 mb-3">
            <Sparkles className="w-3.5 h-3.5 text-indigo-300" />
            <span>AI Scholarly Drafting Agent</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white mb-2 font-display-scholarly">
            Formulate Your Research Inquiry
          </h1>
          <p className="text-sm text-slate-300 leading-relaxed max-w-2xl">
            Input your research topic and question. The agent will craft a comprehensive, structured research paper draft equipped with theoretical context, objectives, methodology, discussion, findings, and distinguished reference citations.
          </p>
        </div>
      </div>

      <div className="p-6 sm:p-8 space-y-6">
        {/* Preset quick-load examples */}
        <div>
          <div className="flex items-center justify-between mb-2.5">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
              <BookMarked className="w-3.5 h-3.5 text-indigo-600" />
              Quick Fill Examples
            </span>
            <span className="text-xs text-slate-400 hidden sm:inline">Click to pre-populate</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
            {PRESET_EXAMPLES.map((preset, index) => (
              <button
                key={index}
                type="button"
                onClick={() => handleSelectPreset(preset)}
                disabled={isLoading}
                className="text-left p-3 rounded-xl border border-slate-200 hover:border-indigo-300 bg-slate-50/60 hover:bg-indigo-50/50 transition-all group flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-1 mb-1">
                    <span className="text-[10px] font-semibold uppercase tracking-wider px-1.5 py-0.5 rounded bg-indigo-100 text-indigo-700">
                      {preset.badge}
                    </span>
                    <span className="text-[10px] text-slate-400 font-medium">
                      {preset.level}
                    </span>
                  </div>
                  <p className="text-xs font-semibold text-slate-800 group-hover:text-indigo-900 line-clamp-1">
                    {preset.title}
                  </p>
                  <p className="text-[11px] text-slate-500 line-clamp-2 mt-0.5">
                    "{preset.topic}"
                  </p>
                </div>
                <div className="mt-2 flex items-center text-[10px] font-medium text-indigo-600 group-hover:text-indigo-700">
                  <span>Load topic</span>
                  <ArrowRight className="w-3 h-3 ml-1 group-hover:translate-x-0.5 transition-transform" />
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Error Alert */}
        {errorMessage && (
          <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl text-rose-800 text-sm flex items-start gap-3 animate-in fade-in">
            <AlertCircle className="w-5 h-5 text-rose-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="font-semibold text-rose-900 text-sm">Action Required</p>
              <p className="text-xs text-rose-700 mt-0.5">{errorMessage}</p>
            </div>
            <button
              onClick={onClearError}
              className="text-xs text-rose-500 hover:text-rose-700 font-medium ml-2 underline"
            >
              Dismiss
            </button>
          </div>
        )}

        <form
          onSubmit={(e) => {
            e.preventDefault();
            onGenerate();
          }}
          className="space-y-5"
        >
          {/* Input 1: Research Topic */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label
                htmlFor="research-topic"
                className="text-sm font-semibold text-slate-800 flex items-center gap-1.5"
              >
                1. Research Topic <span className="text-rose-500">*</span>
              </label>
              <span className="text-xs text-slate-400">
                {topic.length} characters
              </span>
            </div>
            <input
              id="research-topic"
              type="text"
              value={topic}
              onChange={(e) => {
                setTopic(e.target.value);
                if (errorMessage) onClearError();
              }}
              placeholder="e.g. Impact of Artificial Intelligence on Education"
              disabled={isLoading}
              className={`w-full px-4 py-3 rounded-xl border text-sm transition-all focus:outline-none focus:ring-2 ${
                errorMessage && !topic.trim()
                  ? 'border-rose-400 ring-2 ring-rose-100 bg-rose-50/20'
                  : 'border-slate-300 focus:border-indigo-500 focus:ring-indigo-100 bg-white'
              }`}
            />
            <p className="text-xs text-slate-500 mt-1">
              The overarching subject or domain of scholarly interest.
            </p>
          </div>

          {/* Input 2: Research Question or Objective */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label
                htmlFor="research-question"
                className="text-sm font-semibold text-slate-800 flex items-center gap-1.5"
              >
                2. Research Question or Objective
                <span className="text-xs font-normal text-slate-400">(Optional but recommended)</span>
              </label>
            </div>
            <textarea
              id="research-question"
              rows={2}
              value={researchQuestion}
              onChange={(e) => {
                setResearchQuestion(e.target.value);
                if (errorMessage) onClearError();
              }}
              placeholder="e.g. How is AI changing teaching and learning in higher education?"
              disabled={isLoading}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 text-sm transition-all resize-none bg-white focus:outline-none"
            />
            <p className="text-xs text-slate-500 mt-1">
              Specific problem, hypothesis, or inquiry guiding the paper's investigation.
            </p>
          </div>

          {/* Input 3: Academic Level Dropdown */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-1">
            <div className="md:col-span-1">
              <label
                htmlFor="academic-level"
                className="block text-sm font-semibold text-slate-800 mb-1.5"
              >
                3. Academic Level <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <select
                  id="academic-level"
                  value={academicLevel}
                  onChange={(e) => setAcademicLevel(e.target.value as AcademicLevel)}
                  disabled={isLoading}
                  className="w-full appearance-none px-4 py-2.5 rounded-xl border border-slate-300 bg-white text-sm font-medium text-slate-800 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 focus:outline-none cursor-pointer pr-10"
                >
                  <option value="School">School (High School / Secondary)</option>
                  <option value="Undergraduate">Undergraduate (College / University)</option>
                  <option value="Postgraduate">Postgraduate (Masters / PhD)</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-slate-400">
                  <Layers className="w-4 h-4" />
                </div>
              </div>
            </div>

            <div className="md:col-span-2 flex items-center">
              <div className="p-3 bg-slate-50 border border-slate-200/80 rounded-xl w-full">
                <span className="text-[11px] font-semibold text-indigo-700 uppercase tracking-wider block mb-0.5">
                  Calibrated Depth: {academicLevel}
                </span>
                <p className="text-xs text-slate-600">
                  {getAcademicLevelDescription(academicLevel)}
                </p>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-3">
            <button
              type="submit"
              disabled={isLoading}
              className={`w-full py-3.5 px-6 rounded-xl font-semibold text-sm shadow-md transition-all flex items-center justify-center gap-2 ${
                isLoading
                  ? 'bg-indigo-300 text-white cursor-not-allowed'
                  : 'bg-indigo-600 hover:bg-indigo-700 active:scale-[0.99] text-white shadow-indigo-200 hover:shadow-lg hover:shadow-indigo-200'
              }`}
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Generating Scholarly Paper Draft...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-indigo-200" />
                  <span>Generate Research Paper</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
