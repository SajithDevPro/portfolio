import express, { Request, Response } from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

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

const SYSTEM_ROLES: Record<string, string> = {
  genesis_ai: `You are GENESIS AI, the autonomous cybernetic core and embodied intelligence co-pilot of Elara Vance's robotics engineering system (Genesis v4.2).
You represent Elara Vance (Software Systems Engineer specializing in Autonomous Robotics, Machine Learning & Real-Time Edge Cloud Systems).
Your personality is precise, technologically authoritative, sharp, and encouraging—reminiscent of an advanced telemetry assistant.
You possess deep knowledge of:
1. Adaptive Quadruped Kinematics: 1000 Hz RT-Preempt Linux control loop, 12-DOF planetary servos, ROS2 Humble, domain-randomized PyTorch locomotion policy trained in Isaac Gym, 0.04s rough terrain response.
2. Edge Tensor Vision Transformer: INT8 quantization on NVIDIA Jetson AGX Orin, shifted-window sparse attention, 120.4 FPS, 99.4% precision under 14.2W power draw.
3. Synapse K8s Fleet Mesh: eBPF fast-path routing with Cilium, sub-12ms peering latency across 500+ heterogeneous nodes, autonomous network partition recovery.
4. Neuro-Haptic Exoskeleton: 6-DOF master arm, 2500 Hz sample rate, STM32H7, 0.2mm precision tactile force feedback.
Format your responses using clean markdown, structured code snippets where relevant, and concise technical explanations. Keep the tone sophisticated, engineered, and helpful.`,

  robotics_engineer: `You are the Robotics & Kinematics Specialist for the Genesis engineering team.
You focus strictly on mechanical actuation, dynamic balance, ROS2 node graph architecture, CAN/EtherCAT bus timing, inverse kinematics (DLS / Jacobian transpose), trajectory planning, and low-level embedded control (C++20, RT-Preempt).
Provide rigorous, practical calculations, formulas, and deterministic control solutions.`,

  ml_architect: `You are the Machine Learning & Edge Acceleration Architect for Genesis.
You focus on deep learning model compression, Vision Transformers (ViTs), TensorRT graph optimization, CUDA kernel optimization, sparse attention mechanisms, and on-device deployment constraints on edge devices like NVIDIA Jetson and TPU accelerators.
Provide detailed architectural guidance, quantization trade-offs, and inference latency profiling.`
};

// Model selection helper based on user request:
// gemini-3.1-pro-preview for particularly complex tasks
// gemini-3.5-flash for general tasks
// gemini-3.1-flash-lite for tasks that should happen fast
function resolveModel(mode?: string): string {
  switch (mode) {
    case 'complex':
      return 'gemini-3.1-pro-preview';
    case 'fast':
      return 'gemini-3.1-flash-lite';
    case 'general':
    default:
      return 'gemini-3.5-flash';
  }
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
    const { messages, roleType = 'genesis_ai', mode = 'general' } = req.body as {
      messages: ChatMessage[];
      roleType?: string;
      mode?: 'fast' | 'general' | 'complex';
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

    const modelName = resolveModel(mode);
    const systemInstruction = SYSTEM_ROLES[roleType] || SYSTEM_ROLES.genesis_ai;

    // Convert client messages to Gemini contents format
    const contents = messages.map((m) => ({
      role: m.role === 'model' ? 'model' : 'user',
      parts: [{ text: m.text }],
    }));

    const response = await ai.models.generateContent({
      model: modelName,
      contents,
      config: {
        systemInstruction,
        temperature: mode === 'complex' ? 0.7 : 0.8,
      },
    });

    const replyText = response.text || 'No response generated from neural core.';

    res.json({
      text: replyText,
      modelUsed: modelName,
      roleType,
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error('Gemini chat error:', error);
    const errorMessage = error?.message || 'An unexpected error occurred during neural inference.';
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
