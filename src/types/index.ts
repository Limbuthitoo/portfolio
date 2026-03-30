export type ProjectType = 'uiux' | 'frontend' | 'other';

export interface ResearchQuote {
  text: string;
  source: string;
  insight: string;
}

export interface Persona {
  name: string;
  type: string;
  needs: string;
}

export interface DesignDecision {
  question: string;
  answer: string;
}

export interface KeyScreen {
  title: string;
  subtitle: string;
  description: string;
  image: string;
  decisions: string[];
}

export interface Project {
  slug: string;
  title: string;
  category: string;
  type: ProjectType;
  description: string;
  longDescription: string;
  problem: string;
  solution: string;
  impact: string;
  thumbnail: string;
  images: string[];
  technologies: string[];
  role: string;
  year: string;
  liveUrl?: string;
  featured: boolean;
  // UI/UX specific fields
  timeline?: string;
  team?: string;
  responsibilities?: string[];
  research?: {
    summary?: string;
    quotes?: ResearchQuote[];
  };
  personas?: Persona[];
  designDecisions?: DesignDecision[];
  keyScreens?: KeyScreen[];
  learnings?: string[];
  outcome?: {
    title?: string;
    description?: string;
    highlights?: string[];
  };
}

export interface Experience {
  id: string;
  role: string;
  company: string;
  period: string;
  description: string;
  highlights: string[];
}

export interface Skill {
  name: string;
  category: 'design' | 'development' | 'tools';
}

export interface SkillGroup {
  label: string;
  skills: string[];
}

export interface Capability {
  category: string;
  skills: string[];
}

export interface Highlight {
  value: string;
  label: string;
}

export interface SiteConfig {
  name: string;
  title: string;
  role: string;
  description: string;
  email: string;
  social: {
    github?: string;
    linkedin?: string;
    dribbble?: string;
    behance?: string;
    twitter?: string;
  };
  availability: string;
  location: string;
  roles?: string[];
  highlights?: Highlight[];
  techStack?: string[];
  skills?: SkillGroup[];
  capabilities?: Capability[];
}
