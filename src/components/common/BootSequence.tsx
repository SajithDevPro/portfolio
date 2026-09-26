import React, { useEffect, useState } from 'react';
import { EMBLEM_IMAGE } from '../../data/portfolioData';

interface BootSequenceProps {
  onComplete: () => void;
}

export const BootSequence: React.FC<BootSequenceProps> = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);
  const [statusText, setStatusText] = useState('INIT_KERNEL_V4.2...');

  useEffect(() => {
    // If user has reduced motion, complete immediately
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      onComplete();
      return;
    }

    const logs = [
      'INIT_KERNEL_V4.2...',
      'CONNECTING_TRACE_NODES...',
      'CALIBRATING_KINEMATIC_WEIGHTS...',
      'SYNAPSE_BUS_ONLINE.'
    ];

    let currentLog = 0;
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(onComplete, 250);
          return 100;
        }
        const next = prev + 15;
        const logIndex = Math.min(Math.floor((next / 100) * logs.length), logs.length - 1);
        if (logIndex !== currentLog) {
          currentLog = logIndex;
          setStatusText(logs[logIndex]);
        }
        return next;
      });
    }, 110);

    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <div
      onClick={onComplete}
      className="fixed inset-0 z-[120] bg-[#0A0E12] flex flex-col items-center justify-center cursor-pointer select-none px-6"
    >
      {/* Background Circuit Grid Lines */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#00D4FF08_1px,transparent_1px),linear-gradient(to_bottom,#00D4FF08_1px,transparent_1px)] bg-[size:3rem_3rem] pointer-events-none" />

      {/* Hexagonal Core Emblem */}
      <div className="relative flex flex-col items-center gap-6">
        <div className="relative w-24 h-24 flex items-center justify-center">
          {/* Animated circular pulse */}
          <div className="absolute inset-0 rounded-full border border-[#00D4FF]/30 animate-ping-subtle" />
          <div className="absolute inset-2 rounded-full border border-[#7B61FF]/40 animate-spin" style={{ animationDuration: '8s' }} />

          <img
            src={EMBLEM_IMAGE}
            alt="Genesis Emblem"
            className="w-16 h-16 object-contain relative z-10 drop-shadow-[0_0_20px_rgba(0,212,255,0.7)]"
          />
        </div>

        {/* Wordmark and Boot Progress */}
        <div className="flex flex-col items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="font-display text-2xl font-bold tracking-[0.2em] text-[#00D4FF] drop-shadow-[0_0_12px_rgba(0,212,255,0.6)]">
              GENESIS
            </span>
            <span className="font-code text-xs px-1.5 py-0.5 rounded bg-[#12161C] text-[#7B61FF] border border-[#7B61FF]/30">
              v4.2
            </span>
          </div>

          <div className="font-code text-xs text-[#5B6B75] tracking-wider uppercase flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#00D4FF] animate-pulse" />
            {statusText}
          </div>

          {/* Progress Bar */}
          <div className="w-48 h-1 bg-[#12161C] rounded-full overflow-hidden border border-[#00D4FF]/20 mt-1">
            <div
              className="h-full bg-gradient-to-r from-[#00D4FF] via-[#7B61FF] to-[#FF9F45] transition-all duration-150 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        <button
          onClick={onComplete}
          className="text-[11px] font-code text-[#5B6B75] hover:text-[#00D4FF] mt-4 transition-colors underline decoration-dotted"
        >
          [CLICK TO SKIP SEQUENCE]
        </button>
      </div>
    </div>
  );
};
