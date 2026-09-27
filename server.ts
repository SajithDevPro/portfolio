import express, { Request, Response } from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';
import { PROJECTS, SKILL_MODULES, INTERESTS } from './src/data/portfolioData';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

app.use(express.json({ limit: '10mb' }));

// Initialize GoogleGenAI server-side with telemetry header
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}

// Free-tier valid models with primary and automatic fallback
const PRIMARY_MODEL = 'gemini-3.8-flash';
const FALLBACK_MODELS = ['gemini-3.1-flash-lite', 'gemini-flash-latest'];

// Dynamically generate the system prompt from the single source of truth (portfolioData.ts)
function generateSystemPrompt(): string {
  const projectSummaries = PROJECTS.map((proj, idx) => `
Project #${idx + 1}: ${proj.title} [Category: ${proj.categoryLabel}]
- Tagline: ${proj.tagline}
- Core Outcome: ${proj.outcome}
- Engineering Problem: ${proj.problem}
- Technical Approach: ${proj.approach}
- Elara's Role: ${proj.role}
- Quantitative Result: ${proj.result}
- Tech Stack: ${proj.stack.join(', ')}
- Engineering Specs: ${proj.specs.map((s) => `${s.label}: ${s.value}`).join(' | ')}
- Repository: ${proj.githubUrl || 'Available on request'}
`).join('\n');

  const skillsSummaries = SKILL_MODULES.map((skill) => `
Skill Domain: ${skill.title} (${skill.subtitle})
- Description: ${skill.description}
- Technologies & Tools: ${skill.technologies.join(', ')}
- Signal Benchmark: ${skill.signalPower}
- Core Highlights:
${skill.highlights.map((h) => `  * ${h}`).join('\n')}
`).join('\n');

  const interestsSummaries = INTERESTS.map((item) => `
- ${item.title} [Tag: ${item.tag}]: ${item.phrase} — ${item.description}
`).join('\n');

  return `You are the AI Assistant for Elara Vance's engineering portfolio.
Your role is to assist recruiters, engineering hiring managers, technical peers, and visitors by answering questions about Elara's background, engineering projects, technical skills, and contact information.

# CANDIDATE PROFILE & CONTACT
- Name: Elara Vance
- Current Role: Software Systems Engineer (Autonomous Robotics, Real-Time Control & Edge ML)
- Education: B.S. in Software Engineering, Robotics Focus
- Location: Seattle, WA (Open to Relocation, Hybrid, and Remote roles)
- Status: Actively accepting full-time robotics, embodied AI, and systems engineering roles (2025/2026)
- Direct Email: elara.vance.robotics@genesis.engineering
- Work Authorization: US Citizen / Fully Authorized
- Key Strengths: 1000 Hz RT-Preempt Linux control loops, ROS2 Humble/Iron, C++20, Isaac Gym reinforcement learning locomotion policies, TensorRT INT8 optimization on Jetson AGX Orin, distributed edge Kubernetes (K3s/eBPF mesh), and bilateral haptic teleoperation.

# FEATURED PROJECTS (SOURCE OF TRUTH)
${projectSummaries}

# SKILL MODULES & TECHNICAL COMPETENCIES
${skillsSummaries}

# RESEARCH & TECHNICAL INTERESTS
${interestsSummaries}

# STRICT TOPIC BOUNDARY & GUARDRAILS (MANDATORY)
1. ONLY ANSWER ABOUT ELARA VANCE: You are strictly scoped to Elara Vance, her engineering projects, technical skills, career background, robotics research, distributed systems, and contact details.
2. UNRELATED / OFF-TOPIC QUERIES: If a visitor asks about anything unrelated to Elara Vance or her work (such as general coding questions, unrelated math puzzles, creative writing, world trivia, news, or general life advice), you MUST politely decline and steer the conversation back to Elara's portfolio.
   Example refusal: "I am specifically configured to answer questions about Elara Vance's engineering portfolio, projects, skills, and background. Feel free to ask about her work on the 12-DOF quadruped, edge Vision Transformers, swarm telemetry mesh, or how to get in touch!"
3. ACCURACY & NO HALLUCINATION: Never invent unlisted projects, fake credentials, or hypothetical clients. Ground all technical details in the real portfolio records above. If asked about something not mentioned, clearly state that it is not covered in her public portfolio and encourage reaching out directly via elara.vance.robotics@genesis.engineering.
4. CONCISE & PROFESSIONAL TONE: Provide warm, direct, crisp answers. Avoid lengthy preambles or robotic corporate jargon. Keep responses concise (1 to 3 short paragraphs or clean bullet points) so recruiters get fast answers.`;
}

// Health check endpoint
app.get('/api/health', (_req: Request, res: Response) => {
  res.json({
    status: 'online',
    version: '4.2.0',
    geminiKeyConfigured: Boolean(process.env.GEMINI_API_KEY)
  });
});

// Chat API endpoint
app.post('/api/chat', async (req: Request, res: Response) => {
  try {
    const { messages } = req.body as {
      messages: ChatMessage[];
    };

    if (!Array.isArray(messages) || messages.length === 0) {
      res.status(400).json({ error: 'Messages array is required and must not be empty.' });
      return;
    }

    if (!process.env.GEMINI_API_KEY) {
      res.status(500).json({
        error: 'GEMINI_API_KEY is not configured on the server. Please verify your environment secrets.'
      });
      return;
    }

    // Convert client messages to Gemini contents format
    const contents = messages.map((m) => ({
      role: m.role === 'model' ? 'model' : 'user',
      parts: [{ text: m.text }],
    }));

    const systemInstruction = generateSystemPrompt();
    let replyText = '';
    const modelsToTry = [PRIMARY_MODEL, ...FALLBACK_MODELS];
    let lastError: any = null;

    for (const modelToUse of modelsToTry) {
      try {
        const response = await ai.models.generateContent({
          model: modelToUse,
          contents,
          config: {
            systemInstruction,
            temperature: 0.2, // Low temperature for factual, consistent, non-rambling answers
          },
        });
        replyText = response.text || '';
        if (replyText) {
          break;
        }
      } catch (err: any) {
        lastError = err;
        console.warn(`[Gemini] ${modelToUse} failed: ${err.message || err}. Attempting fallback...`);
      }
    }

    if (!replyText && lastError) {
      throw lastError;
    }

    res.json({
      text: replyText || 'I apologize, but I could not formulate a response. Please try again.',
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error('Gemini chat error:', error);
    const errorMessage = error?.message || 'An unexpected error occurred during inference.';
    res.status(500).json({
      error: errorMessage,
      details: error?.status || 500,
    });
  }
});

async function startServer() {
  if (process.env.NODE_ENV === 'production') {
    // Serve static files in production
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  } else {
    // Use Vite middleware in development
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[Genesis Core] Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
