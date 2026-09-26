export type ActiveNode = 'hero' | 'about' | 'skills' | 'projects' | 'interests' | 'contact';

export interface Project {
  id: string;
  slug: string;
  title: string;
  category: 'robotics' | 'ai_ml' | 'cloud';
  categoryLabel: string;
  tagline: string;
  outcome: string;
  image: string;
  imageMobile?: string;
  problem: string;
  approach: string;
  stack: string[];
  role: string;
  result: string;
  specs: {
    label: string;
    value: string;
  }[];
  githubUrl?: string;
  demoUrl?: string;
}

export interface SkillModule {
  id: string;
  title: string;
  subtitle: string;
  category: 'robotics' | 'ai_ml' | 'cloud';
  description: string;
  competencyLevel: number; // 0 - 100
  signalPower: string;
  technologies: string[];
  iconType: 'servo' | 'neural' | 'cluster';
  highlights: string[];
}

export interface InterestItem {
  id: string;
  title: string;
  icon: string;
  phrase: string;
  description: string;
  tag: string;
}
