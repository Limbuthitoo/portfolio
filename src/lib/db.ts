import fs from 'fs';
import path from 'path';
import { Project, Experience, SiteConfig } from '@/types';
import { projects as seedProjects } from '@/data/projects';
import { experiences as seedExperiences } from '@/data/experience';
import { siteConfig as seedConfig } from '@/data/siteConfig';

const BUNDLED_DIR = path.join(process.cwd(), 'content');
const WRITABLE_DIR = process.env.VERCEL ? '/tmp/content' : BUNDLED_DIR;

function ensureDir() {
  if (!fs.existsSync(WRITABLE_DIR)) fs.mkdirSync(WRITABLE_DIR, { recursive: true });
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
    /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(p.slug) &&
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
    /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(e.id) &&
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
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const baseValid =
    isNonEmptyString(c.name) &&
    typeof c.title === 'string' &&
    typeof c.role === 'string' &&
    typeof c.description === 'string' &&
    typeof c.email === 'string' &&
    emailRegex.test(c.email) &&
    typeof c.social === 'object' && c.social !== null &&
    typeof c.availability === 'string' &&
    typeof c.location === 'string';
  if (!baseValid) return false;
  // Optional array fields
  if (c.roles !== undefined && !isStringArray(c.roles)) return false;
  if (c.techStack !== undefined && !isStringArray(c.techStack)) return false;
  if (c.highlights !== undefined && (!Array.isArray(c.highlights) || !c.highlights.every((h: unknown) => h && typeof h === 'object' && typeof (h as Record<string, unknown>).value === 'string' && typeof (h as Record<string, unknown>).label === 'string'))) return false;
  if (c.skills !== undefined && (!Array.isArray(c.skills) || !c.skills.every((s: unknown) => s && typeof s === 'object' && typeof (s as Record<string, unknown>).label === 'string' && isStringArray((s as Record<string, unknown>).skills)))) return false;
  if (c.capabilities !== undefined && (!Array.isArray(c.capabilities) || !c.capabilities.every((cap: unknown) => cap && typeof cap === 'object' && typeof (cap as Record<string, unknown>).category === 'string' && isStringArray((cap as Record<string, unknown>).skills)))) return false;
  return true;
}

function readJSON<T>(file: string, fallback: T): T {
  try {
    const writablePath = path.join(WRITABLE_DIR, file);
    if (fs.existsSync(writablePath)) {
      return JSON.parse(fs.readFileSync(writablePath, 'utf-8'));
    }
    const bundledPath = path.join(BUNDLED_DIR, file);
    if (fs.existsSync(bundledPath)) {
      return JSON.parse(fs.readFileSync(bundledPath, 'utf-8'));
    }
  } catch {
    // Fall through on parse errors
  }
  return fallback;
}

function writeJSON(file: string, data: unknown) {
  ensureDir();
  fs.writeFileSync(path.join(WRITABLE_DIR, file), JSON.stringify(data, null, 2));
  // On Vercel, also try to write to the bundled dir so it survives within the same deployment
  if (WRITABLE_DIR !== BUNDLED_DIR) {
    try {
      fs.writeFileSync(path.join(BUNDLED_DIR, file), JSON.stringify(data, null, 2));
    } catch {
      // Bundled dir may be read-only on some platforms
    }
  }
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
let seeded = false;
export function seedIfEmpty() {
  if (seeded) return;
  seeded = true;
  ensureDir();
  const hasFile = (f: string) =>
    fs.existsSync(path.join(WRITABLE_DIR, f)) || fs.existsSync(path.join(BUNDLED_DIR, f));
  if (!hasFile('projects.json')) {
    writeJSON('projects.json', seedProjects);
  }
  if (!hasFile('experience.json')) {
    writeJSON('experience.json', seedExperiences);
  }
  if (!hasFile('config.json')) {
    writeJSON('config.json', seedConfig);
  }
}
