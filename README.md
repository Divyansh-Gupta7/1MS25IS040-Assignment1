# Research Paper Agent

An AI-powered research paper generation application built using **Google AI Studio and Gemini**.

This project was developed as part of Assignment 1 to demonstrate vibe coding and the development of an AI-powered application using natural language prompts.

## Project Overview

The Research Paper Agent helps students generate structured academic research paper drafts based on a given research topic, research question, and academic level.

It uses Google's Gemini AI model to generate organized academic content.

## Features

- **Research Topic Input:** Enter any research topic.
- **Research Question:** Define the objective of the research.
- **Academic Level Selection:** Choose School, Undergraduate, or Postgraduate.
- **AI-Powered Generation:** Generate structured research paper drafts using Gemini.
- **Structured Output:** Organizes content into academic sections.
- **Research Approach:** Provides a high-level explanation of the research approach.
- **Export Options:** Download generated research papers in JSON and TXT formats.
- **Error Handling:** Displays appropriate messages during generation failures.

## Research Paper Structure

The generated research paper includes:

1. Title
2. Abstract
3. Keywords
4. Introduction
5. Research Objectives
6. Methodology
7. Main Discussion
8. Findings
9. Conclusion
10. References

## Technologies Used

- Google AI Studio
- Google Gemini API
- React
- TypeScript
- Node.js
- Vite

## Project Structure

```text
Research-Paper-Agent/
│
├── src/                  # Frontend source code
├── index.html            # HTML entry point
├── server.ts             # Backend server
├── package.json          # Dependencies and scripts
├── bun.lock              # Dependency lock file
├── metadata.json         # Project metadata
├── tsconfig.json         # TypeScript configuration
├── vite.config.ts        # Vite configuration
└── README.md             # Project documentation
```

## Sample Generated Output

The repository contains sample research paper outputs on:

**Impact of Artificial Intelligence on Education**

- `impact_of_artificial_intelligence_on_edu_Structured_Data.json`
- `impact_of_artificial_intelligence_on_edu_Draft.txt`

## Run Locally

### Prerequisites

- Node.js
- Gemini API key

### Installation

1. Clone the repository:

```bash
git clone https://github.com/Divyansh-Gupta7/1MS25IS040-Assignment1.git
```

2. Navigate into the project folder:

```bash
cd 1MS25IS040-Assignment1
```

3. Install dependencies:

```bash
npm install
```

4. Create a `.env.local` file in the project root and add your Gemini API key:

```env
GEMINI_API_KEY=your_api_key_here
```

5. Start the development server:

```bash
npm run dev
```

6. Open the local URL displayed in your terminal.

## Google AI Studio

View the application in Google AI Studio:

[Research Paper Agent](https://ai.studio/apps/d3adc4c5-8781-4572-88dd-f7cfbe8a193a)

## Important Note

This application generates AI-assisted academic drafts. Users should independently verify factual claims and references using reliable academic sources before using the generated content.

Never commit API keys, `.env.local` files, or other confidential credentials to a public repository.

## Author

**Divyansh Gupta**

Developed as part of Assignment 1.

## GitHub Repository

[1MS25IS040-Assignment1](https://github.com/Divyansh-Gupta7/1MS25IS040-Assignment1)
