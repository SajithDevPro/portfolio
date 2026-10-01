import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';

interface RobotCanvas3DProps {
  assemblyProgress: number; // 0 to 1, drives progressive physical synthesis
  isIgnited: boolean;
  onIgnite: () => void;
  scrollIntensity?: number; // 1 at top of hero, fading toward 0 as user scrolls away
}

export const RobotCanvas3D: React.FC<RobotCanvas3DProps> = ({
  assemblyProgress,
  isIgnited,
  onIgnite,
  scrollIntensity = 1.0,
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [hasWebGL, setHasWebGL] = useState(true);
  const [, setHovered] = useState(false);

  // Keep references to state/props so animation frame reads latest values without tearing
  const stateRef = useRef({
    assemblyProgress,
    isIgnited,
    scrollIntensity,
  });

  useEffect(() => {
    stateRef.current = {
      assemblyProgress,
      isIgnited,
      scrollIntensity,
    };
  }, [assemblyProgress, isIgnited, scrollIntensity]);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true,
        powerPreference: 'high-performance',
      });
    } catch {
      setHasWebGL(false);
      return;
    }

    const width = container.clientWidth || 360;
    const height = container.clientHeight || 360;
    const isMobileDevice = window.innerWidth < 768;
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, isMobileDevice ? 1.25 : 1.6));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.1;
    container.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 0.4, 5.2);

    // Setup Bloom Post-Processing
    let composer: EffectComposer | null = null;
    let bloomPass: UnrealBloomPass | null = null;
    try {
      const renderScene = new RenderPass(scene, camera);
      composer = new EffectComposer(renderer);
      composer.addPass(renderScene);

      bloomPass = new UnrealBloomPass(
        new THREE.Vector2(width, height),
        0.95, // bloom strength
        0.35, // bloom radius
        0.2   // bloom threshold (only emissive components glow)
      );
      composer.addPass(bloomPass);
    } catch (err) {
      console.warn('Bloom post-processing fallback to standard render:', err);
      composer = null;
    }

    // Lighting
    const ambientLight = new THREE.AmbientLight(0x00d4ff, 0.45);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0x00d4ff, 1.0);
    keyLight.position.set(3, 4, 3);
    scene.add(keyLight);

    const rimLight = new THREE.DirectionalLight(0x7b61ff, 0.9);
    rimLight.position.set(-3, -2, -2);
    scene.add(rimLight);

    const corePointLight = new THREE.PointLight(0xff9f45, 0.2, 8);
    corePointLight.position.set(0, 0.52, 0.3);
    scene.add(corePointLight);

    // Root Hierarchical Robot Group
    const robotGroup = new THREE.Group();
    scene.add(robotGroup);

    // Common Materials
    const metalMat = new THREE.MeshStandardMaterial({
      color: 0x12161c,
      roughness: 0.35,
      metalness: 0.9,
    });

    const wireMat = new THREE.MeshStandardMaterial({
      color: 0x00d4ff,
      wireframe: true,
      roughness: 0.2,
      metalness: 0.8,
      transparent: true,
      opacity: 0.85,
      emissive: 0x00d4ff,
      emissiveIntensity: 0.2,
    });

    // 1. Pelvis / Base Anchor (0.00 -> 0.25 Assembly)
    const pelvisGeo = new THREE.ConeGeometry(0.42, 0.35, 6);
    const pelvis = new THREE.Mesh(pelvisGeo, wireMat.clone());
    pelvis.position.y = -0.45;
    pelvis.rotation.x = Math.PI;
    robotGroup.add(pelvis);

    // 2. Spine Column (0.20 -> 0.55 Assembly)
    const spineGroup = new THREE.Group();
    robotGroup.add(spineGroup);
    const spineDiscs: THREE.Mesh[] = [];
    for (let i = 0; i < 4; i++) {
      const discGeo = new THREE.CylinderGeometry(0.12 - i * 0.015, 0.14 - i * 0.015, 0.06, 6);
      const disc = new THREE.Mesh(discGeo, metalMat.clone());
      disc.position.y = 0.08 - i * 0.12;
      spineGroup.add(disc);
      spineDiscs.push(disc);
    }

    // 3. Clavicle & Chest Chassis (0.35 -> 0.65 Assembly)
    const chestGroup = new THREE.Group();
    chestGroup.position.y = 0.55;
    robotGroup.add(chestGroup);

    const chestGeo = new THREE.OctahedronGeometry(0.75, 1);
    const chest = new THREE.Mesh(chestGeo, metalMat);
    chest.scale.set(1.1, 0.85, 0.65);
    chestGroup.add(chest);

    const chestWireMat = new THREE.MeshBasicMaterial({
      color: 0x00d4ff,
      wireframe: true,
      transparent: true,
      opacity: 0.65,
    });
    const chestWire = new THREE.Mesh(chestGeo, chestWireMat);
    chestWire.scale.set(1.12, 0.87, 0.67);
    chestGroup.add(chestWire);

    // 4. Shoulder Actuators & Arm Skeletal Hierarchies (0.50 -> 0.75 Assembly)
    const shoulderGeo = new THREE.SphereGeometry(0.14, 8, 8);
    const jointMat = new THREE.MeshStandardMaterial({
      color: 0x00d4ff,
      roughness: 0.2,
      metalness: 0.9,
      emissive: 0x002233,
      emissiveIntensity: 0.4,
    });

    const armGeo = new THREE.CylinderGeometry(0.06, 0.08, 0.65, 5);

    // Left Arm Joint Pivot Hierarchy
    const leftArmGroup = new THREE.Group();
    leftArmGroup.position.set(-0.95, 0.8, 0); // Shoulder socket pivot
    robotGroup.add(leftArmGroup);

    const leftShoulder = new THREE.Mesh(shoulderGeo, jointMat);
    leftArmGroup.add(leftShoulder);

    const leftArm = new THREE.Mesh(armGeo, wireMat.clone());
    leftArm.position.set(-0.1, -0.38, 0);
    leftArm.rotation.z = 0.2;
    leftArmGroup.add(leftArm);

    // Right Arm Joint Pivot Hierarchy
    const rightArmGroup = new THREE.Group();
    rightArmGroup.position.set(0.95, 0.8, 0); // Shoulder socket pivot
    robotGroup.add(rightArmGroup);

    const rightShoulder = new THREE.Mesh(shoulderGeo, jointMat);
    rightArmGroup.add(rightShoulder);

    const rightArm = new THREE.Mesh(armGeo, wireMat.clone());
    rightArm.position.set(0.1, -0.38, 0);
    rightArm.rotation.z = -0.2;
    rightArmGroup.add(rightArm);

    // 5. Cranium / Head & Visor Sensor (0.65 -> 0.90 Assembly)
    const headGroup = new THREE.Group();
    headGroup.position.y = 1.35;
    robotGroup.add(headGroup);

    const neckGeo = new THREE.CylinderGeometry(0.12, 0.15, 0.22, 6);
    const neck = new THREE.Mesh(neckGeo, metalMat);
    neck.position.y = -0.3;
    headGroup.add(neck);

    const headGeo = new THREE.IcosahedronGeometry(0.38, 1);
    const head = new THREE.Mesh(headGeo, wireMat.clone());
    headGroup.add(head);

    const visorGeo = new THREE.BoxGeometry(0.42, 0.08, 0.28);
    const visorMat = new THREE.MeshStandardMaterial({
      color: 0x00d4ff,
      emissive: 0x00d4ff,
      emissiveIntensity: 2.2,
      roughness: 0.1,
    });
    const visor = new THREE.Mesh(visorGeo, visorMat);
    visor.position.set(0, -0.01, 0.2);
    headGroup.add(visor);

    // 6. Central Biomechanical Heart Core & Halo (0.85 -> 1.00 Assembly & Ignition)
    const heartGroup = new THREE.Group();
    heartGroup.position.set(0, 0.52, 0.28);
    robotGroup.add(heartGroup);

    const heartGeo = new THREE.IcosahedronGeometry(0.18, 0);
    const heartMat = new THREE.MeshStandardMaterial({
      color: 0x00d4ff,
      emissive: 0x00d4ff,
      emissiveIntensity: 2.5,
      roughness: 0.1,
    });
    const heart = new THREE.Mesh(heartGeo, heartMat);
    heartGroup.add(heart);

    const haloGeo = new THREE.RingGeometry(0.24, 0.28, 24);
    const haloMat = new THREE.MeshBasicMaterial({
      color: 0x7b61ff,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.75,
    });
    const halo = new THREE.Mesh(haloGeo, haloMat);
    halo.position.z = 0.01;
    heartGroup.add(halo);

    // Ambient floating particle dust
    const particleCount = 70;
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
      opacity: 0.5,
    });
    const particles = new THREE.Points(particleGeo, particleMat);
    scene.add(particles);

    // Smoothstep progression helper
    const smoothStep = (p: number, min: number, max: number) => {
      if (p <= min) return 0;
      if (p >= max) return 1;
      const t = (p - min) / (max - min);
      return t * t * (3 - 2 * t);
    };

    let animationFrameId: number;
    const clock = new THREE.Clock();
    let currentAssemblyProgress = stateRef.current.assemblyProgress;

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
      if (document.hidden || stateRef.current.scrollIntensity <= 0.04) {
        return;
      }
      const elapsedTime = clock.getElapsedTime();
      const { isIgnited: ignited, assemblyProgress: targetAssembly, scrollIntensity: power } = stateRef.current;

      // Smoothly interpolate assembly progress
      currentAssemblyProgress += (targetAssembly - currentAssemblyProgress) * 0.08;

      // Sequential Assembly Stage Scaling (0.0 -> 1.0)
      const pPelvis = smoothStep(currentAssemblyProgress, 0.0, 0.25);
      pelvis.scale.set(pPelvis, pPelvis, pPelvis);

      spineDiscs.forEach((disc, idx) => {
        const pDisc = smoothStep(currentAssemblyProgress, 0.15 + idx * 0.08, 0.35 + idx * 0.08);
        disc.scale.set(pDisc, pDisc, pDisc);
      });

      const pChest = smoothStep(currentAssemblyProgress, 0.35, 0.65);
      chestGroup.scale.set(pChest, pChest, pChest);

      const pArms = smoothStep(currentAssemblyProgress, 0.5, 0.78);
      leftArmGroup.scale.set(pArms, pArms, pArms);
      rightArmGroup.scale.set(pArms, pArms, pArms);

      const pHead = smoothStep(currentAssemblyProgress, 0.65, 0.9);
      headGroup.scale.set(pHead, pHead, pHead);

      const pHeart = smoothStep(currentAssemblyProgress, 0.85, 1.0);
      heartGroup.scale.set(pHeart, pHeart, pHeart);

      // Smooth camera / robot orientation lerp
      robotGroup.rotation.y += (targetRotY - robotGroup.rotation.y) * 0.08;
      robotGroup.rotation.x += (targetRotX - robotGroup.rotation.x) * 0.08;

      // Idle breathing and scroll-linked depth drift
      const breathing = Math.sin(elapsedTime * 2.2) * 0.02 * power;
      robotGroup.position.y = breathing;
      robotGroup.position.z = (1.0 - power) * -0.8; // Gently recedes in Z space as visitor leaves hero

      // Arm Skeletal Joint Articulation
      const armSway = Math.sin(elapsedTime * 1.6) * 0.06 * power;
      leftArmGroup.rotation.z = armSway - 0.04;
      leftArmGroup.rotation.x = Math.cos(elapsedTime * 1.3) * 0.05 * power;
      rightArmGroup.rotation.z = -armSway + 0.04;
      rightArmGroup.rotation.x = -Math.cos(elapsedTime * 1.3) * 0.05 * power;

      // Head awareness tilt
      headGroup.rotation.y = Math.sin(elapsedTime * 0.8) * 0.1 * power + targetRotY * 0.5;
      headGroup.rotation.z = Math.sin(elapsedTime * 1.4) * 0.03 * power;

      // Heartbeat pulse & Bloom emissive intensity
      const pulseSpeed = ignited ? 6.0 : 2.0;
      const pulseAmp = ignited ? 0.22 : 0.08;
      const heartPulse = 1.0 + Math.sin(elapsedTime * pulseSpeed) * pulseAmp * power;
      heart.scale.set(heartPulse, heartPulse, heartPulse);
      halo.rotation.z += 0.015 * (ignited ? 2.5 : 1.0);

      // Emissive Color & Lighting Shifts
      if (ignited) {
        heartMat.color.setHex(0xff9f45);
        heartMat.emissive.setHex(0xff9f45);
        heartMat.emissiveIntensity = (2.8 + Math.sin(elapsedTime * 6) * 0.6) * power;

        visorMat.color.setHex(0xff9f45);
        visorMat.emissive.setHex(0xff9f45);
        visorMat.emissiveIntensity = 2.4 * power;

        haloMat.color.setHex(0xff9f45);
        corePointLight.intensity = (2.5 + Math.sin(elapsedTime * 6) * 0.5) * power;
        corePointLight.color.setHex(0xff9f45);

        if (bloomPass) {
          bloomPass.strength = 1.25 * power;
        }
      } else {
        heartMat.color.setHex(0x00d4ff);
        heartMat.emissive.setHex(0x00d4ff);
        heartMat.emissiveIntensity = 1.8 * power;

        visorMat.color.setHex(0x00d4ff);
        visorMat.emissive.setHex(0x00d4ff);
        visorMat.emissiveIntensity = 2.0 * power;

        haloMat.color.setHex(0x7b61ff);
        corePointLight.intensity = 0.3 * power;
        corePointLight.color.setHex(0x00d4ff);

        if (bloomPass) {
          bloomPass.strength = 0.85 * power;
        }
      }

      particles.rotation.y = elapsedTime * 0.04;

      // Render with post-processing composer if available, else standard renderer
      if (composer) {
        composer.render();
      } else {
        renderer.render(scene, camera);
      }
    };

    animate();

    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
      if (composer) {
        composer.setSize(w, h);
      }
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
      if (composer) {
        composer.renderTarget1.dispose();
        composer.renderTarget2.dispose();
      }
    };
  }, [hasWebGL]);

  return (
    <div
      ref={mountRef}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="relative w-full h-[320px] sm:h-[380px] lg:h-[420px] flex items-center justify-center overflow-hidden rounded-xl bg-gradient-to-b from-[#12161C]/80 to-[#0A0E12] border border-[#00D4FF]/15 shadow-[0_0_30px_rgba(0,0,0,0.8)]"
    >
      {/* Background wireframe schematic rings */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-15">
        <div className="w-72 h-72 rounded-full border border-dashed border-[#00D4FF]/60" />
        <div className="absolute w-96 h-96 rounded-full border border-[#7B61FF]/30" />
      </div>

      {/* Status Badge */}
      <div className="absolute top-3 right-3 z-10 flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#0A0E12]/90 border border-[#00D4FF]/25 backdrop-blur-md">
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

      {/* Fallback if WebGL fails */}
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
