export type AcademicLevel = 'School' | 'Undergraduate' | 'Postgraduate';

export interface ReferenceItem {
  citation: string;
  category: 'Established Literature' | 'Suggested Literature';
  relevance: string;
}

export interface ResearchPaperData {
  title: string;
  abstract: string;
  keywords: string[];
  research_approach: string;
  introduction: string;
  research_objectives: string[];
  methodology: string;
  discussion: string;
  findings: string[];
  conclusion: string;
  references: ReferenceItem[];
  metadata?: {
    topic: string;
    researchQuestion: string;
    academicLevel: AcademicLevel;
    generatedAt: string;
    model: string;
  };
}

export interface PresetTopic {
  title: string;
  topic: string;
  question: string;
  level: AcademicLevel;
  badge: string;
}
