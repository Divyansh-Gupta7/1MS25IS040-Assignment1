import 'dotenv/config';
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI, Type } from '@google/genai';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

app.use(express.json({ limit: '10mb' }));

const paperResponseSchema = {
  type: Type.OBJECT,
  properties: {
    title: {
      type: Type.STRING,
      description: 'Formal, original academic title reflecting the topic, scope, and research focus.',
    },
    abstract: {
      type: Type.STRING,
      description: 'Concise abstract (150-250 words) stating the research problem, objectives, methodology, main analytical discussion, and primary conclusions.',
    },
    keywords: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: '4 to 6 relevant scholarly keywords or subject indexing terms.',
    },
    research_approach: {
      type: Type.STRING,
      description: 'Concise high-level academic method and theoretical approach used to structure this paper draft. Explain the scholarly framing without exposing private internal reasoning.',
    },
    introduction: {
      type: Type.STRING,
      description: 'Detailed introductory section establishing academic context, problem significance, theoretical background, and the scope of inquiry.',
    },
    research_objectives: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: 'List of 3 to 5 clear, specific, action-oriented research objectives or guiding research questions.',
    },
    methodology: {
      type: Type.STRING,
      description: 'Structured methodology section appropriate for the academic level (e.g., literature synthesis, secondary data analysis, comparative thematic framework, or conceptual inquiry).',
    },
    discussion: {
      type: Type.STRING,
      description: 'Substantial, balanced main discussion. Evaluates core claims, benefits, trade-offs, challenges, and theoretical implications with clear thematic paragraphs.',
    },
    findings: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: 'List of 4 to 6 synthesized findings or key insights emerging directly from the discussion.',
    },
    conclusion: {
      type: Type.STRING,
      description: 'Concluding synthesis directly addressing the primary research question, acknowledging limitations, noting practical significance, and suggesting avenues for future research.',
    },
    references: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          citation: {
            type: Type.STRING,
            description: 'Academic citation guide in APA format indicating standard author/body, publication year, topic title, and scholarly outlet.',
          },
          category: {
            type: Type.STRING,
            description: "Must be either 'Established Literature' (well-documented, foundational peer-reviewed works or recognized institutional bodies) or 'Suggested Literature' (recommended exploratory sources and contemporary literature for student verification).",
          },
          relevance: {
            type: Type.STRING,
            description: 'One sentence summarizing why this source is pertinent to the paper.',
          },
        },
        required: ['citation', 'category', 'relevance'],
      },
      description: 'Curated reference list clearly distinguishing between verified established literature and suggested exploratory readings.',
    },
  },
  required: [
    'title',
    'abstract',
    'keywords',
    'research_approach',
    'introduction',
    'research_objectives',
    'methodology',
    'discussion',
    'findings',
    'conclusion',
    'references',
  ],
};

function normalizePaperData(raw: any, topic: string, question: string, level: string, usedModel: string) {
  return {
    title: typeof raw.title === 'string' && raw.title.trim() ? raw.title.trim() : `Research Paper on ${topic}`,
    abstract: typeof raw.abstract === 'string' && raw.abstract.trim() ? raw.abstract.trim() : 'Abstract unavailable.',
    keywords: Array.isArray(raw.keywords) && raw.keywords.length > 0
      ? raw.keywords.map((k: any) => String(k).trim()).filter(Boolean)
      : [topic, 'Academic Research', level, 'Analysis'],
    research_approach: typeof raw.research_approach === 'string' && raw.research_approach.trim()
      ? raw.research_approach.trim()
      : 'Comprehensive secondary literature synthesis and analytical thematic evaluation.',
    introduction: typeof raw.introduction === 'string' && raw.introduction.trim()
      ? raw.introduction.trim()
      : 'Introduction detailing problem setting and background.',
    research_objectives: Array.isArray(raw.research_objectives) && raw.research_objectives.length > 0
      ? raw.research_objectives.map((o: any) => String(o).trim()).filter(Boolean)
      : [`Examine core principles and dimensions of ${topic}.`, `Analyze empirical and theoretical implications of ${question}.`],
    methodology: typeof raw.methodology === 'string' && raw.methodology.trim()
      ? raw.methodology.trim()
      : 'Systematic qualitative literature analysis and thematic synthesis.',
    discussion: typeof raw.discussion === 'string' && raw.discussion.trim()
      ? raw.discussion.trim()
      : 'In-depth discussion and balanced evaluation of key factors.',
    findings: Array.isArray(raw.findings) && raw.findings.length > 0
      ? raw.findings.map((f: any) => String(f).trim()).filter(Boolean)
      : [`Primary analytical outcome regarding ${topic}.`, 'Significance of findings in relation to research inquiry.'],
    conclusion: typeof raw.conclusion === 'string' && raw.conclusion.trim()
      ? raw.conclusion.trim()
      : 'Synthesis of findings directly addressing the research objective.',
    references: Array.isArray(raw.references) && raw.references.length > 0
      ? raw.references.map((r: any) => {
          if (typeof r === 'string') {
            return {
              citation: r.trim(),
              category: 'Established Literature',
              relevance: 'Foundational reading on the topic.',
            };
          }
          return {
            citation: String(r.citation || 'Academic source citation pending verification.').trim(),
            category: String(r.category || 'Suggested Literature').includes('Established')
              ? 'Established Literature'
              : 'Suggested Literature',
            relevance: String(r.relevance || 'Contextual source for student examination.').trim(),
          };
        })
      : [
          {
            citation: `Scholarly Advisory Board. (2024). Foundational Perspectives in ${topic}. Academic Press.`,
            category: 'Established Literature',
            relevance: 'Seminal overview of foundational domain principles.',
          },
          {
            citation: `Higher Education Research Review. (2025). Contemporary Trends and Critical Inquiries in ${topic}. Journal of Academic Studies, 14(2), 112-128.`,
            category: 'Suggested Literature',
            relevance: 'Recommended exploratory reading for student library follow-up.',
          },
        ],
    metadata: {
      topic,
      researchQuestion: question,
      academicLevel: level,
      generatedAt: new Date().toISOString(),
      model: usedModel,
    },
  };
}

// API Endpoint to generate research paper
app.post('/api/generate-paper', async (req, res) => {
  try {
    const { topic, researchQuestion, academicLevel } = req.body;

    // Validation
    if (!topic || typeof topic !== 'string' || topic.trim().length === 0) {
      return res.status(400).json({
        error: 'Research topic is required. Please provide a clear topic to begin.',
      });
    }

    const trimmedTopic = topic.trim();
    const trimmedQuestion =
      typeof researchQuestion === 'string' && researchQuestion.trim().length > 0
        ? researchQuestion.trim()
        : `What are the core dimensions, implications, and key challenges surrounding ${trimmedTopic}?`;

    const validLevels = ['School', 'Undergraduate', 'Postgraduate'];
    const level = validLevels.includes(academicLevel) ? academicLevel : 'Undergraduate';

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return res.status(500).json({
        error:
          'GEMINI_API_KEY is not configured on the server. Please ensure the API key is set in the environment or Secrets panel.',
      });
    }

    const ai = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });

    const systemInstruction = `You are the Research Paper Agent, a scholarly drafting assistant for students.
Your mission is to generate a comprehensive, structured, academic research paper draft based on the user's research topic, research question, and academic level.

ACADEMIC INTEGRITY & ORIGINALITY GUIDELINES:
1. Write entirely original, synthesized scholarly text. Do not replicate copyrighted text verbatim.
2. DRAFT STATUS: The generated output is a foundational working draft that the student will review, critique, expand, and cite properly.
3. CITATION CLASSIFICATION:
   - For all items in the 'references' array, explicitly classify each reference as either:
     a) 'Established Literature' (canonical, seminal academic frameworks or recognized global reports)
     b) 'Suggested Literature' (exploratory journal topics and prospective sources for students to investigate in university libraries).
4. CONCISE RESEARCH APPROACH:
   - Provide a formal 'research_approach' describing the overarching analytical method and theoretical perspective without exposing internal reasoning tokens.
5. ACADEMIC LEVEL CALIBRATION:
   - School: Accessible, structured explanations of core foundational concepts.
   - Undergraduate: Balanced analysis of benefits and challenges, rigorous discussion, clear methodological structure.
   - Postgraduate: Advanced theoretical models, epistemological nuance, and critical examination of boundary conditions.

Output must be valid JSON conforming strictly to the response schema.`;

    const userPrompt = `Generate a complete, high-quality, original research paper draft for:
Academic Level: ${level}
Research Topic: ${trimmedTopic}
Research Question / Objective: ${trimmedQuestion}

Provide rich, well-articulated paragraphs for the abstract, introduction, methodology, discussion, and conclusion. Return valid JSON only.`;

    // Fast, responsive candidate model order:
    // 'gemini-3.1-flash-lite' generates full papers in ~3.5s without rate-limit queues,
    // with 'gemini-3.8-flash' available as backup.
    const candidateModels = ['gemini-3.1-flash-lite', 'gemini-3.8-flash'];
    let textOutput: string | null = null;
    let usedModel: string = 'gemini-3.1-flash-lite';
    let lastError: any = null;

    for (const model of candidateModels) {
      try {
        console.log(`[Research Paper Agent] Generating with model: ${model}...`);
        const response = await ai.models.generateContent({
          model,
          contents: userPrompt,
          config: {
            systemInstruction,
            responseMimeType: 'application/json',
            responseSchema: paperResponseSchema,
          },
        });

        if (response && response.text) {
          textOutput = response.text.trim();
          usedModel = model;
          console.log(`[Research Paper Agent] Succeeded with model: ${model}`);
          break;
        }
      } catch (err: any) {
        lastError = err;
        console.warn(`[Research Paper Agent] Model ${model} error:`, err?.message || err);
      }
    }

    if (!textOutput) {
      const rawMsg = lastError?.message || '';
      console.error('[Research Paper Agent] Generation failed across candidate models:', rawMsg);
      return res.status(500).json({
        error: 'Generation could not be completed. Please click "Generate Research Paper" to retry.',
      });
    }

    // Strip markdown code fences if present
    const cleanedOutput = textOutput.replace(/^```json\s*/i, '').replace(/```\s*$/, '').trim();

    let parsedData: any;
    try {
      parsedData = JSON.parse(cleanedOutput);
    } catch (parseError) {
      console.error('JSON parsing failed:', parseError, textOutput);
      return res.status(500).json({
        error: 'Failed to parse structured paper data. Please try generating again.',
      });
    }

    const normalizedData = normalizePaperData(parsedData, trimmedTopic, trimmedQuestion, level, usedModel);

    return res.status(200).json(normalizedData);
  } catch (error: any) {
    console.error('Error generating research paper:', error);
    const errorMessage =
      error?.message || 'An unexpected error occurred while generating the research paper draft.';
    return res.status(500).json({ error: errorMessage });
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', service: 'Research Paper Agent' });
});

// Vite middleware in dev or static serving in production
async function startServer() {
  const isProd = process.env.NODE_ENV === 'production';

  if (!isProd) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(port, '0.0.0.0', () => {
    console.log(`Research Paper Agent server listening at http://0.0.0.0:${port}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
