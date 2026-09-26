import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

interface RobotCanvas3DProps {
  assemblyProgress: number; // 0 to 1
  isIgnited: boolean;
  onIgnite: () => void;
  externalParticlesCount?: number;
}

export const RobotCanvas3D: React.FC<RobotCanvas3DProps> = ({
  assemblyProgress,
  isIgnited,
  onIgnite
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [hasWebGL, setHasWebGL] = useState(true);
  const [hovered, setHovered] = useState(false);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // Check WebGL availability
    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true,
        powerPreference: 'high-performance'
      });
    } catch {
      setHasWebGL(false);
      return;
    }

    const width = container.clientWidth || 360;
    const height = container.clientHeight || 360;
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 0.4, 5.2);

    // Ambient & Studio Rim Lighting
    const ambientLight = new THREE.AmbientLight(0x00d4ff, 0.6);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0x00d4ff, 1.2);
    keyLight.position.set(3, 4, 3);
    scene.add(keyLight);

    const rimLight = new THREE.DirectionalLight(0x7b61ff, 1.0);
    rimLight.position.set(-3, -2, -2);
    scene.add(rimLight);

    // Amber Core Point Light (Only when ignited)
    const corePointLight = new THREE.PointLight(0xff9f45, isIgnited ? 2.5 : 0.2, 8);
    corePointLight.position.set(0, 0.1, 0.2);
    scene.add(corePointLight);

    // Robot Hierarchical Group (low-poly humanoid wireframe silhouette)
    const robotGroup = new THREE.Group();
    scene.add(robotGroup);

    // Head / Cranium (Low-poly faceted icosahedron)
    const headGeo = new THREE.IcosahedronGeometry(0.38, 1);
    const wireMat = new THREE.MeshStandardMaterial({
      color: 0x00d4ff,
      wireframe: true,
      roughness: 0.2,
      metalness: 0.8,
      transparent: true,
      opacity: 0.85
    });
    const head = new THREE.Mesh(headGeo, wireMat);
    head.position.y = 1.35;
    robotGroup.add(head);

    // Visor sensor / optical band
    const visorGeo = new THREE.BoxGeometry(0.42, 0.08, 0.28);
    const visorMat = new THREE.MeshBasicMaterial({
      color: isIgnited ? 0xff9f45 : 0x00d4ff
    });
    const visor = new THREE.Mesh(visorGeo, visorMat);
    visor.position.set(0, 1.34, 0.2);
    robotGroup.add(visor);

    // Cervical neck actuator
    const neckGeo = new THREE.CylinderGeometry(0.12, 0.15, 0.22, 6);
    const metalMat = new THREE.MeshStandardMaterial({
      color: 0x182028,
      roughness: 0.4,
      metalness: 0.9
    });
    const neck = new THREE.Mesh(neckGeo, metalMat);
    neck.position.y = 1.05;
    robotGroup.add(neck);

    // Clavicle & Chest Chassis (faceted geometry)
    const chestGeo = new THREE.OctahedronGeometry(0.75, 1);
    const chestMat = new THREE.MeshStandardMaterial({
      color: 0x12161c,
      wireframe: false,
      roughness: 0.3,
      metalness: 0.8
    });
    const chest = new THREE.Mesh(chestGeo, chestMat);
    chest.scale.set(1.1, 0.85, 0.65);
    chest.position.y = 0.55;
    robotGroup.add(chest);

    // Glowing Wireframe Chest Cage overlay
    const chestWireMat = new THREE.MeshBasicMaterial({
      color: 0x00d4ff,
      wireframe: true,
      transparent: true,
      opacity: 0.45
    });
    const chestWire = new THREE.Mesh(chestGeo, chestWireMat);
    chestWire.scale.set(1.12, 0.87, 0.67);
    chestWire.position.y = 0.55;
    robotGroup.add(chestWire);

    // Center Core Heart Spark (Icosahedron that pulses with Ember Amber)
    const heartGeo = new THREE.IcosahedronGeometry(0.18, 0);
    const heartMat = new THREE.MeshBasicMaterial({
      color: isIgnited ? 0xff9f45 : 0x00d4ff,
      wireframe: false
    });
    const heart = new THREE.Mesh(heartGeo, heartMat);
    heart.position.set(0, 0.52, 0.28);
    robotGroup.add(heart);

    // Heart Outer Halo
    const haloGeo = new THREE.RingGeometry(0.24, 0.28, 24);
    const haloMat = new THREE.MeshBasicMaterial({
      color: isIgnited ? 0xff9f45 : 0x7b61ff,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.75
    });
    const halo = new THREE.Mesh(haloGeo, haloMat);
    halo.position.set(0, 0.52, 0.29);
    robotGroup.add(halo);

    // Shoulder Actuators & Arms
    const shoulderGeo = new THREE.SphereGeometry(0.14, 8, 8);
    const jointMat = new THREE.MeshStandardMaterial({
      color: 0x00d4ff,
      roughness: 0.2,
      metalness: 0.9,
      emissive: isIgnited ? 0x221100 : 0x002233
    });

    const leftShoulder = new THREE.Mesh(shoulderGeo, jointMat);
    leftShoulder.position.set(-0.95, 0.8, 0);
    robotGroup.add(leftShoulder);

    const rightShoulder = new THREE.Mesh(shoulderGeo, jointMat);
    rightShoulder.position.set(0.95, 0.8, 0);
    robotGroup.add(rightShoulder);

    // Upper arms (wireframe struts)
    const armGeo = new THREE.CylinderGeometry(0.06, 0.08, 0.65, 5);
    const leftArm = new THREE.Mesh(armGeo, wireMat);
    leftArm.position.set(-1.05, 0.42, 0);
    leftArm.rotation.z = 0.2;
    robotGroup.add(leftArm);

    const rightArm = new THREE.Mesh(armGeo, wireMat);
    rightArm.position.set(1.05, 0.42, 0);
    rightArm.rotation.z = -0.2;
    robotGroup.add(rightArm);

    // Spine Column (segment discs)
    const spineGroup = new THREE.Group();
    robotGroup.add(spineGroup);
    for (let i = 0; i < 4; i++) {
      const discGeo = new THREE.CylinderGeometry(0.12 - i * 0.015, 0.14 - i * 0.015, 0.06, 6);
      const disc = new THREE.Mesh(discGeo, metalMat);
      disc.position.y = 0.08 - i * 0.12;
      spineGroup.add(disc);
    }

    // Pelvis Base Anchor
    const pelvisGeo = new THREE.ConeGeometry(0.42, 0.35, 6);
    const pelvis = new THREE.Mesh(pelvisGeo, wireMat);
    pelvis.position.y = -0.45;
    pelvis.rotation.x = Math.PI;
    robotGroup.add(pelvis);

    // Ambient floating particle dust
    const particleCount = 60;
    const particleGeo = new THREE.BufferGeometry();
    const particlePos = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount * 3; i += 3) {
      particlePos[i] = (Math.random() - 0.5) * 6;
      particlePos[i + 1] = (Math.random() - 0.5) * 6;
      particlePos[i + 2] = (Math.random() - 0.5) * 4;
    }
    particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePos, 3));
    const particleMat = new THREE.PointsMaterial({
      color: 0x00d4ff,
      size: 0.035,
      transparent: true,
      opacity: 0.5
    });
    const particles = new THREE.Points(particleGeo, particleMat);
    scene.add(particles);

    // Animation variables
    let animationFrameId: number;
    let clock = new THREE.Clock();

    // Mouse tilt tracking
    let targetRotY = 0;
    let targetRotX = 0;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
      targetRotY = x * 0.35;
      targetRotX = -y * 0.25;
    };

    container.addEventListener('mousemove', handleMouseMove);

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // Smooth camera/robot rotation lerp
      robotGroup.rotation.y += (targetRotY - robotGroup.rotation.y) * 0.08;
      robotGroup.rotation.x += (targetRotX - robotGroup.rotation.x) * 0.08;

      // Idle breathing-like scale & joint micro-movements
      const breathing = Math.sin(elapsedTime * 2.2) * 0.02;
      robotGroup.position.y = breathing;

      // Head slight awareness tilt
      head.rotation.y = Math.sin(elapsedTime * 0.8) * 0.1 + targetRotY * 0.5;
      head.rotation.z = Math.sin(elapsedTime * 1.4) * 0.03;

      // Core heart heartbeat pulse
      const heartPulse = isIgnited
        ? 1.0 + Math.sin(elapsedTime * 6.0) * 0.22
        : 1.0 + Math.sin(elapsedTime * 2.0) * 0.08;
      heart.scale.set(heartPulse, heartPulse, heartPulse);
      halo.rotation.z += 0.015;

      // Slowly rotate particle field
      particles.rotation.y = elapsedTime * 0.04;

      // Update materials if ignition state changed
      if (isIgnited) {
        heartMat.color.setHex(0xff9f45);
        visorMat.color.setHex(0xff9f45);
        haloMat.color.setHex(0xff9f45);
        corePointLight.intensity = 2.4 + Math.sin(elapsedTime * 6) * 0.6;
      } else {
        heartMat.color.setHex(0x00d4ff);
        visorMat.color.setHex(0x00d4ff);
        corePointLight.intensity = 0.4;
      }

      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      container.removeEventListener('mousemove', handleMouseMove);
      if (renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, [isIgnited, hasWebGL]);

  return (
    <div
      ref={mountRef}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="relative w-full h-[320px] sm:h-[380px] lg:h-[420px] flex items-center justify-center overflow-hidden rounded-xl bg-gradient-to-b from-[#12161C]/80 to-[#0A0E12] border border-[#00D4FF]/20 shadow-[0_0_30px_rgba(0,0,0,0.8)]"
    >
      {/* Background wireframe schematic rings */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-20">
        <div className="w-72 h-72 rounded-full border border-dashed border-[#00D4FF]" />
        <div className="absolute w-96 h-96 rounded-full border border-[#7B61FF]/40" />
      </div>

      {/* Status Badge */}
      <div className="absolute top-3 right-3 z-10 flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#0A0E12]/90 border border-[#00D4FF]/30 backdrop-blur-md">
        <span
          className={`w-2 h-2 rounded-full ${
            isIgnited
              ? 'bg-[#FF9F45] shadow-[0_0_8px_#FF9F45] animate-ping-subtle'
              : 'bg-[#00D4FF] shadow-[0_0_8px_#00D4FF]'
          }`}
        />
        <span className="font-code text-[11px] font-medium tracking-wide text-[#EAF2F5]">
          {isIgnited ? '3D Robot · Active' : '3D Robot · Standby'}
        </span>
      </div>

      {/* Mobile / Fallback SVG if WebGL fails */}
      {!hasWebGL && (
        <div className="relative w-48 h-48 flex items-center justify-center">
          <svg
            className="w-full h-full text-[#00D4FF]"
            viewBox="0 0 160 160"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M 64 24 C 64 16 96 16 96 24 L 98 42 L 62 42 Z"
              stroke="#00D4FF"
              strokeWidth="1.5"
            />
            <rect x="74" y="44" width="12" height="10" stroke="#5B6B75" strokeWidth="1" />
            <path d="M 36 60 L 64 54 L 96 54 L 124 60" stroke="#5B6B75" strokeWidth="1.5" />
            <circle cx="80" cy="74" r="14" stroke={isIgnited ? '#FF9F45' : '#00D4FF'} strokeWidth="1.5" />
          </svg>
        </div>
      )}

      {/* Outcome-Based Intro Animation Trigger Button (Requirement 2) */}
      <div className="absolute bottom-4 inset-x-4 z-10 flex flex-col items-center">
        <button
          onClick={onIgnite}
          type="button"
          aria-label="Replay intro animation"
          className={`group flex items-center gap-2 px-5 py-2.5 rounded-full font-display text-xs font-semibold tracking-wider uppercase transition-all duration-300 shadow-lg active:scale-95 cursor-pointer ${
            isIgnited
              ? 'bg-[#FF9F45] text-[#2E1500] shadow-[0_0_24px_rgba(255,159,69,0.5)]'
              : 'bg-[#182028] text-[#00D4FF] border border-[#00D4FF]/40 hover:border-[#00D4FF] hover:bg-[#1f2933]'
          }`}
        >
          <span className="material-symbols-outlined text-base">
            {isIgnited ? 'replay' : 'play_arrow'}
          </span>
          <span>{isIgnited ? '▶ REPLAY THE INTRO ANIMATION' : '▶ PLAY THE INTRO ANIMATION'}</span>
          <span className="text-[10px] font-code opacity-75 font-normal">
            (Ember Spark)
          </span>
        </button>
        <span className="font-code text-[11px] text-[#EAF2F5]/80 mt-1.5 text-center drop-shadow-sm">
          {isIgnited
            ? 'Streams simulated code syntax into the 3D robot in real-time'
            : 'Click to start the code-to-robot animation'}
        </span>
      </div>
    </div>
  );
};
