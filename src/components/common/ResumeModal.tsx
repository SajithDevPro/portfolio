import React from 'react';
import { WindowChrome } from './WindowChrome';

interface ResumeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ResumeModal: React.FC<ResumeModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 bg-[#0A0E12]/85 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 select-none"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-3xl rounded-2xl bg-[#12161C] border border-[#00D4FF]/30 shadow-[0_24px_64px_rgba(0,0,0,0.8)] overflow-hidden flex flex-col max-h-[90vh]"
      >
        <WindowChrome
          title="Elara_Vance_Resume_SpecSheet.pdf"
          icon="description"
          tag="VERIFIED_CV"
          actionText="CLOSE [ESC]"
          onAction={onClose}
        />

        <div className="p-6 sm:p-8 bg-[#0B0F13] overflow-y-auto flex flex-col gap-6 text-[#EAF2F5]">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-[#182028] pb-5 gap-3">
            <div>
              <h2 className="font-display text-2xl font-bold text-[#EAF2F5]">
                ELARA VANCE
              </h2>
              <p className="font-code text-xs text-[#00D4FF]">
                Software Systems Engineer · Autonomous Robotics &amp; Distributed ML
              </p>
            </div>
            <div className="font-code text-xs text-[#5B6B75] text-left sm:text-right">
              <div>Seattle, WA (US Citizen)</div>
              <div>elara.vance.robotics@genesis.engineering</div>
            </div>
          </div>

          {/* Education */}
          <div className="flex flex-col gap-2">
            <span className="font-code text-xs text-[#7B61FF] font-semibold uppercase tracking-wider">
              EDUCATION
            </span>
            <div className="flex flex-col sm:flex-row sm:justify-between font-body text-sm">
              <span className="font-semibold text-[#EAF2F5]">
                B.S. in Software Systems Engineering (Robotics &amp; Autonomous Systems Focus)
              </span>
              <span className="font-code text-xs text-[#5B6B75]">Graduating June 2026</span>
            </div>
            <p className="font-body text-xs text-[#5B6B75]">
              GPA: 3.92 / 4.0 · Dean's List · Autonomous Vehicles Laboratory Lead
            </p>
          </div>

          {/* Technical Skills Summary */}
          <div className="flex flex-col gap-2">
            <span className="font-code text-xs text-[#7B61FF] font-semibold uppercase tracking-wider">
              TECHNICAL COMPETENCIES
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-code text-[#EAF2F5]/85">
              <div>
                <span className="text-[#5B6B75]">Languages: </span>
                C++20, Python 3, Go, Rust, Embedded C, Verilog
              </div>
              <div>
                <span className="text-[#5B6B75]">Robotics: </span>
                ROS2 (Humble/Iron), Rigid Body Dynamics, RT-Preempt, CANopen
              </div>
              <div>
                <span className="text-[#5B6B75]">ML / Vision: </span>
                PyTorch, TensorRT, CUDA, Isaac Gym, OpenCV, ONNX
              </div>
              <div>
                <span className="text-[#5B6B75]">Cloud / Edge: </span>
                Kubernetes (K3s), eBPF, Docker, gRPC, Prometheus, Linux Kernel
              </div>
            </div>
          </div>

          {/* Research & Engineering Experience */}
          <div className="flex flex-col gap-4">
            <span className="font-code text-xs text-[#7B61FF] font-semibold uppercase tracking-wider">
              ENGINEERING EXPERIENCE &amp; HIGHLIGHTS
            </span>

            <div className="flex flex-col gap-1">
              <div className="flex flex-col sm:flex-row sm:justify-between font-body text-xs sm:text-sm">
                <span className="font-semibold text-[#00D4FF]">
                  Lead Robotics Systems Engineer — Autonomous Quadruped Project
                </span>
                <span className="font-code text-xs text-[#5B6B75]">2024 – Present</span>
              </div>
              <ul className="list-disc list-inside font-body text-xs text-[#5B6B75] flex flex-col gap-1 pl-1">
                <li>Formulated 1000 Hz real-time impedance control and domain-randomized RL locomotion gait.</li>
                <li>Reduced dynamic impact recovery time to 40ms under continuous 35° gravel incline perturbations.</li>
              </ul>
            </div>

            <div className="flex flex-col gap-1">
              <div className="flex flex-col sm:flex-row sm:justify-between font-body text-xs sm:text-sm">
                <span className="font-semibold text-[#00D4FF]">
                  Embedded ML Researcher — Edge Vision Transformer (Jetson AGX Orin)
                </span>
                <span className="font-code text-xs text-[#5B6B75]">2023 – 2024</span>
              </div>
              <ul className="list-disc list-inside font-body text-xs text-[#5B6B75] flex flex-col gap-1 pl-1">
                <li>Optimized attention mechanism with custom TensorRT INT8 quantization calibration.</li>
                <li>Achieved 120.4 FPS throughput with 99.4% micro-obstacle segmentation precision within a 14.2W envelope.</li>
              </ul>
            </div>
          </div>

          {/* Download and Print Actions */}
          <div className="flex justify-end gap-3 pt-4 border-t border-[#182028]">
            <button
              onClick={() => window.print()}
              className="px-4 py-2 rounded-lg bg-[#182028] hover:bg-[#202934] text-[#EAF2F5] font-code text-xs border border-[#182028] flex items-center gap-1.5 cursor-pointer"
            >
              <span className="material-symbols-outlined text-sm">print</span>
              <span>PRINT</span>
            </button>
            <button
              onClick={() => {
                alert('Downloading Elara_Vance_Resume_SpecSheet.pdf');
              }}
              className="px-5 py-2 rounded-lg bg-[#FF9F45] hover:bg-[#ffb066] text-[#2E1500] font-display font-semibold text-xs tracking-wider uppercase flex items-center gap-1.5 shadow-[0_0_16px_rgba(255,159,69,0.3)] cursor-pointer"
            >
              <span className="material-symbols-outlined text-sm">download</span>
              <span>DOWNLOAD PDF</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
