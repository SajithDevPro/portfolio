import React, { useState, useEffect, useRef } from 'react';
import { WindowChrome } from '../common/WindowChrome';

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: string;
}

interface SynapseChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialPrompt?: string;
}

// Plain-language welcome message
const INITIAL_MESSAGE: ChatMessage = {
  id: 'genesis-welcome',
  role: 'model',
  text: "Hi! I'm an AI trained on Elara Vance's background, robotics engineering, and software projects. Ask me anything about their work, skills, or how to get in touch!",
  timestamp: 'Just now',
};

// Approachable, recruiter- and visitor-friendly suggestion chips
const SUGGESTIONS = [
  'What projects have you worked on?',
  'What are your strongest skills?',
  'Tell me about your robotics experience.',
  'How can I get in touch with you?',
  'What technologies are used in Genesis?',
];

export const SynapseChatModal: React.FC<SynapseChatModalProps> = ({
  isOpen,
  onClose,
  initialPrompt,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([INITIAL_MESSAGE]);
  const [inputVal, setInputVal] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll on new message
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isSending, isOpen]);

  // Handle ESC key to dismiss modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Handle initial prompt if opened with one
  useEffect(() => {
    if (isOpen && initialPrompt) {
      handleSendMessage(initialPrompt);
    }
  }, [isOpen, initialPrompt]);

  // Focus input when modal opens
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 150);
    }
  }, [isOpen]);

  const handleSendMessage = async (textToSend?: string) => {
    const messageContent = (textToSend || inputVal).trim();
    if (!messageContent || isSending) return;

    setErrorMsg(null);

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      text: messageContent,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    const newThread = [...messages, userMsg];
    setMessages(newThread);
    if (!textToSend) setInputVal('');
    setIsSending(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: newThread.map((m) => ({
            role: m.role,
            text: m.text,
          })),
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Server returned status ${response.status}`);
      }

      const data = await response.json();

      const aiMsg: ChatMessage = {
        id: `ai-${Date.now()}`,
        role: 'model',
        text: data.reply || "I'm sorry, I couldn't process that query. Please try again.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, aiMsg]);
    } catch (err: any) {
      setErrorMsg(err.message || 'Connection failure. Please check your connection and retry.');
    } finally {
      setIsSending(false);
    }
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleClearChat = () => {
    setMessages([INITIAL_MESSAGE]);
    setErrorMsg(null);
  };

  if (!isOpen) return null;

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 select-none animate-fadeIn"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-3xl h-[88vh] max-h-[760px] rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-strong)] shadow-[0_24px_80px_rgba(0,0,0,0.5)] flex flex-col overflow-hidden"
      >
        {/* Window Chrome Header */}
        <WindowChrome
          title="Chat with my AI Assistant"
          icon="neurology"
          tag="GENESIS_AI"
          actionText="CLOSE [ESC]"
          onAction={onClose}
        />

        {/* Clean Sub-Header with Assistant Status and Clear History */}
        <div className="px-4 py-2.5 bg-[var(--bg-surface-elevated)] border-b border-[var(--border-subtle)] flex items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[var(--accent-cyan)] animate-pulse" />
            <span className="font-body text-xs text-[var(--text-primary)] font-semibold tracking-wide">
              AI Portfolio Assistant
            </span>
            <span className="font-body text-[11px] text-[var(--text-muted)] hidden sm:inline">
              • Trained on Elara Vance's background &amp; projects
            </span>
          </div>

          <button
            onClick={handleClearChat}
            className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[var(--bg-surface)] hover:bg-[var(--bg-surface-elevated)] border border-[var(--border-subtle)] hover:border-[var(--accent-cyan)]/40 text-[var(--text-secondary)] hover:text-[var(--text-primary)] text-xs font-body transition-colors cursor-pointer"
            title="Reset conversation to beginning"
          >
            <span className="material-symbols-outlined text-[14px]">refresh</span>
            <span>Clear Chat</span>
          </button>
        </div>

        {/* Messages Scroll Area */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 flex flex-col gap-4 font-body bg-[var(--bg-page)]/50">
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
                <div className="flex items-center gap-2 px-1 text-[10px] font-body text-[var(--text-muted)]">
                  <span>{isUser ? 'YOU' : "ELARA'S AI ASSISTANT"}</span>
                  <span>•</span>
                  <span>{msg.timestamp}</span>
                </div>

                {/* Message Bubble */}
                <div
                  className={`p-3.5 sm:p-4 rounded-2xl text-xs sm:text-sm leading-relaxed transition-all relative group ${
                    isUser
                      ? 'bg-[var(--accent-cyan)] text-[var(--bg-page)] font-medium shadow-sm'
                      : 'bg-[var(--bg-surface)] text-[var(--text-primary)] border border-[var(--border-subtle)] shadow-md'
                  }`}
                >
                  <p className="whitespace-pre-wrap font-body select-text">
                    {msg.text}
                  </p>

                  {/* Copy Button */}
                  <button
                    onClick={() => handleCopy(msg.id, msg.text)}
                    className="absolute top-2 right-2 p-1 rounded-lg bg-[var(--bg-surface-elevated)] border border-[var(--border-subtle)] text-[var(--text-muted)] hover:text-[var(--text-primary)] opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer shadow-sm"
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

          {/* Simple "Thinking..." Indicator */}
          {isSending && (
            <div className="self-start flex flex-col gap-1 max-w-[70%]">
              <div className="flex items-center gap-2 px-1 text-[10px] font-body text-[var(--text-muted)]">
                <span>ELARA'S AI ASSISTANT</span>
                <span>•</span>
                <span className="text-[var(--accent-cyan)]">Thinking...</span>
              </div>
              <div className="p-3.5 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] flex items-center gap-2 shadow-sm">
                <span className="w-2 h-2 rounded-full bg-[var(--accent-cyan)] animate-ping-subtle" />
                <span className="w-2 h-2 rounded-full bg-[var(--accent-violet)] animate-pulse" />
                <span className="w-2 h-2 rounded-full bg-[var(--accent-amber)] animate-bounce" />
                <span className="font-body text-xs text-[var(--text-muted)] ml-2">
                  Thinking...
                </span>
              </div>
            </div>
          )}

          {/* Error Banner */}
          {errorMsg && (
            <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-body flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-base text-red-400">error</span>
                <span>{errorMsg}</span>
              </div>
              <button
                onClick={() => handleSendMessage()}
                className="px-2 py-1 rounded bg-red-500/20 hover:bg-red-500/30 text-red-300 text-[10px] font-semibold cursor-pointer shrink-0"
              >
                RETRY
              </button>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Approachable Suggestion Chips for General Visitors */}
        <div className="px-4 py-2.5 bg-[var(--bg-surface-elevated)] border-t border-[var(--border-subtle)] overflow-x-auto flex items-center gap-2">
          <span className="font-body text-[10px] text-[var(--text-muted)] uppercase tracking-wider shrink-0 font-semibold">
            SUGGESTIONS:
          </span>
          {SUGGESTIONS.map((item, idx) => (
            <button
              key={idx}
              onClick={() => handleSendMessage(item)}
              className="px-3 py-1 rounded-full bg-[var(--bg-surface)] hover:bg-[var(--bg-surface-elevated)] border border-[var(--border-subtle)] hover:border-[var(--accent-cyan)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] font-body text-xs whitespace-nowrap transition-colors cursor-pointer shrink-0 shadow-sm"
            >
              {item}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <div className="p-3 sm:p-4 bg-[var(--bg-surface)] border-t border-[var(--border-subtle)] flex items-center gap-2 sm:gap-3">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex-1 flex items-center gap-2 bg-[var(--bg-page)] border border-[var(--border-subtle)] focus-within:border-[var(--accent-cyan)] rounded-xl px-3 py-2 transition-colors"
          >
            <span className="material-symbols-outlined text-base text-[var(--accent-cyan)]">chat</span>
            <input
              ref={inputRef}
              type="text"
              placeholder="Ask me anything about my work..."
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              disabled={isSending}
              className="flex-1 bg-transparent text-xs sm:text-sm text-[var(--text-primary)] placeholder-[var(--text-muted)] font-body focus:outline-none"
            />
            <button
              type="submit"
              disabled={!inputVal.trim() || isSending}
              className={`p-1.5 rounded-lg transition-all cursor-pointer ${
                inputVal.trim() && !isSending
                  ? 'bg-[var(--accent-cyan)] text-[var(--bg-page)] shadow-sm font-bold'
                  : 'text-[var(--text-muted)] hover:text-[var(--text-primary)] disabled:opacity-40'
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
