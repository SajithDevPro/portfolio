import React from 'react';
import { ActiveNode } from '../../types';

interface TraceNavProps {
  activeNode: ActiveNode;
  onNavigate: (node: ActiveNode) => void;
}

interface NavNodeItem {
  id: ActiveNode;
  label: string;
  code: string;
  icon: string;
}

const NODES: NavNodeItem[] = [
  { id: 'hero', label: 'Home', code: '00', icon: 'home' },
  { id: 'about', label: 'Profile', code: '01', icon: 'person' },
  { id: 'skills', label: 'Skills', code: '02', icon: 'memory' },
  { id: 'projects', label: 'Projects', code: '03', icon: 'code_blocks' },
  { id: 'interests', label: 'Research', code: '04', icon: 'hub' },
  { id: 'contact', label: 'Contact', code: '05', icon: 'mail' }
];

export const TraceNav: React.FC<TraceNavProps> = ({ activeNode, onNavigate }) => {
  const activeIndex = NODES.findIndex((n) => n.id === activeNode);

  return (
    <aside
      aria-label="Trace Navigation"
      className="fixed left-0 top-16 bottom-20 z-30 w-12 sm:w-32 lg:w-36 flex flex-col items-start pl-2 sm:pl-3.5 pointer-events-auto select-none"
    >
      <div className="relative h-full flex flex-col justify-center py-4 w-full">
        {/* Continuous 3D/2D circuit trace line */}
        <div className="absolute left-[18px] sm:left-[21px] top-6 bottom-6 w-0.5 bg-[#12161C] border-l border-[#00D4FF]/20 overflow-hidden">
          {/* Animated pulse line */}
          <div
            className="w-full bg-gradient-to-b from-[#00D4FF] via-[#7B61FF] to-[#00D4FF]/20 transition-all duration-700 ease-out"
            style={{
              height: `${((activeIndex + 1) / NODES.length) * 100}%`
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#00D4FF]/60 to-transparent w-full h-1/3 animate-trace-glow" />
        </div>

        {/* Trace Nodes */}
        <nav className="relative flex flex-col justify-between h-[75%] py-2 z-10 w-full">
          {NODES.map((node, idx) => {
            const isActive = activeNode === node.id;
            const isPassed = idx <= activeIndex;

            return (
              <button
                key={node.id}
                onClick={() => onNavigate(node.id)}
                aria-label={`Navigate to ${node.code} ${node.label}`}
                title={`Jump to ${node.label} section`}
                className="group relative flex items-center min-w-[44px] min-h-[44px] transition-all cursor-pointer focus:outline-none w-full"
              >
                {/* Node Ring & Core */}
                <div
                  className={`relative flex items-center justify-center transition-all duration-300 shrink-0 w-8 h-8 ${
                    isActive
                      ? 'scale-125'
                      : 'group-hover:scale-115'
                  }`}
                >
                  {/* Subtle active ping ring */}
                  {isActive && (
                    <span className="absolute -inset-1 rounded-full bg-[#00D4FF]/25 animate-ping-subtle pointer-events-none" />
                  )}

                  {/* Outer hex/circle ring */}
                  <span
                    className={`w-3.5 h-3.5 rounded-full border transition-all duration-300 flex items-center justify-center ${
                      isActive
                        ? 'border-[#00D4FF] bg-[#0A0E12] shadow-[0_0_12px_#00D4FF]'
                        : isPassed
                        ? 'border-[#00D4FF]/60 bg-[#12161C]'
                        : 'border-[#5B6B75]/40 bg-[#0A0E12] group-hover:border-[#00D4FF]/60'
                    }`}
                  >
                    {/* Inner glowing dot */}
                    <span
                      className={`w-1.5 h-1.5 rounded-full transition-colors duration-300 ${
                        isActive
                          ? 'bg-[#00D4FF] shadow-[0_0_6px_#00D4FF]'
                          : isPassed
                          ? 'bg-[#7B61FF]'
                          : 'bg-[#5B6B75]/40 group-hover:bg-[#00D4FF]/60'
                      }`}
                    />
                  </span>
                </div>

                {/* Visible Label on every node (Requirement 5) */}
                <div className="hidden sm:flex items-center gap-1.5 ml-2.5 font-code text-[11px] tracking-wide text-left whitespace-nowrap">
                  <span className={`text-[10px] ${isActive ? 'text-[#00D4FF] font-bold' : 'text-[#5B6B75]'}`}>
                    {node.code}
                  </span>
                  <span
                    className={`uppercase transition-all duration-200 ${
                      isActive
                        ? 'text-[#00D4FF] font-semibold drop-shadow-[0_0_8px_rgba(0,212,255,0.6)] translate-x-0.5'
                        : isPassed
                        ? 'text-[#EAF2F5]/85 group-hover:text-[#00D4FF]'
                        : 'text-[#5B6B75] group-hover:text-[#EAF2F5]'
                    }`}
                  >
                    {node.label}
                  </span>
                </div>

                {/* Mobile floating tooltip on hover/active */}
                <div
                  className={`sm:hidden absolute left-10 px-2 py-0.5 rounded bg-[#12161C]/95 border border-[#00D4FF]/30 backdrop-blur-md font-code text-[10px] whitespace-nowrap pointer-events-none shadow-[0_4px_16px_rgba(0,0,0,0.6)] transition-all duration-200 z-50 flex items-center gap-1.5 ${
                    isActive
                      ? 'opacity-100 translate-x-0 border-[#00D4FF]/60 text-[#00D4FF]'
                      : 'opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 text-[#EAF2F5]'
                  }`}
                >
                  <span className="text-[#5B6B75]">{node.code}</span>
                  <span className="font-semibold">{node.label}</span>
                </div>
              </button>
            );
          })}
        </nav>
      </div>
    </aside>
  );
};
