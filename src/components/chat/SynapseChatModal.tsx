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

const SUGGESTIONS = [
  'What projects have you worked on?',
  'What are your strongest skills?',
  'Tell me about your robotics experience.',
  'How can I get in touch with you?',
];

const INITIAL_WELCOME: ChatMessage = {
  id: 'init-msg',
  role: 'model',
  text: "Hi! I'm an AI trained on Elara Vance's background and projects. Ask me anything about her skills, work, or how to get in touch.",
  timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
};

export const SynapseChatModal: React.FC<SynapseChatModalProps> = ({
  isOpen,
  onClose,
  initialPrompt,
}) => {
  const [inputVal, setInputVal] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const [messages, setMessages] = useState<ChatMessage[]>([INITIAL_WELCOME]);

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

  // Handle ESC key to close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

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
      // Map history to server format (user / model)
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
      };

      setMessages((prev) => [...prev, modelMessage]);
    } catch (err: any) {
      console.error('Chat error:', err);
      setErrorMsg(err.message || 'Unable to connect to assistant. Please try again.');
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
        text: "Hi! I'm an AI trained on Elara Vance's background and projects. Ask me anything about her skills, work, or how to get in touch.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ]);
    setErrorMsg(null);
  };

  if (!isOpen) return null;

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 bg-[#0A0E12]/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 select-none animate-fadeIn"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-3xl h-[88vh] max-h-[760px] rounded-2xl bg-[#12161C] border border-[#00D4FF]/30 shadow-[0_24px_80px_rgba(0,0,0,0.85)] flex flex-col overflow-hidden"
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
        <div className="px-4 py-2.5 bg-[#0E1217] border-b border-[#00D4FF]/15 flex items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#00D4FF] animate-pulse" />
            <span className="font-code text-xs text-[#EAF2F5] font-medium tracking-wide">
              AI Portfolio Assistant
            </span>
            <span className="font-code text-[11px] text-[#5B6B75] hidden sm:inline">
              • Trained on Elara Vance's background &amp; projects
            </span>
          </div>

          <button
            onClick={handleClearHistory}
            title="Clear conversation history"
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg font-code text-[11px] text-[#5B6B75] hover:text-[#FF5F57] hover:bg-[#182028] transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-[15px]">delete_sweep</span>
            <span className="hidden sm:inline">Clear Chat</span>
          </button>
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
                {/* Meta Header without developer tags */}
                <div className="flex items-center gap-2 px-1 text-[10px] font-code text-[#5B6B75]">
                  <span>{isUser ? 'YOU' : "ELARA'S AI ASSISTANT"}</span>
                  <span>•</span>
                  <span>{msg.timestamp}</span>
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

          {/* Simple "Thinking..." Indicator */}
          {isSending && (
            <div className="self-start flex flex-col gap-1 max-w-[70%]">
              <div className="flex items-center gap-2 px-1 text-[10px] font-code text-[#5B6B75]">
                <span>ELARA'S AI ASSISTANT</span>
                <span>•</span>
                <span className="text-[#00D4FF]">Thinking...</span>
              </div>
              <div className="p-3.5 rounded-xl bg-[#12161C] border border-[#7B61FF]/30 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#00D4FF] animate-ping-subtle" />
                <span className="w-2 h-2 rounded-full bg-[#7B61FF] animate-pulse" />
                <span className="w-2 h-2 rounded-full bg-[#FF9F45] animate-bounce" />
                <span className="font-code text-xs text-[#5B6B75] ml-2">
                  Thinking...
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

        {/* Approachable Suggestion Chips for General Visitors */}
        <div className="px-4 py-2.5 bg-[#0E1217] border-t border-[#182028] overflow-x-auto flex items-center gap-2">
          <span className="font-code text-[10px] text-[#5B6B75] uppercase tracking-wider shrink-0">
            SUGGESTIONS:
          </span>
          {SUGGESTIONS.map((item, idx) => (
            <button
              key={idx}
              onClick={() => handleSendMessage(item)}
              className="px-2.5 py-1 rounded-full bg-[#12161C] hover:bg-[#182028] border border-[#00D4FF]/20 hover:border-[#00D4FF] text-[#EAF2F5]/80 hover:text-[#00D4FF] font-code text-[11px] whitespace-nowrap transition-colors cursor-pointer shrink-0"
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
            <span className="material-symbols-outlined text-sm text-[#00D4FF]">chat</span>
            <input
              ref={inputRef}
              type="text"
              placeholder="Ask me anything about my work..."
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
