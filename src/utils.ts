import { PresetTopic, ResearchPaperData } from './types';

export const PRESET_EXAMPLES: PresetTopic[] = [
  {
    title: 'AI in Higher Education',
    badge: 'Example 1',
    topic: 'Impact of Artificial Intelligence on Education',
    question: 'How is AI changing teaching and learning in higher education?',
    level: 'Undergraduate',
  },
  {
    title: 'Renewable Energy & Sustainability',
    badge: 'Example 2',
    topic: 'Renewable Energy and Sustainable Development',
    question: 'What role can renewable energy play in achieving sustainable development?',
    level: 'Undergraduate',
  },
  {
    title: 'CRISPR Gene Editing Ethics',
    badge: 'Postgraduate Focus',
    topic: 'Ethical and Regulatory Dimensions of Human Germline Gene Editing',
    question: 'What bioethical principles and international governance frameworks should regulate clinical germline modifications?',
    level: 'Postgraduate',
  },
  {
    title: 'Marine Microplastics',
    badge: 'School Level',
    topic: 'Microplastics in Marine Ecosystems',
    question: 'How do microplastics enter marine food webs and what are their primary ecological impacts?',
    level: 'School',
  },
];

export function formatPaperAsText(paper: ResearchPaperData): string {
  const divider = '='.repeat(70);
  const subDivider = '-'.repeat(70);

  const referencesFormatted = paper.references
    .map(
      (ref, idx) =>
        `[${idx + 1}] [${ref.category.toUpperCase()}]\n    ${ref.citation}\n    Relevance: ${ref.relevance}`
    )
    .join('\n\n');

  const objectivesFormatted = paper.research_objectives
    .map((obj, idx) => `${idx + 1}. ${obj}`)
    .join('\n');

  const findingsFormatted = paper.findings
    .map((f, idx) => `• Finding ${idx + 1}: ${f}`)
    .join('\n');

  return `
${divider}
${paper.title.toUpperCase()}
${divider}

[ACADEMIC RESEARCH PAPER DRAFT]
Academic Level: ${paper.metadata?.academicLevel || 'Undergraduate'}
Research Topic: ${paper.metadata?.topic || 'N/A'}
Research Question: ${paper.metadata?.researchQuestion || 'N/A'}
Date of Generation: ${paper.metadata?.generatedAt ? new Date(paper.metadata.generatedAt).toLocaleDateString() : new Date().toLocaleDateString()}
Notice: This is a generated scholarly draft for student research structuring, verification, and critical revision.

${subDivider}
1. ABSTRACT
${subDivider}
${paper.abstract}

Keywords: ${paper.keywords.join(', ')}

${subDivider}
2. RESEARCH APPROACH
${subDivider}
${paper.research_approach}

${subDivider}
3. INTRODUCTION
${subDivider}
${paper.introduction}

${subDivider}
4. RESEARCH OBJECTIVES
${subDivider}
${objectivesFormatted}

${subDivider}
5. METHODOLOGY
${subDivider}
${paper.methodology}

${subDivider}
6. MAIN DISCUSSION
${subDivider}
${paper.discussion}

${subDivider}
7. FINDINGS
${subDivider}
${findingsFormatted}

${subDivider}
8. CONCLUSION
${subDivider}
${paper.conclusion}

${subDivider}
9. REFERENCES & SCHOLARLY SOURCES
Notice: References are distinguished below between established literature and suggested exploratory readings.
${subDivider}
${referencesFormatted}

${divider}
END OF RESEARCH PAPER DRAFT
${divider}
`.trim();
}

export function formatPaperAsJSON(paper: ResearchPaperData) {
  return {
    title: paper.title,
    abstract: paper.abstract,
    keywords: paper.keywords,
    research_approach: paper.research_approach,
    introduction: paper.introduction,
    research_objectives: paper.research_objectives,
    methodology: paper.methodology,
    discussion: paper.discussion,
    findings: paper.findings,
    conclusion: paper.conclusion,
    references: paper.references.map((r) => ({
      citation: r.citation,
      category: r.category,
      relevance: r.relevance,
    })),
    metadata: paper.metadata,
  };
}

export function downloadFile(content: string, filename: string, mimeType: string) {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export function countWords(text: string): number {
  if (!text) return 0;
  return text.trim().split(/\s+/).filter(Boolean).length;
}

export function getTotalPaperWords(paper: ResearchPaperData): number {
  let count = 0;
  count += countWords(paper.title);
  count += countWords(paper.abstract);
  count += countWords(paper.research_approach);
  count += countWords(paper.introduction);
  count += countWords(paper.methodology);
  count += countWords(paper.discussion);
  count += countWords(paper.conclusion);
  paper.research_objectives.forEach((obj) => (count += countWords(obj)));
  paper.findings.forEach((f) => (count += countWords(f)));
  return count;
}
