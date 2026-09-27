import React from 'react';

interface WindowChromeProps {
  title?: string;
  icon?: string;
  tag?: string;
  actionText?: string;
  onAction?: () => void;
  className?: string;
}

export const WindowChrome: React.FC<WindowChromeProps> = ({
  title = 'system_terminal.sh',
  icon = 'terminal',
  tag,
  actionText,
  onAction,
  className = ''
}) => {
  return (
    <div
      className={`flex items-center justify-between px-3.5 py-2.5 bg-[var(--bg-surface-elevated)] border-b border-[var(--border-subtle)] backdrop-blur-md select-none ${className}`}
    >
      {/* Real macOS traffic lights with accurate colors, inner highlights and subtle glow */}
      <div className="flex items-center gap-2">
        <span
          className="w-3 h-3 rounded-full bg-[#FF5F57] shadow-[0_0_8px_rgba(255,95,87,0.5)] ring-1 ring-[#FF5F57]/30 transition-transform hover:scale-110 cursor-pointer"
          title="Close window"
        />
        <span
          className="w-3 h-3 rounded-full bg-[#FEBC2E] shadow-[0_0_8px_rgba(254,188,46,0.5)] ring-1 ring-[#FEBC2E]/30 transition-transform hover:scale-110 cursor-pointer"
          title="Minimize window"
        />
        <span
          className="w-3 h-3 rounded-full bg-[#28C840] shadow-[0_0_8px_rgba(40,200,64,0.5)] ring-1 ring-[#28C840]/30 transition-transform hover:scale-110 cursor-pointer"
          title="Expand window"
        />
      </div>

      {/* Center Title with Icon */}
      <div className="flex items-center gap-1.5 min-w-0 px-2">
        {icon && (
          <span className="material-symbols-outlined text-[13px] text-[var(--text-muted)] shrink-0">
            {icon}
          </span>
        )}
        <span className="font-code text-xs text-[var(--text-primary)] font-medium tracking-wide truncate">
          {title}
        </span>
      </div>

      {/* Right Tag or Action */}
      <div className="flex items-center gap-2">
        {tag && (
          <span className="font-code text-[11px] px-2 py-0.5 rounded bg-[var(--bg-surface)] text-[var(--accent-cyan)] border border-[var(--border-subtle)] tracking-wider uppercase font-semibold">
            {tag}
          </span>
        )}
        {actionText && (
          <button
            onClick={onAction}
            className="text-[11px] font-code text-[var(--accent-amber)] hover:text-[var(--accent-cyan)] transition-colors cursor-pointer"
          >
            {actionText}
          </button>
        )}
      </div>
    </div>
  );
};
