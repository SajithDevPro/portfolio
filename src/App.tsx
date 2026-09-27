import React, { useState, useEffect } from 'react';
import { ActiveNode } from './types';
import { ThemeProvider, useTheme } from './context/ThemeContext';
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

function AppContent() {
  const [bootFinished, setBootFinished] = useState(false);
  const [activeNode, setActiveNode] = useState<ActiveNode>('hero');
  const [isDiagnosticsOpen, setIsDiagnosticsOpen] = useState(false);
  const [isResumeOpen, setIsResumeOpen] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [selectedProjectSlug, setSelectedProjectSlug] = useState<string | null>(null);
  const { theme, backgroundStyle } = useTheme();

  // Brief auto-fading scroll hint shown once per session
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
    <div className="relative min-h-screen bg-[var(--bg-page)] text-[var(--text-primary)] selection:bg-[var(--accent-cyan)]/25 selection:text-[var(--text-primary)] flex flex-col font-body transition-colors duration-300">
      {/* User-Friendly Multi-Layer Atmospheric Lighting Background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0 select-none">
        {backgroundStyle !== 'minimal' && (
          <>
            {/* Top Sky Glow */}
            <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[900px] h-[500px] bg-gradient-to-b from-[var(--accent-cyan)]/14 via-[var(--accent-violet)]/8 to-transparent rounded-full blur-3xl opacity-75" />
            
            {/* Right Accent Ambient Shimmer */}
            <div className="absolute top-[32%] -right-40 w-[600px] h-[600px] bg-gradient-to-bl from-[var(--accent-violet)]/12 via-[var(--accent-cyan)]/6 to-transparent rounded-full blur-3xl opacity-50" />
            
            {/* Left Warm Amber/Teal Glow */}
            <div className="absolute top-[65%] -left-40 w-[600px] h-[600px] bg-gradient-to-tr from-[var(--accent-amber)]/10 via-[var(--accent-cyan)]/6 to-transparent rounded-full blur-3xl opacity-45" />
          </>
        )}

        {/* Minimal clean gradient fallback */}
        {backgroundStyle === 'minimal' && (
          <div className="absolute inset-0 bg-gradient-to-b from-[var(--bg-surface)]/40 via-transparent to-[var(--bg-surface)]/20" />
        )}
        
        {/* Subtle Architectural Grid Mesh (shown when mesh style active or ambient soft) */}
        {backgroundStyle === 'mesh' && (
          <div
            className={`absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:44px_44px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] ${
              theme === 'light' ? 'opacity-35' : 'opacity-70'
            }`}
          />
        )}
      </div>

      {/* Circuit Boot Sequence Overlay */}
      {!bootFinished && (
        <BootSequence onComplete={() => setBootFinished(true)} />
      )}

      {/* Custom Precision Cursor */}
      <CustomCursor />

      {/* Top Navigation Header */}
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

      {/* Floating Direct AI Assistant Summon Button */}
      <div className="fixed bottom-20 right-4 sm:right-6 z-40 flex flex-col items-end gap-1.5 pointer-events-auto">
        <button
          onClick={() => setIsChatOpen(true)}
          className="group px-4 py-2.5 rounded-full bg-[var(--bg-surface)] hover:bg-[var(--bg-surface-elevated)] border border-[var(--accent-cyan)]/45 hover:border-[var(--accent-cyan)] text-[var(--accent-cyan)] font-body text-xs font-semibold flex items-center gap-2 shadow-[0_6px_24px_rgba(0,0,0,0.25)] hover:shadow-[0_8px_30px_rgba(56,189,248,0.35)] active:scale-95 transition-all cursor-pointer backdrop-blur-xl"
          title="Chat with AI Assistant"
        >
          <span className="relative flex h-2 w-2">
            <span className="animate-ping-subtle absolute inline-flex h-full w-full rounded-full bg-[var(--accent-cyan)] opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-[var(--accent-cyan)]"></span>
          </span>
          <span className="material-symbols-outlined text-[17px]">voice_chat</span>
          <span>Ask AI Assistant</span>
        </button>
        <span className="font-body text-[11px] text-[var(--text-secondary)] bg-[var(--bg-surface)]/95 px-3 py-1 rounded-full border border-[var(--border-subtle)] shadow-sm select-none hidden sm:inline-block backdrop-blur-md">
          Trained on Elara's engineering projects &amp; background
        </span>
      </div>

      {/* First-Time Visitor Scroll Guidance Hint */}
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
          className="fixed bottom-24 left-1/2 -translate-x-1/2 z-50 px-4 py-2 rounded-full bg-[var(--bg-surface)]/95 border border-[var(--accent-cyan)]/40 text-[var(--text-primary)] shadow-[0_8px_32px_rgba(0,0,0,0.3)] flex items-center gap-2 backdrop-blur-md cursor-pointer animate-bounce select-none transition-all hover:scale-105"
        >
          <span className="w-2 h-2 rounded-full bg-[var(--accent-cyan)] animate-ping-subtle" />
          <span className="font-body text-xs font-medium tracking-wide">
            Scroll to explore
          </span>
          <span className="material-symbols-outlined text-sm text-[var(--accent-cyan)]">arrow_downward</span>
        </aside>
      )}

      {/* Main Continuous Waypoint Journey */}
      <main className="relative z-10 flex-1 w-full pl-12 sm:pl-32 lg:pl-36 pr-4 sm:pr-8 md:pr-12 pt-20 max-w-7xl mx-auto flex flex-col gap-12 sm:gap-16">
        {/* Node 00: Hero */}
        <HeroSection
          onNavigate={handleNavigate}
          onOpenChat={() => setIsChatOpen(true)}
        />

        {/* Hairline subtle divider */}
        <div className="w-full h-px bg-gradient-to-r from-transparent via-[var(--border-strong)] to-transparent" />

        {/* Node 01: About */}
        <AboutSection
          onNavigate={handleNavigate}
          onOpenResume={() => setIsResumeOpen(true)}
        />

        {/* Hairline subtle divider */}
        <div className="w-full h-px bg-gradient-to-r from-transparent via-[var(--accent-violet)]/25 to-transparent" />

        {/* Node 02: Skills */}
        <SkillsSection onNavigate={handleNavigate} />

        {/* Hairline subtle divider */}
        <div className="w-full h-px bg-gradient-to-r from-transparent via-[var(--border-strong)] to-transparent" />

        {/* Node 03: Projects */}
        <ProjectsSection
          onNavigate={handleNavigate}
          selectedProjectSlug={selectedProjectSlug}
          onSelectProject={(slug) => {
            setSelectedProjectSlug(slug);
            const el = document.getElementById('projects');
            if (el) el.scrollIntoView({ behavior: 'smooth' });
          }}
        />

        {/* Hairline subtle divider */}
        <div className="w-full h-px bg-gradient-to-r from-transparent via-[var(--accent-violet)]/20 to-transparent" />

        {/* Node 04: Interests */}
        <InterestsSection onNavigate={handleNavigate} />

        {/* Hairline subtle divider */}
        <div className="w-full h-px bg-gradient-to-r from-transparent via-[var(--border-strong)] to-transparent" />

        {/* Node 05: Contact */}
        <ContactSection />
      </main>

      {/* Clean Friendly System Footer */}
      <footer className="relative z-10 w-full py-8 pl-12 sm:pl-20 pr-4 border-t border-[var(--border-subtle)] bg-[var(--bg-surface)] text-[var(--text-secondary)] font-body text-xs">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[var(--accent-cyan)]" />
            <span className="font-medium text-[var(--text-primary)]">
              Elara Vance · Software Systems &amp; Robotics Portfolio
            </span>
          </div>
          <div className="text-[12px] text-[var(--text-muted)]">
            Designed for clarity &amp; performance · Real-Time Systems &amp; Embodied AI
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

      {/* Multi-Turn Gemini AI Assistant Modal */}
      <SynapseChatModal
        isOpen={isChatOpen}
        onClose={() => setIsChatOpen(false)}
      />
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}
