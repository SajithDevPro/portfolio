import React, { useState } from 'react';
import { WindowChrome } from './WindowChrome';

interface DiagnosticsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DiagnosticsModal: React.FC<DiagnosticsModalProps> = ({
  isOpen,
  onClose
}) => {
  const [inputVal, setInputVal] = useState('');
  const [history, setHistory] = useState<Array<{ cmd: string; res: string }>>([
    {
      cmd: 'sys_diagnostics --all',
      res: 'GENESIS OS v4.2 [EMBODIED ROBOTICS & EDGE ML]\nAll 14 ROS2 nodes running at nominal frequency (1000 Hz).\nGPU Tensor Cores: Jetson AGX Orin initialized, 0 errors.'
    }
  ]);

  if (!isOpen) return null;

  const handleCommand = (e: React.FormEvent) => {
    e.preventDefault();
    const cmd = inputVal.trim();
    if (!cmd) return;

    let res = '';
    const lower = cmd.toLowerCase();

    if (lower === 'help') {
      res = 'AVAILABLE COMMANDS:\n- status       : Query system status & battery loop\n- kinematics   : 6-DOF Jacobian condition number\n- vit          : Check Vision Transformer inference latency\n- clear        : Clear diagnostic terminal\n- exit         : Close diagnostics window';
    } else if (lower === 'status') {
      res = 'SYS_STATUS: ONLINE 99.8%\nTEMP: 42.6°C [NOMINAL]\nACTUATOR BUS: CAN-FD 1Mbps [HEALTHY]\nK8S EDGE MESH: 3/3 NODES IN CONSENSUS';
    } else if (lower === 'kinematics') {
      res = 'INVERSE KINEMATICS DYNAMICS:\n6-DOF Jacobian calculated with damped least squares (DLS).\nSingularity avoidance active: condition index = 0.892 (Optimal)';
    } else if (lower === 'vit') {
      res = 'VISION TRANSFORMER LATENCY:\nInput: 1920x1080 @ 120 FPS\nBatch size: 1 (INT8 Quantized)\nMean latency: 8.2ms per frame on TensorRT';
    } else if (lower === 'clear') {
      setHistory([]);
      setInputVal('');
      return;
    } else if (lower === 'exit' || lower === 'quit') {
      onClose();
      return;
    } else {
      res = `command not recognized: '${cmd}'. Type 'help' for available diagnostic commands.`;
    }

    setHistory((prev) => [...prev, { cmd, res }]);
    setInputVal('');
  };

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 bg-[#0A0E12]/80 backdrop-blur-md flex items-center justify-center p-4 select-none"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-2xl rounded-2xl bg-[#12161C] border border-[#00D4FF]/30 shadow-[0_24px_64px_rgba(0,0,0,0.8)] overflow-hidden flex flex-col"
      >
        <WindowChrome
          title="genesis_diagnostics_daemon.sh"
          icon="terminal"
          tag="INTERACTIVE"
          actionText="CLOSE [ESC]"
          onAction={onClose}
        />

        <div className="p-5 bg-[#0B0F13] font-code text-xs leading-relaxed text-[#EAF2F5] min-h-[300px] max-h-[460px] overflow-y-auto flex flex-col gap-3">
          <div className="text-[#5B6B75] pb-2 border-b border-[#182028]">
            Genesis Embodied Telemetry Shell [Version 4.2.0-release]
            <br />
            Type <span className="text-[#00D4FF]">help</span> to view available system diagnostics commands.
          </div>

          {history.map((item, idx) => (
            <div key={idx} className="flex flex-col gap-1">
              <div className="flex items-center gap-2 text-[#00D4FF]">
                <span className="text-[#5B6B75]">›</span>
                <span className="font-semibold">{item.cmd}</span>
              </div>
              <div className="whitespace-pre-wrap text-[#EAF2F5]/85 pl-4 text-[11px] leading-normal font-normal">
                {item.res}
              </div>
            </div>
          ))}

          <form onSubmit={handleCommand} className="flex items-center gap-2 mt-auto pt-3 border-t border-[#182028]">
            <span className="text-[#00D4FF] font-bold">›</span>
            <input
              type="text"
              autoFocus
              placeholder="type 'help', 'status', 'kinematics'..."
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              className="w-full bg-transparent text-[#EAF2F5] font-code text-xs focus:outline-none placeholder-[#5B6B75]"
            />
            <span className="w-2 h-4 bg-[#00D4FF] animate-pulse" />
          </form>
        </div>
      </div>
    </div>
  );
};
