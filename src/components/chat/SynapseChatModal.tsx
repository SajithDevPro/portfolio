import React, { useState, useEffect, useRef } from 'react';
import { WindowChrome } from '../common/WindowChrome';

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: string;
  modelUsed?: string;
}

export type ChatRoleType = 'genesis_ai' | 'robotics_engineer' | 'ml_architect';
export type ChatSpeedMode = 'fast' | 'general' | 'complex';

interface SynapseChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialPrompt?: string;
}

const ROLES: { id: ChatRoleType; name: string; tag: string; icon: string; description: string }[] = [
  {
    id: 'genesis_ai',
    name: 'Genesis Co-Pilot',
    tag: 'SYS_CORE',
    icon: 'neurology',
    description: 'Autonomous cybernetic assistant knowledgeable on Elara Vance’s research & projects.',
  },
  {
    id: 'robotics_engineer',
    name: 'Kinematics Specialist',
    tag: 'ROS2_1KHZ',
    icon: 'precision_manufacturing',
    description: 'Hardware actuation, inverse kinematics, rigid body control, and CAN/RT timing.',
  },
  {
    id: 'ml_architect',
    name: 'Edge ML Architect',
    tag: 'TENSOR_INT8',
    icon: 'memory',
    description: 'Vision Transformers, TensorRT graph optimization, CUDA kernels, and Jetson Orin.',
  },
];

const MODES: { id: ChatSpeedMode; label: string; modelName: string; badge: string; desc: string }[] = [
  {
    id: 'fast',
    label: 'Fast Reflex',
    modelName: 'gemini-3.1-flash-lite',
    badge: '⚡ Lite',
    desc: 'Instant responses with minimal latency',
  },
  {
    id: 'general',
    label: 'General Analysis',
    modelName: 'gemini-3.5-flash',
    badge: '🌐 Standard',
    desc: 'High fidelity for engineering architecture',
  },
  {
    id: 'complex',
    label: 'Complex Reasoning',
    modelName: 'gemini-3.1-pro-preview',
    badge: '🔬 Pro Preview',
    desc: 'Deep mathematical & structural synthesis',
  },
];

const SUGGESTIONS = [
  'Explain the 1000 Hz RT-Preempt quadruped control loop.',
  'How did you achieve INT8 ViT inference under 14.2W on Jetson Orin?',
  'What is the consensus mechanism in the Synapse K8s swarm mesh?',
  'Calculate motor torque constraints for 12-DOF rough terrain navigation.',
];

export const SynapseChatModal: React.FC<SynapseChatModalProps> = ({
  isOpen,
  onClose,
  initialPrompt,
}) => {
  const [roleType, setRoleType] = useState<ChatRoleType>('genesis_ai');
  const [speedMode, setSpeedMode] = useState<ChatSpeedMode>('general');
  const [inputVal, setInputVal] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'init-msg',
      role: 'model',
      text: 'Neural telemetry link established. I am Genesis AI, the embodied intelligence co-pilot for Elara Vance’s robotics architectures. How can I assist your engineering query today?',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      modelUsed: 'gemini-3.5-flash',
    },
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        inputRef.current?.focus();
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 150);
    }
  }, [isOpen]);

  useEffect(() => {
    if (initialPrompt && isOpen) {
      handleSendMessage(initialPrompt);
    }
  }, [initialPrompt, isOpen]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isSending]);

  const handleSendMessage = async (textToSend?: string) => {
    const query = (textToSend || inputVal).trim();
    if (!query || isSending) return;

    setErrorMsg(null);
    setInputVal('');

    const userMessage: ChatMessage = {
      id: `usr-${Date.now()}`,
      role: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    const nextHistory = [...messages, userMessage];
    setMessages(nextHistory);
    setIsSending(true);

    try {
      // Map history to server format
      const payloadMessages = nextHistory.map((m) => ({
        role: m.role,
        text: m.text,
      }));

      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: payloadMessages,
          roleType,
          mode: speedMode,
        }),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || `Server responded with status ${res.status}`);
      }

      const data = await res.json();
      const modelMessage: ChatMessage = {
        id: `model-${Date.now()}`,
        role: 'model',
        text: data.text,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        modelUsed: data.modelUsed,
      };

      setMessages((prev) => [...prev, modelMessage]);
    } catch (err: any) {
      console.error('Chat error:', err);
      setErrorMsg(err.message || 'Transmission disrupted. Check your connection or API key configuration.');
    } finally {
      setIsSending(false);
    }
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard?.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleClearHistory = () => {
    setMessages([
      {
        id: `reset-${Date.now()}`,
        role: 'model',
        text: 'Session telemetry cleared. New neural link primed. State your engineering query.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        modelUsed: MODES.find((m) => m.id === speedMode)?.modelName,
      },
    ]);
    setErrorMsg(null);
  };

  if (!isOpen) return null;

  const currentRole = ROLES.find((r) => r.id === roleType) || ROLES[0];
  const currentMode = MODES.find((m) => m.id === speedMode) || MODES[1];

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 bg-[#0A0E12]/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 select-none animate-fadeIn"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-4xl h-[90vh] max-h-[820px] rounded-2xl bg-[#12161C] border border-[#00D4FF]/30 shadow-[0_24px_80px_rgba(0,0,0,0.85)] flex flex-col overflow-hidden"
      >
        {/* Window Chrome Header */}
        <WindowChrome
          title={`synapse_uplink.sh [${currentRole.tag}] // ${currentMode.modelName}`}
          icon="neurology"
          tag="GEMINI_UPLINK"
          actionText="CLOSE [ESC]"
          onAction={onClose}
        />

        {/* Sub-Header: Role & Model Controls */}
        <div className="px-4 py-3 bg-[#0E1217] border-b border-[#00D4FF]/15 flex flex-col md:flex-row md:items-center justify-between gap-3 shrink-0">
          {/* Role Selector Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
            <span className="font-code text-[10px] text-[#5B6B75] uppercase tracking-wider mr-1 hidden sm:inline">
              ROLE:
            </span>
            {ROLES.map((role) => {
              const active = roleType === role.id;
              return (
                <button
                  key={role.id}
                  onClick={() => setRoleType(role.id)}
                  title={role.description}
                  className={`px-2.5 py-1 rounded-lg font-code text-xs tracking-wide flex items-center gap-1.5 transition-all cursor-pointer whitespace-nowrap ${
                    active
                      ? 'bg-[#00D4FF]/15 border border-[#00D4FF] text-[#00D4FF] shadow-[0_0_10px_rgba(0,212,255,0.3)]'
                      : 'bg-[#182028]/60 border border-[#182028] text-[#5B6B75] hover:text-[#EAF2F5]'
                  }`}
                >
                  <span className="material-symbols-outlined text-[13px]">{role.icon}</span>
                  <span>{role.name}</span>
                </button>
              );
            })}
          </div>

          {/* Model / Speed Selector */}
          <div className="flex items-center gap-1.5 shrink-0 self-end md:self-auto">
            <span className="font-code text-[10px] text-[#5B6B75] uppercase tracking-wider mr-1 hidden sm:inline">
              ENGINE:
            </span>
            {MODES.map((mode) => {
              const active = speedMode === mode.id;
              return (
                <button
                  key={mode.id}
                  onClick={() => setSpeedMode(mode.id)}
                  title={`${mode.modelName} — ${mode.desc}`}
                  className={`px-2 py-0.5 rounded font-code text-[11px] transition-all cursor-pointer ${
                    active
                      ? mode.id === 'complex'
                        ? 'bg-[#FF9F45]/20 border border-[#FF9F45] text-[#FF9F45] shadow-[0_0_10px_rgba(255,159,69,0.3)] font-semibold'
                        : 'bg-[#7B61FF]/20 border border-[#7B61FF] text-[#7B61FF] shadow-[0_0_10px_rgba(123,97,255,0.3)] font-semibold'
                      : 'bg-[#182028] text-[#5B6B75] border border-transparent hover:text-[#EAF2F5]'
                  }`}
                >
                  {mode.badge}
                </button>
              );
            })}

            {/* Clear History Button */}
            <button
              onClick={handleClearHistory}
              title="Clear conversation history"
              className="p-1 rounded text-[#5B6B75] hover:text-[#FF5F57] hover:bg-[#182028] transition-colors ml-1 cursor-pointer"
            >
              <span className="material-symbols-outlined text-[16px]">delete_sweep</span>
            </button>
          </div>
        </div>

        {/* Scrollable Message Thread */}
        <div className="flex-1 p-4 sm:p-6 overflow-y-auto bg-[#0B0F13] flex flex-col gap-4">
          {messages.map((msg) => {
            const isUser = msg.role === 'user';
            return (
              <div
                key={msg.id}
                className={`flex flex-col gap-1 max-w-[85%] sm:max-w-[78%] ${
                  isUser ? 'self-end items-end' : 'self-start items-start'
                }`}
              >
                {/* Meta Header */}
                <div className="flex items-center gap-2 px-1 text-[10px] font-code text-[#5B6B75]">
                  <span>{isUser ? 'OPERATOR' : currentRole.name.toUpperCase()}</span>
                  <span>•</span>
                  <span>{msg.timestamp}</span>
                  {msg.modelUsed && (
                    <>
                      <span>•</span>
                      <span className="text-[#00D4FF]">{msg.modelUsed}</span>
                    </>
                  )}
                </div>

                {/* Message Bubble */}
                <div
                  className={`p-3.5 sm:p-4 rounded-xl text-xs sm:text-sm leading-relaxed transition-all relative group ${
                    isUser
                      ? 'bg-[#182028] text-[#EAF2F5] border border-[#00D4FF]/30 shadow-sm'
                      : 'bg-[#12161C] text-[#EAF2F5]/90 border border-[#7B61FF]/25 shadow-[0_4px_20px_rgba(0,0,0,0.4)]'
                  }`}
                >
                  <p className="whitespace-pre-wrap font-body selection:bg-[#00D4FF]/30 select-text">
                    {msg.text}
                  </p>

                  {/* Copy Button */}
                  <button
                    onClick={() => handleCopy(msg.id, msg.text)}
                    className="absolute top-2 right-2 p-1 rounded bg-[#0A0E12]/80 border border-[#182028] text-[#5B6B75] hover:text-[#00D4FF] opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                    title="Copy message"
                  >
                    <span className="material-symbols-outlined text-[13px]">
                      {copiedId === msg.id ? 'check' : 'content_copy'}
                    </span>
                  </button>
                </div>
              </div>
            );
          })}

          {/* Loading Animation Bubble */}
          {isSending && (
            <div className="self-start flex flex-col gap-1 max-w-[70%]">
              <div className="flex items-center gap-2 px-1 text-[10px] font-code text-[#5B6B75]">
                <span>{currentRole.name.toUpperCase()}</span>
                <span>•</span>
                <span className="text-[#00D4FF] animate-pulse">PROCESSING INFERENCE...</span>
              </div>
              <div className="p-3.5 rounded-xl bg-[#12161C] border border-[#7B61FF]/30 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#00D4FF] animate-ping-subtle" />
                <span className="w-2 h-2 rounded-full bg-[#7B61FF] animate-pulse" />
                <span className="w-2 h-2 rounded-full bg-[#FF9F45] animate-bounce" />
                <span className="font-code text-xs text-[#5B6B75] ml-2">
                  Querying {currentMode.modelName}...
                </span>
              </div>
            </div>
          )}

          {/* Error Banner */}
          {errorMsg && (
            <div className="p-3 rounded-lg bg-[#690005]/20 border border-[#FF5F57]/40 text-[#FFB4AB] text-xs font-code flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-base text-[#FF5F57]">error</span>
                <span>{errorMsg}</span>
              </div>
              <button
                onClick={() => handleSendMessage()}
                className="px-2 py-1 rounded bg-[#FF5F57]/20 hover:bg-[#FF5F57]/30 text-[#FF5F57] text-[10px] font-semibold cursor-pointer shrink-0"
              >
                RETRY
              </button>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Suggestion Chips */}
        <div className="px-4 py-2 bg-[#0E1217] border-t border-[#182028] overflow-x-auto flex items-center gap-2">
          <span className="font-code text-[10px] text-[#5B6B75] uppercase tracking-wider shrink-0">
            PROMPTS:
          </span>
          {SUGGESTIONS.map((item, idx) => (
            <button
              key={idx}
              onClick={() => handleSendMessage(item)}
              className="px-2.5 py-1 rounded-full bg-[#12161C] hover:bg-[#182028] border border-[#00D4FF]/20 hover:border-[#00D4FF] text-[#EAF2F5]/75 hover:text-[#00D4FF] font-code text-[11px] whitespace-nowrap transition-colors cursor-pointer shrink-0"
            >
              {item}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <div className="p-3 sm:p-4 bg-[#12161C] border-t border-[#00D4FF]/20 flex items-center gap-2 sm:gap-3">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex-1 flex items-center gap-2 bg-[#0B0F13] border border-[#182028] focus-within:border-[#00D4FF] rounded-xl px-3 py-1.5 transition-colors"
          >
            <span className="material-symbols-outlined text-sm text-[#00D4FF]">terminal</span>
            <input
              ref={inputRef}
              type="text"
              placeholder={`Ask ${currentRole.name} [e.g., kinematics, Isaac Gym, TensorRT]...`}
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              disabled={isSending}
              className="flex-1 bg-transparent text-xs sm:text-sm text-[#EAF2F5] placeholder-[#5B6B75] font-code focus:outline-none"
            />
            <button
              type="submit"
              disabled={!inputVal.trim() || isSending}
              className={`p-1.5 rounded-lg transition-all cursor-pointer ${
                inputVal.trim() && !isSending
                  ? 'bg-[#00D4FF] text-[#0A0E12] shadow-[0_0_12px_rgba(0,212,255,0.6)] font-bold'
                  : 'text-[#5B6B75] hover:text-[#EAF2F5] disabled:opacity-40'
              }`}
            >
              <span className="material-symbols-outlined text-[18px]">send</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
