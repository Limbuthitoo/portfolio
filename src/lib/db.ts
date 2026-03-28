import fs from 'fs';
import path from 'path';
import { Project, Experience, SiteConfig } from '@/types';
import { projects as seedProjects } from '@/data/projects';
import { experiences as seedExperiences } from '@/data/experience';
import { siteConfig as seedConfig } from '@/data/siteConfig';

const CONTENT_DIR = path.join(process.cwd(), 'content');

function ensureDir() {
  if (!fs.existsSync(CONTENT_DIR)) fs.mkdirSync(CONTENT_DIR, { recursive: true });
}

function isNonEmptyString(val: unknown): val is string {
  return typeof val === 'string' && val.trim().length > 0;
}

function isStringArray(val: unknown): val is string[] {
  return Array.isArray(val) && val.every((v) => typeof v === 'string');
}

export function validateProject(data: unknown): data is Project {
  if (!data || typeof data !== 'object') return false;
  const p = data as Record<string, unknown>;
  return (
    isNonEmptyString(p.slug) &&
    isNonEmptyString(p.title) &&
    isNonEmptyString(p.category) &&
    (p.type === 'uiux' || p.type === 'frontend' || p.type === 'other') &&
    typeof p.description === 'string' &&
    typeof p.longDescription === 'string' &&
    typeof p.problem === 'string' &&
    typeof p.solution === 'string' &&
    typeof p.impact === 'string' &&
    typeof p.thumbnail === 'string' &&
    isStringArray(p.images) &&
    isStringArray(p.technologies) &&
    typeof p.role === 'string' &&
    typeof p.year === 'string' &&
    (p.liveUrl === undefined || typeof p.liveUrl === 'string') &&
    typeof p.featured === 'boolean'
  );
}

export function validateExperience(data: unknown): data is Experience {
  if (!data || typeof data !== 'object') return false;
  const e = data as Record<string, unknown>;
  return (
    isNonEmptyString(e.id) &&
    isNonEmptyString(e.role) &&
    isNonEmptyString(e.company) &&
    typeof e.period === 'string' &&
    typeof e.description === 'string' &&
    isStringArray(e.highlights)
  );
}

export function validateSiteConfig(data: unknown): data is SiteConfig {
  if (!data || typeof data !== 'object') return false;
  const c = data as Record<string, unknown>;
  return (
    isNonEmptyString(c.name) &&
    typeof c.title === 'string' &&
    typeof c.role === 'string' &&
    typeof c.description === 'string' &&
    typeof c.email === 'string' &&
    typeof c.social === 'object' && c.social !== null &&
    typeof c.availability === 'string' &&
    typeof c.location === 'string'
  );
}

function readJSON<T>(file: string, fallback: T): T {
  const p = path.join(CONTENT_DIR, file);
  if (!fs.existsSync(p)) return fallback;
  return JSON.parse(fs.readFileSync(p, 'utf-8'));
}

function writeJSON(file: string, data: unknown) {
  ensureDir();
  fs.writeFileSync(path.join(CONTENT_DIR, file), JSON.stringify(data, null, 2));
}

// --- Projects ---
export function getProjects(): Project[] {
  const projects = readJSON<Project[]>('projects.json', []);
  // Migrate legacy projects without type field
  return projects.map((p) => ({
    ...p,
    type: p.type || 'frontend',
  }));
}

export function getProjectBySlug(slug: string): Project | undefined {
  return getProjects().find((p) => p.slug === slug);
}

export function saveProject(project: Project) {
  const all = getProjects();
  const idx = all.findIndex((p) => p.slug === project.slug);
  if (idx >= 0) all[idx] = project;
  else all.push(project);
  writeJSON('projects.json', all);
}

export function deleteProject(slug: string) {
  writeJSON('projects.json', getProjects().filter((p) => p.slug !== slug));
}

// --- Experiences ---
export function getExperiences(): Experience[] {
  return readJSON('experience.json', []);
}

export function getExperienceById(id: string): Experience | undefined {
  return getExperiences().find((e) => e.id === id);
}

export function saveExperience(exp: Experience) {
  const all = getExperiences();
  const idx = all.findIndex((e) => e.id === exp.id);
  if (idx >= 0) all[idx] = exp;
  else all.push(exp);
  writeJSON('experience.json', all);
}

export function deleteExperience(id: string) {
  writeJSON('experience.json', getExperiences().filter((e) => e.id !== id));
}

// --- Config ---
export function getSiteConfig(): SiteConfig {
  return readJSON('config.json', seedConfig);
}

export function saveSiteConfig(config: SiteConfig) {
  writeJSON('config.json', config);
}

// --- Password ---
export function getStoredPasswordHash(): string | null {
  const data = readJSON<{ hash: string }>('auth.json', { hash: '' });
  return data.hash || null;
}

export function savePasswordHash(hash: string) {
  writeJSON('auth.json', { hash });
}

// --- Seed ---
export function seedIfEmpty() {
  ensureDir();
  if (!fs.existsSync(path.join(CONTENT_DIR, 'projects.json'))) {
    writeJSON('projects.json', seedProjects);
  }
  if (!fs.existsSync(path.join(CONTENT_DIR, 'experience.json'))) {
    writeJSON('experience.json', seedExperiences);
  }
  if (!fs.existsSync(path.join(CONTENT_DIR, 'config.json'))) {
    writeJSON('config.json', seedConfig);
  }
}
