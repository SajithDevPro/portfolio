import React, { useState, useRef, Suspense, useEffect, useCallback } from 'react';
import { motion, useScroll, useTransform, useReducedMotion } from 'motion/react';
import { HeroTerminal } from './HeroTerminal';
import { ParticleConduit } from './ParticleConduit';
import { ActiveNode } from '../../types';

// Lazy load Three.js robot canvas to prevent blocking initial paint (Requirement 4)
const RobotCanvas3D = React.lazy(() =>
  import('./RobotCanvas3D').then((m) => ({ default: m.RobotCanvas3D }))
);

interface HeroSectionProps {
  onNavigate: (node: ActiveNode) => void;
  onOpenChat?: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onNavigate, onOpenChat }) => {
  const [isIgnited, setIsIgnited] = useState(false);
  const [burstTrigger, setBurstTrigger] = useState(0);
  const [assemblyProgress, setAssemblyProgress] = useState(0.55);
  const [scrollIntensityVal, setScrollIntensityVal] = useState(1.0);

  const sectionRef = useRef<HTMLElement>(null);
  const shouldReduceMotion = useReducedMotion();

  // Scroll-linked depth and exit transforms (Requirement 1)
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end start'],
  });

  const rawScale = useTransform(scrollYProgress, [0, 0.6, 1], [1, 0.98, 0.94]);
  const rawOpacity = useTransform(scrollYProgress, [0, 0.6, 1], [1, 0.9, 0.35]);
  const rawY = useTransform(scrollYProgress, [0, 1], [0, 60]);
  const rawRotateX = useTransform(scrollYProgress, [0, 1], [0, 3]);

  // Pass scroll power down to canvas & terminal safely via useEffect
  useEffect(() => {
    const unsubscribe = scrollYProgress.on('change', (latest) => {
      setScrollIntensityVal(Math.max(0.15, 1.0 - latest * 1.1));
    });
    return () => unsubscribe();
  }, [scrollYProgress]);

  const scale = shouldReduceMotion ? 1 : rawScale;
  const opacity = rawOpacity;
  const y = shouldReduceMotion ? 0 : rawY;
  const rotateX = shouldReduceMotion ? 0 : rawRotateX;

  const handleIgnite = () => {
    setIsIgnited((prev) => !prev);
    setBurstTrigger((prev) => prev + 1);

    // Dynamic progressive re-assembly animation (Requirement 2)
    setAssemblyProgress(0.05);
    let start: number | null = null;
    const duration = 2200; // 2.2s smooth mechanical assembly

    const step = (timestamp: number) => {
      if (!start) start = timestamp;
      const elapsed = timestamp - start;
      const progress = Math.min(1.0, 0.05 + (elapsed / duration) * 0.95);
      setAssemblyProgress(progress);
      if (elapsed < duration) {
        requestAnimationFrame(step);
      } else {
        setAssemblyProgress(1.0);
      }
    };
    requestAnimationFrame(step);
  };

  const handleLineCompiled = useCallback((_lineIndex: number) => {
    setBurstTrigger((prev) => prev + 1);
    setAssemblyProgress((prev) => Math.min(1.0, prev + 0.06));
  }, []);

  const handleSnippetCycle = useCallback(() => {
    setBurstTrigger((prev) => prev + 1);
  }, []);

  return (
    <motion.section
      ref={sectionRef}
      id="hero"
      aria-label="Hero Genesis"
      style={{
        scale,
        opacity,
        y,
        rotateX,
        transformPerspective: 1200,
      }}
      className="relative w-full min-h-[calc(100vh-4rem)] flex flex-col justify-center py-6 sm:py-10"
    >
      {/* 1. Immediate Identity & Role Headline (Tier 1 Typography) */}
      <div className="flex flex-col gap-2 mb-6">
        <div className="flex items-center gap-2">
          <span className="font-code text-xs px-2.5 py-0.5 rounded bg-[#182028] text-[#00D4FF] border border-[#00D4FF]/25">
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
            onSnippetCycle={handleSnippetCycle}
            scrollIntensity={scrollIntensityVal}
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

        {/* Right Column: Biomechanical Robotic Core (Lazy Loaded with Fallback) */}
        <div className="lg:col-span-5 flex flex-col gap-3">
          <Suspense
            fallback={
              <div className="relative w-full h-[320px] sm:h-[380px] lg:h-[420px] flex flex-col items-center justify-center rounded-xl bg-[#0B0F13] border border-[#00D4FF]/15 animate-pulse">
                <div className="w-20 h-20 rounded-full border border-dashed border-[#00D4FF]/40 animate-spin" />
                <span className="mt-3 font-code text-xs text-[#5B6B75]">
                  Initializing 3D Robot Matrix...
                </span>
              </div>
            }
          >
            <RobotCanvas3D
              assemblyProgress={assemblyProgress}
              isIgnited={isIgnited}
              onIgnite={handleIgnite}
              scrollIntensity={scrollIntensityVal}
            />
          </Suspense>
        </div>
      </div>

      {/* Bottom Editorial Content & Clear Visitor Action Controls */}
      <div className="mt-8 sm:mt-10 p-6 sm:p-8 rounded-2xl bg-[#12161C]/90 border border-[#00D4FF]/15 backdrop-blur-xl shadow-[0_12px_40px_rgba(0,0,0,0.6)] flex flex-col gap-6">
        <div className="flex flex-col gap-2.5">
          {/* Plain Language Tags */}
          <div className="flex items-center gap-2 text-xs font-code">
            <span className="px-2.5 py-0.5 rounded bg-[#182028] text-[#00D4FF] border border-[#00D4FF]/25">
              Robotics
            </span>
            <span className="px-2.5 py-0.5 rounded bg-[#182028] text-[#7B61FF] border border-[#7B61FF]/25">
              Edge AI
            </span>
            <span className="px-2.5 py-0.5 rounded bg-[#182028] text-[#5B6B75] border border-[#182028] hidden sm:inline">
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
          {/* Hero Button 1: Replay Intro Animation (Outcome-Based, True Amber Ignition Moment) */}
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
          <div className="flex flex-col gap-1.5 p-3.5 rounded-xl bg-[#0B0F13] border border-[#00D4FF]/25 hover:border-[#00D4FF]/50 transition-all">
            <button
              onClick={onOpenChat}
              className="w-full flex items-center justify-between gap-2 px-4 py-2.5 rounded-lg bg-[#182028] hover:bg-[#202934] border border-[#00D4FF]/30 hover:border-[#00D4FF] text-[#00D4FF] font-display font-semibold text-xs sm:text-sm tracking-wider uppercase transition-all shadow-sm cursor-pointer active:scale-98"
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
            className="flex-1 min-h-[44px] px-5 py-2.5 rounded-lg bg-[#182028] hover:bg-[#202934] text-[#EAF2F5] hover:text-[#00D4FF] border border-[#182028] hover:border-[#00D4FF]/30 font-display font-semibold text-xs tracking-wider uppercase flex items-center justify-center gap-2 active:scale-95 transition-all cursor-pointer"
          >
            <span className="material-symbols-outlined text-base text-[#5B6B75] group-hover:text-[#00D4FF]">person</span>
            <span>READ BIO &amp; PROFILE</span>
          </button>

          <button
            onClick={() => onNavigate('projects')}
            className="flex-1 min-h-[44px] px-5 py-2.5 rounded-lg bg-[#182028] hover:bg-[#202934] text-[#EAF2F5] hover:text-[#00D4FF] border border-[#182028] hover:border-[#00D4FF]/30 font-display font-semibold text-xs tracking-wider uppercase flex items-center justify-center gap-2 active:scale-95 transition-all cursor-pointer"
          >
            <span className="material-symbols-outlined text-base text-[#5B6B75] group-hover:text-[#00D4FF]">code_blocks</span>
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
          className="flex flex-col items-center text-[#5B6B75] hover:text-[#00D4FF] transition-colors cursor-pointer p-1"
          aria-label="Scroll to Profile section"
        >
          <span className="material-symbols-outlined text-lg animate-bounce">
            keyboard_arrow_down
          </span>
        </button>
      </div>
    </motion.section>
  );
};
