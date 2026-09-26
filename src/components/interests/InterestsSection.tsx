import React from 'react';
import { INTERESTS } from '../../data/portfolioData';
import { WindowChrome } from '../common/WindowChrome';
import { ActiveNode } from '../../types';

interface InterestsSectionProps {
  onNavigate: (node: ActiveNode) => void;
}

export const InterestsSection: React.FC<InterestsSectionProps> = ({ onNavigate }) => {
  return (
    <section
      id="interests"
      aria-label="Interests & Human Peripherals"
      className="relative w-full py-8 sm:py-14 flex flex-col gap-8"
    >
      {/* Node Marker Header */}
      <div className="flex items-center justify-between px-3.5 py-1.5 rounded-full bg-[#12161C]/80 border border-[#7B61FF]/25 backdrop-blur-md max-w-lg">
        <div className="flex items-center gap-2 min-w-0">
          <span className="w-2 h-2 rounded-full bg-[#7B61FF] animate-pulse" />
          <span className="font-code text-xs text-[#7B61FF] uppercase tracking-wider truncate">
            04 // RESEARCH &amp; LAB INTERESTS
          </span>
        </div>
        <span className="px-2 py-0.5 rounded bg-[#182028] text-[#FF9F45] font-code text-[11px] font-medium shrink-0 border border-[#FF9F45]/20">
          Exploration
        </span>
      </div>

      {/* Section Title */}
      <div className="flex flex-col gap-2">
        <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl font-bold uppercase tracking-tight text-[#EAF2F5]">
          RESEARCH &amp; INTERESTS
        </h2>
        <p className="font-body text-sm sm:text-base text-[#5B6B75] max-w-2xl">
          The exploratory side beyond production code: hardware ergonomics, emergent flocking physics, high-speed manual flight, and modular sound synthesis.
        </p>
      </div>

      {/* Satellite Cards Grid with Warm Amber / Violet Touches */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {INTERESTS.map((item) => (
          <div
            key={item.id}
            className="group relative rounded-2xl bg-[#12161C] border border-[#7B61FF]/20 hover:border-[#FF9F45]/50 transition-all duration-300 p-5 flex flex-col gap-4 overflow-hidden shadow-md hover:shadow-[0_8px_30px_rgba(255,159,69,0.15)] hover:-translate-y-1"
          >
            {/* Ambient Radial Warmth on Hover */}
            <div className="absolute -top-12 -right-12 w-28 h-28 bg-[#FF9F45]/10 rounded-full blur-2xl group-hover:bg-[#FF9F45]/20 transition-all pointer-events-none" />

            {/* Header Icon + Tag */}
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 rounded-xl bg-[#182028] border border-[#7B61FF]/30 text-[#7B61FF] group-hover:text-[#FF9F45] group-hover:border-[#FF9F45]/40 flex items-center justify-center transition-colors">
                <span className="material-symbols-outlined text-[20px]">
                  {item.icon}
                </span>
              </div>
              <span className="font-code text-[10px] text-[#5B6B75] uppercase tracking-wider">
                {item.tag}
              </span>
            </div>

            {/* Title & Short Phrase */}
            <div className="flex flex-col gap-1">
              <h3 className="font-display text-base font-bold text-[#EAF2F5] group-hover:text-[#FF9F45] transition-colors">
                {item.title}
              </h3>
              <span className="font-code text-xs text-[#00D4FF]/90">
                {item.phrase}
              </span>
            </div>

            {/* Description */}
            <p className="font-body text-xs text-[#5B6B75] leading-relaxed mt-auto pt-1">
              {item.description}
            </p>
          </div>
        ))}
      </div>

      {/* Terminal Connector Bridge */}
      <div className="flex items-center justify-center pt-4">
        <button
          onClick={() => onNavigate('contact')}
          className="flex items-center gap-2 text-xs font-code text-[#FF9F45] hover:text-[#ffb066] transition-colors cursor-pointer"
        >
          <span>PROCEED TO CONTACT FORM ›</span>
          <span className="material-symbols-outlined text-sm">arrow_downward</span>
        </button>
      </div>
    </section>
  );
};
