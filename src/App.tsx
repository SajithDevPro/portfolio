import React, { useState, useEffect } from 'react';
import { ActiveNode } from './types';
import { BootSequence } from './components/common/BootSequence';
import { CustomCursor } from './components/common/CustomCursor';
import { Header } from './components/navigation/Header';
import { TraceNav } from './components/navigation/TraceNav';
import { FloatingDock } from './components/navigation/FloatingDock';
import { HeroSection } from './components/hero/HeroSection';
import { AboutSection } from './components/about/AboutSection';
import { SkillsSection } from './components/skills/SkillsSection';
import { ProjectsSection } from './components/projects/ProjectsSection';
import { InterestsSection } from './components/interests/InterestsSection';
import { ContactSection } from './components/contact/ContactSection';
import { DiagnosticsModal } from './components/common/DiagnosticsModal';
import { ResumeModal } from './components/common/ResumeModal';
import { SynapseChatModal } from './components/chat/SynapseChatModal';

export default function App() {
  const [bootFinished, setBootFinished] = useState(false);
  const [activeNode, setActiveNode] = useState<ActiveNode>('hero');
  const [isDiagnosticsOpen, setIsDiagnosticsOpen] = useState(false);
  const [isResumeOpen, setIsResumeOpen] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [selectedProjectSlug, setSelectedProjectSlug] = useState<string | null>(null);

  // Requirement 6: Brief auto-fading scroll hint shown once per session
  const [showScrollHint, setShowScrollHint] = useState(() => {
    try {
      return !sessionStorage.getItem('genesis_hint_seen');
    } catch {
      return true;
    }
  });

  useEffect(() => {
    if (!showScrollHint) return;

    const handleFirstScroll = () => {
      if (window.scrollY > 40) {
        setShowScrollHint(false);
        try {
          sessionStorage.setItem('genesis_hint_seen', 'true');
        } catch {}
      }
    };

    window.addEventListener('scroll', handleFirstScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleFirstScroll);
  }, [showScrollHint]);

  // Deep linking and scroll spy synchronization
  useEffect(() => {
    // Check URL hash on load
    const hash = window.location.hash.replace('#', '');
    if (['hero', 'about', 'skills', 'projects', 'interests', 'contact'].includes(hash)) {
      setActiveNode(hash as ActiveNode);
    }

    const handleScroll = () => {
      const nodes: ActiveNode[] = ['hero', 'about', 'skills', 'projects', 'interests', 'contact'];
      const scrollPosition = window.scrollY + 200;

      for (let i = nodes.length - 1; i >= 0; i--) {
        const el = document.getElementById(nodes[i]);
        if (el) {
          const top = el.offsetTop;
          if (scrollPosition >= top) {
            setActiveNode(nodes[i]);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavigate = (node: ActiveNode) => {
    setActiveNode(node);
    if (selectedProjectSlug && node !== 'projects') {
      setSelectedProjectSlug(null);
    }

    const el = document.getElementById(node);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
    window.history.replaceState(null, '', `#${node}`);
  };

  return (
    <div className="relative min-h-screen bg-[#0A0E12] text-[#EAF2F5] selection:bg-[#00D4FF]/30 selection:text-[#EAF2F5] flex flex-col font-body">
      {/* Circuit Boot Sequence Overlay */}
      {!bootFinished && (
        <BootSequence onComplete={() => setBootFinished(true)} />
      )}

      {/* Custom Precision Cursor */}
      <CustomCursor />

      {/* 3-Zone Top Bar Contract */}
      <Header
        activeNode={activeNode}
        onNavigate={handleNavigate}
        onOpenResume={() => setIsResumeOpen(true)}
        onOpenChat={() => setIsChatOpen(true)}
      />

      {/* Persistent Left-Edge Trace Minimap & Waypoint Traveler */}
      <TraceNav
        activeNode={activeNode}
        onNavigate={handleNavigate}
      />

      {/* Persistent Floating Social Dock */}
      <FloatingDock
        onNavigate={handleNavigate}
        onOpenTerminalModal={() => setIsDiagnosticsOpen(true)}
        onOpenChatModal={() => setIsChatOpen(true)}
      />

      {/* Floating Direct AI Co-Pilot Summon Button with Context (Requirement 2) */}
      <div className="fixed bottom-20 right-4 sm:right-6 z-40 flex flex-col items-end gap-1.5 pointer-events-auto">
        <button
          onClick={() => setIsChatOpen(true)}
          className="group px-4 py-2 rounded-full bg-[#12161C]/95 hover:bg-[#182028] border border-[#00D4FF]/40 hover:border-[#00D4FF] text-[#00D4FF] font-code text-xs font-semibold flex items-center gap-2 shadow-[0_4px_24px_rgba(0,212,255,0.3)] hover:shadow-[0_4px_28px_rgba(0,212,255,0.45)] active:scale-95 transition-all cursor-pointer backdrop-blur-md"
          title="Open Gemini AI Assistant"
        >
          <span className="relative flex h-2 w-2">
            <span className="animate-ping-subtle absolute inline-flex h-full w-full rounded-full bg-[#00D4FF] opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#00D4FF]"></span>
          </span>
          <span className="material-symbols-outlined text-[16px]">voice_chat</span>
          <span>ASK ELARA'S AI</span>
        </button>
        <span className="font-code text-[10px] text-[#EAF2F5]/75 bg-[#0A0E12]/90 px-2.5 py-0.5 rounded border border-[#182028] shadow-sm select-none hidden sm:inline-block">
          Chat with an AI trained on my projects &amp; background
        </span>
      </div>

      {/* First-Time Visitor Scroll Guidance Hint (Requirement 6) */}
      {showScrollHint && (
        <aside
          aria-label="First-time navigation guidance"
          onClick={() => {
            setShowScrollHint(false);
            try {
              sessionStorage.setItem('genesis_hint_seen', 'true');
            } catch {}
            document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' });
          }}
          className="fixed bottom-24 left-1/2 -translate-x-1/2 z-50 px-4 py-2 rounded-full bg-[#0B0F13]/95 border border-[#00D4FF]/40 text-[#EAF2F5] shadow-[0_8px_32px_rgba(0,0,0,0.85)] shadow-[0_0_18px_rgba(0,212,255,0.25)] flex items-center gap-2 backdrop-blur-md cursor-pointer animate-bounce select-none transition-all hover:scale-105"
        >
          <span className="w-2 h-2 rounded-full bg-[#00D4FF] animate-ping-subtle" />
          <span className="font-code text-xs text-[#EAF2F5] font-medium tracking-wide">
            Scroll to begin
          </span>
          <span className="material-symbols-outlined text-sm text-[#00D4FF]">arrow_downward</span>
        </aside>
      )}

      {/* Main Continuous Waypoint Journey */}
      <main className="relative flex-1 w-full pl-12 sm:pl-32 lg:pl-36 pr-4 sm:pr-8 md:pr-12 pt-20 max-w-7xl mx-auto flex flex-col gap-12 sm:gap-16">
        {/* Node 00: Hero — Genesis (Autonomous code -> robot birth) */}
        <HeroSection
          onNavigate={handleNavigate}
          onOpenChat={() => setIsChatOpen(true)}
        />

        {/* Hairline circuit divider */}
        <div className="w-full h-px bg-gradient-to-r from-transparent via-[#00D4FF]/20 to-transparent" />

        {/* Node 01: About — Portrait & Biometric Telemetry */}
        <AboutSection
          onNavigate={handleNavigate}
          onOpenResume={() => setIsResumeOpen(true)}
        />

        {/* Hairline circuit divider */}
        <div className="w-full h-px bg-gradient-to-r from-transparent via-[#7B61FF]/20 to-transparent" />

        {/* Node 02: Skills — Engineering Pillars & Modules */}
        <SkillsSection onNavigate={handleNavigate} />

        {/* Hairline circuit divider */}
        <div className="w-full h-px bg-gradient-to-r from-transparent via-[#00D4FF]/20 to-transparent" />

        {/* Node 03: Projects — Index & Deep Dive */}
        <ProjectsSection
          onNavigate={handleNavigate}
          selectedProjectSlug={selectedProjectSlug}
          onSelectProject={(slug) => {
            setSelectedProjectSlug(slug);
            const el = document.getElementById('projects');
            if (el) el.scrollIntoView({ behavior: 'smooth' });
          }}
        />

        {/* Hairline circuit divider */}
        <div className="w-full h-px bg-gradient-to-r from-transparent via-[#FF9F45]/20 to-transparent" />

        {/* Node 04: Interests — Human Peripherals */}
        <InterestsSection onNavigate={handleNavigate} />

        {/* Hairline circuit divider */}
        <div className="w-full h-px bg-gradient-to-r from-transparent via-[#00D4FF]/20 to-transparent" />

        {/* Node 05: Contact — Terminus & Direct Uplink */}
        <ContactSection />
      </main>

      {/* Clean Minimal System Footer */}
      <footer className="w-full py-8 pl-12 sm:pl-20 pr-4 border-t border-[#182028] bg-[#07090C] text-[#5B6B75] font-code text-xs">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#00D4FF]" />
            <span>GENESIS_SYSTEM // DESIGNED BY ELARA VANCE</span>
          </div>
          <div className="text-[11px] text-[#5B6B75]">
            ALL CIRCUITS NOMINAL · 100% HARDWARE ACCELERATED · NO TRACKERS
          </div>
        </div>
      </footer>

      {/* Interactive Diagnostics Terminal Modal */}
      <DiagnosticsModal
        isOpen={isDiagnosticsOpen}
        onClose={() => setIsDiagnosticsOpen(false)}
      />

      {/* Resume Spec Sheet Modal */}
      <ResumeModal
        isOpen={isResumeOpen}
        onClose={() => setIsResumeOpen(false)}
      />

      {/* Multi-Turn Gemini AI Co-Pilot Modal */}
      <SynapseChatModal
        isOpen={isChatOpen}
        onClose={() => setIsChatOpen(false)}
      />
    </div>
  );
}
