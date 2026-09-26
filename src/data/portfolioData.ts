import { Project, SkillModule, InterestItem } from '../types';

export const PROFILE_IMAGE = 'https://lh3.googleusercontent.com/aida-public/AB6AXuAJYwXOzvIfofAn61PY23_o0II4Tw6tieDA_Jv6gC6CHO5P0oQmJhMbKlxlVDZi7Olefr0lolU5tUQCY3NYmLcAf8J2lANub0ko0xrqngBHruaPNshjFf-c5mjLnjL8tlSvry2OqIVcLge53DrSSa6W_FENrawPbZNMr0FVbxoFXsMIgDYZQcv9kAMCniY_5hGVL-rYm8gqvN_WCJb-q6MfC6ISnjEUqIq4XCRQ2TcvFhjQf3JQSjsJ';

export const EMBLEM_IMAGE = 'https://lh3.googleusercontent.com/aida/AEtjO1VAArHWHBANEuJZJXwjIoeW0mxgLfVbeNmOJFUCs4BOcIrt8eGWo3pFbTusmLDbiLg-epWnpy8yZfkYN2KQiFfY1aTR8yzKr6GVe-5zcC1LWjQfYMJIuSSYMfW3GvDeXv-9rCeGEeCAghKGkyNG2oiPtUQU5N132CHjeaE85uPC3jRYRBIWuGM6U4jHuG2KwIb1oyN0GikcuE12gltwDoyjv3XdC9e_PYlft-ElAtLVTjphf9WOA3l9DJI';

export const PROJECTS: Project[] = [
  {
    id: 'proj-1',
    slug: 'quadruped-kinematics',
    title: 'Adaptive Quadruped Kinematics',
    category: 'robotics',
    categoryLabel: 'Robotics & Control',
    tagline: 'Bio-inspired 12-DOF locomotion under unpredictable rough terrain',
    outcome: '0.04s terrain response · 3.2m/s stable dash',
    image: '/src/assets/images/project_quadruped_robotics_1790353205409.jpg',
    problem: 'Traditional model predictive control (MPC) quadruped gaits fail when surface friction coefficients fluctuate drastically between concrete, gravel, and wet industrial grating, causing severe joint slippage.',
    approach: 'Formulated a hybrid architecture pairing a high-frequency (1kHz) ROS2 C++ impedance controller with an on-board PyTorch policy trained through domain randomization in Isaac Gym.',
    stack: ['ROS2 Humble', 'C++20', 'PyTorch', 'Isaac Gym', 'Can-Bus 2.0', 'RT-Preempt Linux'],
    role: 'Lead Robotics Architecture & Kinematics Formulation',
    result: 'Achieved continuous dynamic locomotion across 35° incline gravel with zero loss of contact stability and 40ms dynamic recovery time upon impact perturbation.',
    specs: [
      { label: 'Control Loop', value: '1000 Hz RT-Kernel' },
      { label: 'Actuation', value: '12x Brushless Planetary Servos' },
      { label: 'Latency', value: '3.8ms Sensor-to-Actuator' },
      { label: 'Peak Velocity', value: '3.2 m/s' }
    ],
    githubUrl: 'https://github.com/elaravance/adaptive-quadruped',
    demoUrl: '#demo'
  },
  {
    id: 'proj-2',
    slug: 'edge-tensor-vit',
    title: 'Edge Tensor Vision Transformer',
    category: 'ai_ml',
    categoryLabel: 'AI/ML & Vision',
    tagline: 'Quantized spatio-temporal ViT for 120 FPS micro-obstacle segmentation',
    outcome: '99.4% precision · 8.2ms per frame on Jetson Orin',
    image: '/src/assets/images/project_edge_vit_vision_1790353220508.jpg',
    problem: 'Full-attention Vision Transformers exceed the compute and thermal envelopes of embedded edge platforms on agile autonomous inspection rovers.',
    approach: 'Designed a sparse shifted-window attention model with custom TensorRT INT8 calibration and layer fusion, bypassing memory bandwidth bottlenecks.',
    stack: ['Python 3.11', 'PyTorch', 'NVIDIA TensorRT', 'CUDA 12', 'Jetson AGX Orin', 'OpenCV'],
    role: 'ML Research & TensorRT Optimization Engineer',
    result: 'Compressed model footprint by 68% while sustaining 99.4% segmentation precision across high-speed dynamic occlusion tests at 120 FPS.',
    specs: [
      { label: 'Model Size', value: '18.4 MB (INT8 Quantized)' },
      { label: 'Throughput', value: '120.4 FPS @ 1080p' },
      { label: 'Mean IOU', value: '88.7% Complex Clutter' },
      { label: 'Power Draw', value: '14.2W Embedded Budget' }
    ],
    githubUrl: 'https://github.com/elaravance/edge-tensor-vit',
    demoUrl: '#demo'
  },
  {
    id: 'proj-3',
    slug: 'synapse-k8s-cluster',
    title: 'Synapse Edge K8s Fleet Mesh',
    category: 'cloud',
    categoryLabel: 'Distributed Cloud',
    tagline: 'Zero-downtime distributed orchestrator for multi-agent swarm telemetry',
    outcome: '<12ms peer mesh sync · 500+ simulated nodes',
    image: '/src/assets/images/project_cloud_k8s_cluster_1790353233539.jpg',
    problem: 'Centrally-managed cloud fleets lose coordination when local RF signal degradation occurs in subterranean or contested industrial facilities.',
    approach: 'Engineered an edge-native K3s control plane with decentralized eBPF packet routing, local CRD state replication, and dynamic failover mesh clustering.',
    stack: ['Go 1.23', 'Kubernetes / K3s', 'eBPF / Cilium', 'gRPC', 'Prometheus', 'WireGuard'],
    role: 'Distributed Systems & Cloud Infrastructure Architect',
    result: 'Maintained sub-12ms consensus latency across 500 heterogeneous robot endpoints with zero packet loss during simulated uplink severed conditions.',
    specs: [
      { label: 'Sync Latency', value: '<12ms Mesh Peering' },
      { label: 'Nodes Orchestrated', value: '500+ Hybrid Endpoints' },
      { label: 'Failover Time', value: '180ms Autonomous Partition' },
      { label: 'Telemetry Stream', value: '45,000 metrics/sec' }
    ],
    githubUrl: 'https://github.com/elaravance/synapse-k8s-mesh',
    demoUrl: '#demo'
  },
  {
    id: 'proj-4',
    slug: 'haptic-teleoperation-exoskeleton',
    title: 'Neuro-Haptic Actuator Exoskeleton',
    category: 'robotics',
    categoryLabel: 'Robotics & Neural Bio',
    tagline: 'Sub-millimeter bilateral master-slave telemanipulation with tactile feedback',
    outcome: '0.2mm positional accuracy · Force reflection in 6-DOF',
    image: '/src/assets/images/project_haptic_exoskeleton_1790353244137.jpg',
    problem: 'Remote hazardous material manipulation lacks tactile resistance, causing operators to crush fragile samples or overshoot manipulation targets.',
    approach: 'Constructed a custom carbon-fiber exoskeleton arm featuring magnetic encoder telemetry and harmonic drive actuators delivering continuous force reflection.',
    stack: ['FreeRTOS', 'Embedded C', 'STM32H7', 'CANopen', 'Direct Drive Motors', 'Python GUI'],
    role: 'Embedded Hardware & Real-time Firm-logic Engineer',
    result: 'Validated 0.2mm precision peg-in-hole insertion with continuous 1.2N haptic feedback fidelity across 200 human testing cycles.',
    specs: [
      { label: 'Degree of Freedom', value: '6-DOF Master Arm' },
      { label: 'Sample Rate', value: '2500 Hz Hardware Loop' },
      { label: 'Force Bandwidth', value: '45 Hz Tactile Transduction' },
      { label: 'Total Weight', value: '1.42 kg Carbon Frame' }
    ],
    githubUrl: 'https://github.com/elaravance/neuro-haptic-arm',
    demoUrl: '#demo'
  }
];

export const SKILL_MODULES: SkillModule[] = [
  {
    id: 'skill-robotics',
    title: 'Embodied Robotics & Kinematics',
    subtitle: 'Physical Actuation · ROS2 · Embedded Control',
    category: 'robotics',
    description: 'Transforming abstract mathematical trajectories into deterministic joint motions under stringent real-time OS constraints.',
    competencyLevel: 94,
    signalPower: '0.94 PetaFLOPS/W',
    technologies: ['ROS2 Humble / Iron', 'Rigid Body Dynamics', 'Inverse Kinematics', 'RT-Preempt Linux', 'C++20 / C', 'CANbus & EtherCAT', 'Gazebo / Isaac Sim'],
    iconType: 'servo',
    highlights: [
      'Engineered custom 6-DOF trajectory planning pipelines in C++',
      'Designed BLDC motor driver boards with field-oriented control (FOC)',
      '1000 Hz real-time hardware closed-loop actuation experience'
    ]
  },
  {
    id: 'skill-ai',
    title: 'Machine Learning & Edge Vision',
    subtitle: 'Neural Representations · Quantization · TensorRT',
    category: 'ai_ml',
    description: 'Specializing in computer vision models, reinforcement learning for locomotion, and hardware-accelerated edge inference engines.',
    competencyLevel: 91,
    signalPower: '120.4 FPS @ INT8',
    technologies: ['PyTorch & TorchScript', 'NVIDIA TensorRT', 'CUDA Kernel Tuning', 'Diffusion & ViTs', 'Reinforcement Learning', 'ONNX Runtime', 'OpenCV / PointCloud'],
    iconType: 'neural',
    highlights: [
      'Trained zero-shot locomotion policies using Isaac Gym domain randomization',
      'Accelerated spatial vision transformers by 3.4x via custom INT8 quantization',
      'Real-time SLAM & semantic scene segmentation pipelines'
    ]
  },
  {
    id: 'skill-cloud',
    title: 'Cloud Edge & Distributed Fleet Systems',
    subtitle: 'High-Throughput Swarm Mesh · eBPF · Telemetry',
    category: 'cloud',
    description: 'Building resilient cloud-native backbones that aggregate, synchronize, and monitor distributed robot fleets in disconnected networks.',
    competencyLevel: 88,
    signalPower: '<12ms Mesh Sync',
    technologies: ['Kubernetes & K3s', 'eBPF / Cilium', 'Go & Rust', 'gRPC & Protobuf', 'Kafka & ZeroMQ', 'Prometheus & Grafana', 'Docker / Containerd'],
    iconType: 'cluster',
    highlights: [
      'Configured autonomous mesh topology failover with zero control-plane loss',
      'Engineered streaming telemetry pipeline processing 45k robot events/sec',
      'Microservice architectures with reproducible GitOps declarative deployments'
    ]
  }
];

export const INTERESTS: InterestItem[] = [
  {
    id: 'int-1',
    title: 'Autonomous Swarm Dynamics',
    icon: 'hub',
    phrase: 'Emergent decentralized cooperation in nature and silicon',
    description: 'Exploring flocking algorithms and localized stigmergic consensus protocols inspired by ant colonies and starling murmurations.',
    tag: 'SWARM_THEORY'
  },
  {
    id: 'int-2',
    title: 'Custom Mechanical Ergonomics',
    icon: 'keyboard',
    phrase: 'Split orthogonal boards & tailored ZMK firmware',
    description: 'Hand-wiring columnar-staggered split keyboards with custom rotary encoders, Choc low-profile switches, and Bluetooth mesh keymaps.',
    tag: 'HARDWARE_CRAFT'
  },
  {
    id: 'int-3',
    title: 'High-Altitude FPV Aerial Kinematics',
    icon: 'flight_takeoff',
    phrase: 'Manual acro flight testing aerodynamic stability limits',
    description: 'Piloting custom 7-inch carbon quadcopters equipped with analog video feed telemetry to test flight envelopes under mountain turbulence.',
    tag: 'AERO_TEST'
  },
  {
    id: 'int-4',
    title: 'FPGA Synthesizer DSP',
    icon: 'waves',
    phrase: 'Digital sound synthesis compiled to hardware gates',
    description: 'Writing Verilog modules for polyphonic wavetable synthesizers and analog-modeled resonant filters on Xilinx Artix-7 boards.',
    tag: 'VERILOG_DSP'
  }
];

export const TELEMETRY_STATS = [
  {
    label: 'AUTONOMOUS NODES',
    value: '14+ NODES',
    subtext: 'Autonomous ROS2 Navigation Graph',
    progress: 92,
    icon: 'hub'
  },
  {
    label: 'COMPUTER VISION',
    value: '99.4% ACC',
    subtext: 'Custom ViT on Jetson Orin',
    progress: 99,
    icon: 'visibility'
  },
  {
    label: 'EDGE INFERENCE',
    value: '<12ms LAT',
    subtext: 'Distributed K8s Hybrid Cluster',
    progress: 88,
    icon: 'bolt'
  }
];
