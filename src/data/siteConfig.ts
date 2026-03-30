import { SiteConfig } from '@/types';

export const siteConfig: SiteConfig = {
  name: 'Bijay Subbalimbu',
  title: 'Creative Frontend Developer',
  role: 'Frontend Developer & UI/UX Designer',
  description:
    '12+ years crafting at the intersection of design & code — from pixels to motion to interfaces.',
  email: 'hello@bijaysubbalimbu.com',
  social: {
    github: 'https://github.com',
    linkedin: 'https://linkedin.com',
    dribbble: 'https://dribbble.com',
    behance: 'https://behance.net',
    twitter: 'https://twitter.com',
  },
  availability: 'Available for freelance',
  location: 'Kathmandu, Nepal',
  roles: [
    'Design Engineer',
    'Frontend Developer',
    'UI/UX Designer',
    'Creative Technologist',
  ],
  highlights: [
    { value: '12+', label: 'Years Exp' },
    { value: '50+', label: 'Projects' },
  ],
  techStack: ['React', 'Next.js', 'TypeScript', 'Tailwind', 'Framer', 'Figma', 'Node', 'Three.js'],
  skills: [
    { label: 'Frontend', skills: ['React', 'Next.js', 'TypeScript', 'Tailwind'] },
    { label: 'Design', skills: ['Figma', 'Motion', 'UI/UX', 'Prototyping'] },
    { label: 'Backend', skills: ['Node.js', 'PostgreSQL', 'REST', 'Git'] },
  ],
  capabilities: [
    { category: 'Design', skills: ['UI/UX Design', 'Graphic Design', 'Motion Graphics', 'Prototyping', 'Design Systems', 'Typography', 'Brand Identity'] },
    { category: 'Development', skills: ['React / Next.js', 'TypeScript', 'Tailwind CSS', 'Framer Motion', 'Three.js', 'Node.js', 'HTML / CSS'] },
    { category: 'Tools', skills: ['Figma', 'After Effects', 'Adobe Suite', 'Blender', 'VS Code', 'Git', 'Vercel'] },
  ],
  currently: [
    { emoji: '🛠', label: 'Building', value: 'Portfolio v2' },
    { emoji: '📚', label: 'Learning', value: 'Three.js & WebGL' },
    { emoji: '🎧', label: 'Listening', value: 'Lo-fi beats' },
  ],
  education: [
    {
      institution: 'Your University',
      degree: 'Bachelor\'s Degree',
      field: 'Computer Science',
      period: '2018 — 2022',
      description: 'Studied computer science with a focus on web technologies and user interface design.',
    },
  ],
};
