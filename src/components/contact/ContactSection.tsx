import React, { useState, useRef } from 'react';
import { motion, useScroll, useTransform, useReducedMotion } from 'motion/react';
import { WindowChrome } from '../common/WindowChrome';

export const ContactSection: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
    subsystem: 'ROBOTICS_COLLABORATION',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSent, setIsSent] = useState(false);

  const sectionRef = useRef<HTMLElement>(null);
  const shouldReduceMotion = useReducedMotion();

  // Scroll-linked depth transforms (Requirement 1)
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end end'],
  });

  const rawScale = useTransform(scrollYProgress, [0, 0.35, 1], [0.93, 1, 1]);
  const rawY = useTransform(scrollYProgress, [0, 0.35, 1], [40, 0, 0]);
  const rawRotateX = useTransform(scrollYProgress, [0, 0.35, 1], [3, 0, 0]);
  const rawOpacity = useTransform(scrollYProgress, [0, 0.25, 1], [0.35, 1, 1]);

  const scale = shouldReduceMotion ? 1 : rawScale;
  const y = shouldReduceMotion ? 0 : rawY;
  const rotateX = shouldReduceMotion ? 0 : rawRotateX;
  const opacity = rawOpacity;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) return;

    setIsSubmitting(true);
    // Simulate deterministic network packet transmission
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSent(true);
    }, 900);
  };

  return (
    <motion.section
      ref={sectionRef}
      id="contact"
      aria-label="Direct Uplink Contact"
      style={{
        scale,
        y,
        rotateX,
        opacity,
        transformPerspective: 1200,
      }}
      className="relative w-full py-8 sm:py-16 flex flex-col gap-8 pb-20"
    >
      {/* Node Marker Header */}
      <div className="flex items-center justify-between px-3.5 py-1.5 rounded-full bg-[#12161C]/80 border border-[#00D4FF]/15 backdrop-blur-md max-w-lg">
        <div className="flex items-center gap-2 min-w-0">
          <span className="w-2 h-2 rounded-full bg-[#00D4FF] animate-pulse" />
          <span className="font-code text-xs text-[#00D4FF] uppercase tracking-wider truncate">
            05 // CONTACT &amp; DIRECT UPLINK
          </span>
        </div>
        <span className="px-2 py-0.5 rounded bg-[#182028] text-[#5B6B75] font-code text-[11px] font-medium shrink-0 border border-[#182028]">
          Open For Roles
        </span>
      </div>

      {/* Terminal Connector Convergence Graphic */}
      <div className="relative w-full flex flex-col items-center justify-center my-2 pointer-events-none">
        <svg
          className="w-full max-w-md h-12 text-[#00D4FF]"
          viewBox="0 0 300 40"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M 10 0 L 100 20 L 150 36 L 200 20 L 290 0"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeDasharray="4 4"
            className="opacity-30"
          />
          <circle cx="150" cy="36" r="3.5" fill="#00D4FF" className="opacity-80" />
          <line x1="150" y1="36" x2="150" y2="40" stroke="#00D4FF" strokeWidth="1.5" className="opacity-60" />
        </svg>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Transmission Spec & Direct Links */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl font-bold uppercase tracking-tight text-[#EAF2F5]">
              GET IN TOUCH
            </h2>
            <p className="font-body text-sm sm:text-base text-[#5B6B75] leading-relaxed">
              Accepting full-time engineering roles, research collaborations, and projects in autonomous robotics and edge AI.
            </p>
          </div>

          {/* Quick Contact Specification Cards */}
          <div className="flex flex-col gap-3 font-code text-xs">
            <div className="p-4 rounded-xl bg-[#12161C] border border-[#182028] hover:border-[#00D4FF]/30 transition-colors flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-[#5B6B75] text-lg">mail</span>
                <div className="flex flex-col">
                  <span className="text-[#5B6B75] text-[10px] uppercase">EMAIL</span>
                  <a
                    href="mailto:elara.vance.robotics@genesis.engineering"
                    className="text-[#EAF2F5] hover:text-[#00D4FF] transition-colors"
                  >
                    elara.vance.robotics@genesis.engineering
                  </a>
                </div>
              </div>
              <span className="text-[#00D4FF] text-[10px] uppercase font-semibold">ACTIVE</span>
            </div>

            <div className="p-4 rounded-xl bg-[#12161C] border border-[#182028] hover:border-[#00D4FF]/30 transition-colors flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-[#5B6B75] text-lg">location_on</span>
                <div className="flex flex-col">
                  <span className="text-[#5B6B75] text-[10px] uppercase">LOCATION</span>
                  <span className="text-[#EAF2F5]">Seattle, WA (Open to Hybrid / Remote)</span>
                </div>
              </div>
              <span className="text-[#5B6B75] text-[10px] uppercase">PST</span>
            </div>

            <div className="p-4 rounded-xl bg-[#12161C] border border-[#182028] hover:border-[#00D4FF]/30 transition-colors flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-[#5B6B75] text-lg">verified_user</span>
                <div className="flex flex-col">
                  <span className="text-[#5B6B75] text-[10px] uppercase">WORK AUTHORIZATION</span>
                  <span className="text-[#EAF2F5]">US Citizen / Authorized</span>
                </div>
              </div>
              <span className="text-[#5B6B75] text-[10px] uppercase font-semibold">VERIFIED</span>
            </div>
          </div>
        </div>

        {/* Right Column: Terminal-Style Contact Form */}
        <div className="lg:col-span-7 flex flex-col">
          <div className="rounded-2xl bg-[#12161C] border border-[#00D4FF]/20 shadow-[0_16px_48px_rgba(0,0,0,0.7)] overflow-hidden">
            <WindowChrome
              title="direct_contact_form.json"
              icon="terminal"
              tag="FORM"
            />

            {isSent ? (
              /* True Amber Micro-Reward Moment for Successful Submission (Requirement 3) */
              <div className="p-8 sm:p-12 flex flex-col items-center justify-center text-center gap-4 bg-[#0B0F13]">
                <div className="w-14 h-14 rounded-full bg-[#FF9F45]/15 border border-[#FF9F45] text-[#FF9F45] flex items-center justify-center shadow-[0_0_24px_rgba(255,159,69,0.45)]">
                  <span className="material-symbols-outlined text-3xl">check</span>
                </div>
                <h3 className="font-display text-xl sm:text-2xl font-bold text-[#EAF2F5]">
                  MESSAGE TRANSMITTED SUCCESSFULLY
                </h3>
                <p className="font-body text-xs sm:text-sm text-[#5B6B75] max-w-md">
                  Direct message acknowledged. A response will be dispatched to your return email address within 24 operational hours.
                </p>
                <button
                  onClick={() => {
                    setIsSent(false);
                    setFormData({ name: '', email: '', message: '', subsystem: 'ROBOTICS_COLLABORATION' });
                  }}
                  className="mt-4 px-5 py-2 rounded-lg bg-[#182028] hover:bg-[#202934] text-[#00D4FF] font-code text-xs uppercase tracking-wider border border-[#00D4FF]/30 cursor-pointer"
                >
                  SEND ANOTHER MESSAGE
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="p-6 sm:p-8 flex flex-col gap-5 bg-[#0B0F13]">
                {/* Name Field */}
                <div className="flex flex-col gap-1.5">
                  <label className="font-code text-xs text-[#5B6B75] flex items-center gap-2">
                    <span className="text-[#00D4FF]">01.</span>
                    <span className="uppercase tracking-wider">YOUR NAME</span>
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      required
                      placeholder="e.g. Dr. Jennifer Chen"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-4 py-3 rounded-lg bg-[var(--bg-surface-elevated)] border border-[var(--border-subtle)] focus:border-[var(--accent-cyan)] text-[var(--text-primary)] placeholder-[var(--text-muted)] font-body text-xs sm:text-sm focus:outline-none transition-colors shadow-sm"
                    />
                  </div>
                </div>

                {/* Email Field */}
                <div className="flex flex-col gap-1.5">
                  <label className="font-code text-xs text-[var(--text-muted)] flex items-center gap-2">
                    <span className="text-[var(--accent-cyan)]">02.</span>
                    <span className="uppercase tracking-wider font-semibold">EMAIL ADDRESS</span>
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="j.chen@lab.institution.edu"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg bg-[var(--bg-surface-elevated)] border border-[var(--border-subtle)] focus:border-[var(--accent-cyan)] text-[var(--text-primary)] placeholder-[var(--text-muted)] font-body text-xs sm:text-sm focus:outline-none transition-colors shadow-sm"
                  />
                </div>

                {/* Subsystem Intent Selector */}
                <div className="flex flex-col gap-1.5">
                  <label className="font-code text-xs text-[var(--text-muted)] flex items-center gap-2">
                    <span className="text-[var(--accent-cyan)]">03.</span>
                    <span className="uppercase tracking-wider font-semibold">SUBJECT / TOPIC</span>
                  </label>
                  <select
                    value={formData.subsystem}
                    onChange={(e) => setFormData({ ...formData, subsystem: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg bg-[var(--bg-surface-elevated)] border border-[var(--border-subtle)] focus:border-[var(--accent-cyan)] text-[var(--text-primary)] font-body text-xs sm:text-sm focus:outline-none transition-colors cursor-pointer shadow-sm"
                  >
                    <option value="ROBOTICS_COLLABORATION">Robotics &amp; Embodied AI Collaboration</option>
                    <option value="FULLTIME_RECRUITMENT">Full-Time Engineering Recruitment</option>
                    <option value="RESEARCH_RESIDENCY">Research Fellowship / Residency</option>
                    <option value="TECHNICAL_INQUIRY">Technical / System Inquiry</option>
                  </select>
                </div>

                {/* Message Field */}
                <div className="flex flex-col gap-1.5">
                  <label className="font-code text-xs text-[var(--text-muted)] flex items-center gap-2">
                    <span className="text-[var(--accent-cyan)]">04.</span>
                    <span className="uppercase tracking-wider font-semibold">YOUR MESSAGE</span>
                  </label>
                  <textarea
                    required
                    rows={4}
                    placeholder="Outline project parameters, hardware constraints, or role specifications..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg bg-[var(--bg-surface-elevated)] border border-[var(--border-subtle)] focus:border-[var(--accent-cyan)] text-[var(--text-primary)] placeholder-[var(--text-muted)] font-body text-xs sm:text-sm focus:outline-none transition-colors shadow-sm resize-none"
                  />
                </div>

                {/* Submit Action: Ember Amber Primary CTA Moment (Requirement 3) */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="mt-2 min-h-[48px] w-full px-6 py-3 rounded-lg bg-[#FF9F45] hover:bg-[#ffb066] text-[#2E1500] font-display font-semibold text-sm tracking-wider uppercase flex items-center justify-center gap-2 shadow-[0_0_24px_rgba(255,159,69,0.4)] active:scale-98 transition-all cursor-pointer disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <span className="material-symbols-outlined text-base animate-spin">
                        sync
                      </span>
                      <span>SENDING MESSAGE...</span>
                    </>
                  ) : (
                    <>
                      <span className="material-symbols-outlined text-base font-bold">
                        send
                      </span>
                      <span>SEND DIRECT MESSAGE</span>
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </motion.section>
  );
};
