import React, { useEffect, useState } from 'react';
import { WindowChrome } from '../common/WindowChrome';

interface CodeSnippet {
  filename: string;
  lang: string;
  tag: string;
  lines: string[];
}

const SNIPPETS: CodeSnippet[] = [
  {
    filename: 'synapse_core.py',
    lang: 'Python (PyTorch + ROS2)',
    tag: 'AI + ROS2',
    lines: [
      'import torch.nn as nn',
      'import rclpy',
      'class SynapseCore(nn.Module):',
      '    def __init__(self):',
      "        self.servo = rclpy.create_node('quadruped')",
      '        self.weights = nn.Linear(512, 1024)',
      '    def ignite(self, energy):',
      '        return torch.sigmoid(energy) # Ember spark'
    ]
  },
  {
    filename: 'kinematics_controller.cpp',
    lang: 'C++20 (RT-Kernel)',
    tag: '1000Hz KINEMATICS',
    lines: [
      '#include <rclcpp/rclcpp.hpp>',
      '#include <eigen3/Eigen/Dense>',
      'auto compute_6dof_torques(const State& s) -> Vector6d {',
      '    Matrix6d J = kinematics::jacobian(s.q);',
      '    Vector6d tau = J.transpose() * (s.f_des - s.f_ext);',
      '    return clamp_actuator_limits(tau);',
      '}'
    ]
  },
  {
    filename: 'fleet_orchestrator.go',
    lang: 'Go (eBPF + K8s)',
    tag: 'EDGE MESH',
    lines: [
      'func (m *MeshSwarm) ReplicateConsensus(ctx context.Context) error {',
      '    ebpfRoute := ebpf.NewFastPathFilter(m.nodeID)',
      '    if err := ebpfRoute.AttachInterface("eth0"); err != nil {',
      '        return err',
      '    }',
      '    return m.broadcastHealthTick(ctx, 12 * time.Millisecond)',
      '}'
    ]
  }
];

interface HeroTerminalProps {
  onLineCompiled?: (lineIndex: number) => void;
  onSnippetCycle?: () => void;
}

export const HeroTerminal: React.FC<HeroTerminalProps> = ({
  onLineCompiled,
  onSnippetCycle
}) => {
  const [snippetIndex, setSnippetIndex] = useState(0);
  const [displayedLineCount, setDisplayedLineCount] = useState(1);
  const currentSnippet = SNIPPETS[snippetIndex];

  useEffect(() => {
    const timer = setInterval(() => {
      setDisplayedLineCount((prev) => {
        if (prev < currentSnippet.lines.length) {
          const next = prev + 1;
          onLineCompiled?.(next);
          return next;
        } else {
          // Pause briefly, then cycle to next snippet
          setTimeout(() => {
            setSnippetIndex((idx) => (idx + 1) % SNIPPETS.length);
            setDisplayedLineCount(1);
            onSnippetCycle?.();
          }, 2400);
          return prev;
        }
      });
    }, 700);

    return () => clearInterval(timer);
  }, [currentSnippet.lines.length, onLineCompiled, onSnippetCycle]);

  return (
    <div className="flex flex-col w-full rounded-xl bg-[#12161C] border border-[#00D4FF]/20 shadow-[0_8px_32px_rgba(0,0,0,0.6)] overflow-hidden">
      {/* Window Chrome with authentic Mac traffic lights */}
      <WindowChrome
        title={currentSnippet.filename}
        icon="terminal"
        tag={currentSnippet.lang.split(' ')[0]}
        actionText="NEXT CODE ›"
        onAction={() => {
          setSnippetIndex((prev) => (prev + 1) % SNIPPETS.length);
          setDisplayedLineCount(1);
        }}
      />

      {/* Code Editor Body */}
      <div className="p-4 sm:p-5 bg-[#0B0F13] font-code text-xs sm:text-[13px] leading-relaxed overflow-x-auto text-[#EAF2F5]/80 select-none min-h-[220px]">
        {currentSnippet.lines.slice(0, displayedLineCount).map((line, idx) => (
          <div
            key={idx}
            className="flex items-baseline gap-3 py-0.5 animate-fadeIn"
          >
            <span className="text-[#5B6B75] text-[11px] w-6 select-none shrink-0 text-right">
              {String(idx + 1).padStart(2, '0')}
            </span>
            <div className="tracking-wide">
              {line.includes('import') || line.includes('class') || line.includes('def') || line.includes('func') || line.includes('return') || line.includes('auto') ? (
                <span>
                  <span className="text-[#7B61FF] font-semibold">{line.split(' ')[0]} </span>
                  <span className="text-[#00D4FF]">{line.slice(line.split(' ')[0].length)}</span>
                </span>
              ) : line.includes('#') ? (
                <span className="text-[#FF9F45]/90 italic">{line}</span>
              ) : (
                <span className="text-[#EAF2F5]">{line}</span>
              )}
            </div>
          </div>
        ))}

        {/* Active compiler execution ticker (Clean plain-English indicator) */}
        <div className="flex items-center gap-2 mt-4 pt-3 border-t border-[#182028] text-xs">
          <span className="material-symbols-outlined text-[14px] text-[#00D4FF] animate-spin" style={{ animationDuration: '3s' }}>
            sync
          </span>
          <span className="text-[#00D4FF] font-medium tracking-wide">
            Compiling robot control algorithm...
          </span>
          <span className="w-2 h-4 bg-[#FF9F45] inline-block animate-pulse ml-auto" />
        </div>
      </div>
    </div>
  );
};
