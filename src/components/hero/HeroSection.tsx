import React, { useState } from 'react';
import { HeroTerminal } from './HeroTerminal';
import { RobotCanvas3D } from './RobotCanvas3D';
import { ParticleConduit } from './ParticleConduit';
import { ActiveNode } from '../../types';

interface HeroSectionProps {
  onNavigate: (node: ActiveNode) => void;
  onOpenChat?: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onNavigate, onOpenChat }) => {
  const [isIgnited, setIsIgnited] = useState(false);
  const [burstTrigger, setBurstTrigger] = useState(0);
  const [assemblyProgress, setAssemblyProgress] = useState(0.6);

  const handleIgnite = () => {
    setIsIgnited((prev) => !prev);
    setBurstTrigger((prev) => prev + 1);
    setAssemblyProgress(1.0);
  };

  const handleLineCompiled = (lineIndex: number) => {
    setBurstTrigger((prev) => prev + 1);
    setAssemblyProgress((prev) => Math.min(1.0, prev + 0.05));
  };

  return (
    <section
      id="hero"
      aria-label="Hero Genesis"
      className="relative w-full min-h-[calc(100vh-4rem)] flex flex-col justify-center py-6 sm:py-10"
    >
      {/* 1. Immediate Identity & Role Headline (Tier 1 Typography) */}
      <div className="flex flex-col gap-2 mb-6">
        <div className="flex items-center gap-2">
          <span className="font-code text-xs px-2.5 py-0.5 rounded bg-[#182028] text-[#00D4FF] border border-[#00D4FF]/30">
            ENGINEERING PORTFOLIO
          </span>
          <span className="font-code text-xs text-[#5B6B75] hidden sm:inline">
            Genesis v4.2 System Architecture
          </span>
        </div>
        <h1 className="font-display text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-[#EAF2F5]">
          ELARA VANCE
        </h1>
        <p className="font-body text-lg sm:text-2xl text-[#00D4FF] font-medium tracking-wide">
          Software Engineer — Robotics · AI/ML · Cloud Systems
        </p>
      </div>

      {/* Main Split-Canvas: Terminal (Left) & Robot (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        {/* Left Column: Code Terminal Panel */}
        <div className="lg:col-span-6 flex flex-col gap-4">
          <HeroTerminal
            onLineCompiled={handleLineCompiled}
            onSnippetCycle={() => setBurstTrigger((prev) => prev + 1)}
          />

          {/* Mobile connecting particle conduit */}
          <div className="lg:hidden">
            <ParticleConduit isIgnited={isIgnited} burstTrigger={burstTrigger} />
          </div>
        </div>

        {/* Desktop Particle Conduit Connector */}
        <div className="hidden lg:col-span-1 lg:flex items-center justify-center">
          <div className="w-full rotate-90 transform origin-center">
            <ParticleConduit isIgnited={isIgnited} burstTrigger={burstTrigger} />
          </div>
        </div>

        {/* Right Column: Biomechanical Robotic Core */}
        <div className="lg:col-span-5 flex flex-col gap-3">
          <RobotCanvas3D
            assemblyProgress={assemblyProgress}
            isIgnited={isIgnited}
            onIgnite={handleIgnite}
          />
        </div>
      </div>

      {/* Bottom Editorial Content & Clear Visitor Action Controls */}
      <div className="mt-8 sm:mt-10 p-6 sm:p-8 rounded-2xl bg-[#12161C]/90 border border-[#00D4FF]/20 backdrop-blur-xl shadow-[0_12px_40px_rgba(0,0,0,0.6)] flex flex-col gap-6">
        <div className="flex flex-col gap-2.5">
          {/* Plain Language Tags */}
          <div className="flex items-center gap-2 text-xs font-code">
            <span className="px-2.5 py-0.5 rounded bg-[#182028] text-[#00D4FF] border border-[#00D4FF]/30">
              Robotics
            </span>
            <span className="px-2.5 py-0.5 rounded bg-[#182028] text-[#7B61FF] border border-[#7B61FF]/30">
              Edge AI
            </span>
            <span className="px-2.5 py-0.5 rounded bg-[#182028] text-[#5B6B75] border border-[#5B6B75]/30 hidden sm:inline">
              Cloud Systems
            </span>
          </div>

          {/* Conceptual Subtitle */}
          <h2 className="font-display text-xl sm:text-2xl lg:text-3xl font-bold uppercase tracking-tight text-[#EAF2F5] leading-tight">
            WHERE CODE BECOMES A MACHINE
          </h2>

          {/* Human Body Copy */}
          <p className="font-body text-[#EAF2F5]/85 text-sm sm:text-base lg:text-lg max-w-3xl leading-relaxed">
            I build autonomous robotic systems, quantized neural vision models for edge hardware, and distributed real-time infrastructure. Explore the interactive schematics below or talk with an AI assistant trained on my engineering background.
          </p>
        </div>

        {/* 2. Clear Hero Action Controls (Replay Intro Animation & Ask Genesis AI with Context) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
          {/* Hero Button 1: Replay Intro Animation (Outcome-Based) */}
          <div className="flex flex-col gap-1.5 p-3.5 rounded-xl bg-[#0B0F13] border border-[#FF9F45]/30 hover:border-[#FF9F45]/60 transition-all">
            <div className="flex items-center justify-between">
              <button
                onClick={handleIgnite}
                className="w-full flex items-center justify-between gap-2 px-4 py-2.5 rounded-lg bg-[#FF9F45] hover:bg-[#ffb066] text-[#2E1500] font-display font-semibold text-xs sm:text-sm tracking-wider uppercase transition-all shadow-[0_0_16px_rgba(255,159,69,0.35)] cursor-pointer active:scale-98"
              >
                <span className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-base">
                    {isIgnited ? 'replay' : 'play_arrow'}
                  </span>
                  <span>{isIgnited ? '▶ REPLAY THE INTRO ANIMATION' : '▶ PLAY THE INTRO ANIMATION'}</span>
                </span>
                <span className="text-[10px] font-code px-1.5 py-0.5 rounded bg-[#2E1500]/20 text-[#2E1500] uppercase font-bold">
                  Ember Spark
                </span>
              </button>
            </div>
            <p className="font-code text-[11px] text-[#EAF2F5]/70 px-1">
              Streams simulated code syntax into the 3D robot's joint servos in real-time.
            </p>
          </div>

          {/* Hero Button 2: Ask Genesis AI with Clear Context */}
          <div className="flex flex-col gap-1.5 p-3.5 rounded-xl bg-[#0B0F13] border border-[#00D4FF]/30 hover:border-[#00D4FF]/60 transition-all">
            <button
              onClick={onOpenChat}
              className="w-full flex items-center justify-between gap-2 px-4 py-2.5 rounded-lg bg-[#182028] hover:bg-[#202934] border border-[#00D4FF]/50 hover:border-[#00D4FF] text-[#00D4FF] font-display font-semibold text-xs sm:text-sm tracking-wider uppercase transition-all shadow-sm cursor-pointer active:scale-98"
            >
              <span className="flex items-center gap-2">
                <span className="material-symbols-outlined text-base animate-pulse">voice_chat</span>
                <span>ASK GENESIS AI</span>
              </span>
              <span className="text-[10px] font-code px-1.5 py-0.5 rounded bg-[#00D4FF]/10 text-[#00D4FF] uppercase">
                Interactive Bot
              </span>
            </button>
            <p className="font-code text-[11px] text-[#00D4FF]/80 px-1">
              Chat with an AI trained on my projects &amp; background
            </p>
          </div>
        </div>

        {/* Secondary Tour Navigation Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 pt-1 border-t border-[#182028]">
          <button
            onClick={() => onNavigate('about')}
            className="flex-1 min-h-[44px] px-5 py-2.5 rounded-lg bg-[#182028] hover:bg-[#202934] text-[#EAF2F5] hover:text-[#00D4FF] border border-[#182028] hover:border-[#00D4FF]/40 font-display font-semibold text-xs tracking-wider uppercase flex items-center justify-center gap-2 active:scale-95 transition-all cursor-pointer"
          >
            <span className="material-symbols-outlined text-base">person</span>
            <span>READ BIO &amp; PROFILE</span>
          </button>

          <button
            onClick={() => onNavigate('projects')}
            className="flex-1 min-h-[44px] px-5 py-2.5 rounded-lg bg-[#182028] hover:bg-[#202934] text-[#EAF2F5] hover:text-[#00D4FF] border border-[#182028] hover:border-[#00D4FF]/40 font-display font-semibold text-xs tracking-wider uppercase flex items-center justify-center gap-2 active:scale-95 transition-all cursor-pointer"
          >
            <span className="material-symbols-outlined text-base">code_blocks</span>
            <span>VIEW PROJECTS &amp; CODE</span>
          </button>
        </div>
      </div>

      {/* Subtle Scroll Down Prompt (Cleaned Up Jargon) */}
      <div className="flex flex-col items-center justify-center pt-8 pb-2 gap-1 select-none text-center">
        <span className="font-code text-[11px] text-[#5B6B75] tracking-wide">
          Scroll to explore profile
        </span>
        <button
          onClick={() => onNavigate('about')}
          className="flex flex-col items-center text-[#00D4FF] hover:text-[#7B61FF] transition-colors cursor-pointer p-1"
          aria-label="Scroll to Profile section"
        >
          <span className="material-symbols-outlined text-lg animate-bounce">
            keyboard_arrow_down
          </span>
        </button>
      </div>
    </section>
  );
};
